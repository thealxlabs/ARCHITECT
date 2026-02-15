/** OpenRouter API configuration */
export const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * Available models — free options listed first.
 *
 * To change the model, either:
 *   1. Set VITE_AI_MODEL in your .env file (e.g. VITE_AI_MODEL=qwen/qwen-2.5-72b-instruct)
 *   2. Or change ACTIVE_MODEL below.
 *
 * The env variable takes priority, so you can switch models per-environment
 * (e.g. free model in dev, paid model in prod) without touching code.
 */
export const AI_MODELS = {
  // Free models
  MISTRAL_7B: "mistralai/mistral-7b-instruct",
  QWEN_72B: "qwen/qwen-2.5-72b-instruct",
  LLAMA_8B: "meta-llama/llama-3.1-8b-instruct",
  LLAMA_3B: "meta-llama/llama-3.2-3b-instruct",
  // Paid models (require credits at openrouter.ai/credits)
  CLAUDE_SONNET: "anthropic/claude-3.5-sonnet",
  GPT_4O: "openai/gpt-4o",
} as const;

/** Default model when VITE_AI_MODEL env var is not set */
export const ACTIVE_MODEL = AI_MODELS.MISTRAL_7B;

/**
 * API retry & rate limit configuration.
 *
 * On 429 / 5xx errors the service automatically retries with exponential
 * backoff (1.5s → 3s → 6s + jitter).  After MAX_RETRY_ATTEMPTS failures
 * the error surfaces to the user.
 */
export const RATE_LIMIT_CONFIG = {
  /** Max retry attempts for transient failures (429, 5xx, truncated JSON) */
  MAX_RETRY_ATTEMPTS: 3,
  /** Base delay (ms) before the first retry — doubles each attempt */
  BASE_RETRY_DELAY_MS: 1500,
  /** Max time (ms) before the loader shows a timeout warning to the user */
  ANALYSIS_TIMEOUT_MS: 60_000,
  /** Temperature — lower = more consistent JSON output from the LLM */
  TEMPERATURE: 0.2,
  /** Max tokens for the response — must be enough for the full JSON analysis */
  MAX_TOKENS: 8000,
  /** Max input characters sent to the API (prevents context overflow) */
  MAX_INPUT_CHARS: 100_000,
} as const;
