import { SYSTEM_PROMPT } from "../constants";
import { OPENROUTER_BASE_URL, ACTIVE_MODEL, RATE_LIMIT_CONFIG } from "../config/api";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface OpenRouterChoice {
  message: { content: string };
}

interface OpenRouterResponse {
  choices?: OpenRouterChoice[];
}

// ---------------------------------------------------------------------------
// Retry helper — exponential backoff with jitter
// ---------------------------------------------------------------------------

/**
 * Retries an async function with exponential backoff.
 *
 * Why exponential backoff?  A fixed delay hammers the server at the exact
 * moment it's telling you to slow down.  Doubling the wait each time gives
 * the API breathing room while still retrying quickly on the first attempt.
 * Jitter (random extra ms) prevents multiple clients from retrying in sync.
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  { maxAttempts = 3, baseDelayMs = 1500 }: { maxAttempts?: number; baseDelayMs?: number } = {}
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const isRetryable = err?.retryable === true;

      // Don't retry non-retryable errors (auth, credits, bad input)
      if (!isRetryable) throw err;

      // Don't wait after the last failed attempt
      if (attempt < maxAttempts - 1) {
        const delayMs = baseDelayMs * Math.pow(2, attempt) + Math.random() * 500;
        console.log(`Retry ${attempt + 1}/${maxAttempts - 1} in ${Math.round(delayMs)}ms...`);
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }

  throw lastError;
}

// ---------------------------------------------------------------------------
// Retryable error
// ---------------------------------------------------------------------------

class APIError extends Error {
  retryable: boolean;
  constructor(message: string, retryable: boolean) {
    super(message);
    this.retryable = retryable;
  }
}

// ---------------------------------------------------------------------------
// Input helpers
// ---------------------------------------------------------------------------

/**
 * Max characters to send to the API.
 *
 * Mistral 7B has a ~32 K token context.  Our system prompt + response budget
 * eat ~2-3 K tokens, leaving ~29 K for input.  1 token ≈ 4 chars, so ~100 K
 * chars is a safe ceiling.  Anything beyond that gets truncated with a note
 * so the LLM knows it's seeing a subset.
 */
const MAX_INPUT_CHARS = 100_000;

function truncateInput(input: string): string {
  if (input.length <= MAX_INPUT_CHARS) return input;

  const truncated = input.slice(0, MAX_INPUT_CHARS);
  return (
    truncated +
    "\n\n[NOTE: Input was truncated to fit within the model's context window. " +
    `Original length: ${input.length.toLocaleString()} chars, showing first ${MAX_INPUT_CHARS.toLocaleString()}.]\n`
  );
}

/** Basic check that the string looks like a real GitHub repo URL. */
function isValidGitHubUrl(url: string): boolean {
  return /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+/.test(url);
}

// ---------------------------------------------------------------------------
// Sensitive data scanner
// ---------------------------------------------------------------------------

/** Patterns that suggest hardcoded secrets in the submitted code. */
const SENSITIVE_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /(?:api[_-]?key|apikey)\s*[:=]\s*['"][^'"]{8,}/i, label: "API key" },
  { pattern: /(?:secret|password|passwd|pwd)\s*[:=]\s*['"][^'"]{4,}/i, label: "password/secret" },
  { pattern: /(?:access[_-]?token|auth[_-]?token)\s*[:=]\s*['"][^'"]{8,}/i, label: "access token" },
  { pattern: /(?:private[_-]?key)\s*[:=]\s*['"][^'"]{8,}/i, label: "private key" },
  { pattern: /-----BEGIN (?:RSA |EC |DSA )?PRIVATE KEY-----/, label: "PEM private key" },
  { pattern: /sk-[a-zA-Z0-9]{20,}/, label: "OpenAI/OpenRouter key" },
  { pattern: /ghp_[a-zA-Z0-9]{36,}/, label: "GitHub personal access token" },
  { pattern: /eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/, label: "JWT token" },
];

/**
 * Scans input for patterns that look like hardcoded secrets.
 * Returns a list of human-readable labels for each type found.
 * This is a best-effort heuristic — not a security guarantee.
 */
export function scanForSecrets(input: string): string[] {
  const found: string[] = [];
  for (const { pattern, label } of SENSITIVE_PATTERNS) {
    if (pattern.test(input) && !found.includes(label)) {
      found.push(label);
    }
  }
  return found;
}

// ---------------------------------------------------------------------------
// AI response validator
// ---------------------------------------------------------------------------

/**
 * Validates and sanitizes the parsed AI response.
 * Ensures scores are numbers in range, arrays are arrays, and strips
 * any unexpected HTML that could cause XSS when rendered.
 */
function validateAIResponse(parsed: Record<string, any>): Record<string, any> {
  // Clamp score to 1-10 range
  const clampScore = (val: unknown): number => {
    const n = Number(val);
    if (isNaN(n)) return 5;
    return Math.max(1, Math.min(10, Math.round(n)));
  };

  // Strip HTML tags from a string (basic XSS prevention)
  const stripHtml = (val: unknown): string => {
    if (typeof val !== "string") return String(val ?? "");
    return val.replace(/<[^>]*>/g, "");
  };

  // Recursively sanitize strings in an object/array
  const sanitize = (obj: unknown): unknown => {
    if (typeof obj === "string") return stripHtml(obj);
    if (Array.isArray(obj)) return obj.map(sanitize);
    if (obj && typeof obj === "object") {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(obj)) {
        clean[k] = sanitize(v);
      }
      return clean;
    }
    return obj;
  };

  const result = sanitize(parsed) as Record<string, any>;

  // Validate top-level score
  if ("overall_score" in result) {
    result.overall_score = clampScore(result.overall_score);
  }

  // Validate category scores
  if (result.scores && typeof result.scores === "object") {
    for (const key of Object.keys(result.scores)) {
      result.scores[key] = clampScore(result.scores[key]);
    }
  }

  // Ensure arrays are actually arrays
  for (const field of ["whats_great", "what_works_well", "needs_improvement", "what_needs_improvement", "security_concerns", "security_issues"]) {
    if (field in result && !Array.isArray(result[field])) {
      console.warn(`Expected array for ${field}, got ${typeof result[field]}. Wrapping.`);
      result[field] = result[field] ? [result[field]] : [];
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export class UniversalAIService {
  private apiKey: string;
  private model: string;

  constructor() {
    const customKey =
      typeof window !== "undefined"
        ? localStorage.getItem("custom_openrouter_key")
        : null;
    this.apiKey = customKey || import.meta.env.VITE_API_KEY || "";

    // Model is configurable via env — falls back to the constant in config/api.ts
    this.model = import.meta.env.VITE_AI_MODEL || ACTIVE_MODEL;

    if (!this.apiKey) {
      console.warn("OpenRouter API Key missing. Get one at https://openrouter.ai/keys");
    }
    if (customKey) {
      console.log("🔑 Using custom OpenRouter API key");
    } else {
      console.log("🤖 Using default OpenRouter API key");
    }
    console.log(`📦 Model: ${this.model}`);
  }

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------

  /**
   * Analyze a codebase string.  Retries automatically on transient failures
   * (rate limits, server errors, truncated JSON).
   */
  async analyzeCodebase(input: string): Promise<Record<string, any>> {
    const safeInput = truncateInput(input.trim());

    if (safeInput.length < 20) {
      throw new APIError(
        "Input is too short for a meaningful analysis. Paste more code or provide a GitHub URL.",
        false
      );
    }

    return withRetry(() => this.callOpenRouter(safeInput), {
      maxAttempts: 3,
      baseDelayMs: 1500,
    });
  }

  /** Expose the GitHub URL validator so InputSection can use it too. */
  static isValidGitHubUrl = isValidGitHubUrl;

  // -------------------------------------------------------------------------
  // Private
  // -------------------------------------------------------------------------

  private async callOpenRouter(input: string): Promise<Record<string, any>> {
    console.log("Starting OpenRouter analysis...");

    const response = await fetch(OPENROUTER_BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer":
          typeof window !== "undefined" ? window.location.href : "http://localhost:3000",
        "X-Title": "ARCHITECT",
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT + "\n\nRespond with valid JSON only. No markdown, no explanations.",
          },
          {
            role: "user",
            content: `Analyze this codebase:\n\n${input}`,
          },
        ],
        temperature: RATE_LIMIT_CONFIG.TEMPERATURE,
        max_tokens: RATE_LIMIT_CONFIG.MAX_TOKENS,
      }),
    });

    // ----- Handle HTTP errors -----
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      this.handleHTTPError(response.status, body);
    }

    // ----- Parse OpenRouter envelope -----
    const data: OpenRouterResponse = await response.json();
    if (!data.choices?.[0]) {
      throw new APIError(
        `API returned unexpected format: ${JSON.stringify(data).substring(0, 200)}`,
        true // might be a transient glitch, worth retrying
      );
    }

    // ----- Extract and parse the JSON content -----
    const parsed = this.parseContent(data.choices[0].message.content);

    // ----- Flatten nested "analysis" key if present -----
    return this.flatten(parsed);
  }

  /**
   * Map HTTP status codes to user-friendly, correctly-tagged errors.
   * Throws — never returns.
   */
  private handleHTTPError(status: number, body: string): never {
    switch (status) {
      case 401:
        throw new APIError("Invalid API key. Get one at https://openrouter.ai/keys", false);
      case 402:
        throw new APIError(
          "No credits. Free models available — check model name, or add credits at https://openrouter.ai/credits",
          false
        );
      case 429:
        throw new APIError(
          "Rate limit reached — retrying automatically...",
          true // retryable!
        );
      case 503:
      case 502:
        throw new APIError(`OpenRouter is temporarily unavailable (${status}). Retrying...`, true);
      default:
        throw new APIError(`OpenRouter error ${status}: ${body.substring(0, 200)}`, status >= 500);
    }
  }

  /** Strip markdown fences, extract JSON object, parse. */
  private parseContent(raw: string): Record<string, any> {
    let content = raw.trim();

    // Strip markdown code fences
    content = content.replace(/```json\n?/g, "").replace(/```\n?$/g, "").replace(/```/g, "").trim();

    // Extract the outermost JSON object
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) content = jsonMatch[0];

    try {
      return JSON.parse(content);
    } catch (err: any) {
      console.error("JSON parse failed:", err.message);
      console.error("First 500 chars:", content.substring(0, 500));

      // Truncated JSON is almost always a max_tokens issue — retryable
      throw new APIError(`Invalid JSON from AI: ${err.message}`, true);
    }
  }

  /**
   * Merge any nested `analysis` sub-object into the root so that
   * AnalyzePage can find fields regardless of how the LLM nests them.
   */
  private flatten(parsed: Record<string, any>): Record<string, any> {
    const flat: Record<string, any> = { ...parsed };
    if (parsed.analysis && typeof parsed.analysis === "object") {
      for (const [key, value] of Object.entries(parsed.analysis)) {
        if (!(key in flat)) flat[key] = value;
      }
    }
    console.log("Flattened result keys:", Object.keys(flat));
    return validateAIResponse(flat);
  }
}

export const aiService = new UniversalAIService();
