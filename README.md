# //ARCHITECT

**AI-powered code analysis tool.** Paste code, link a GitHub repo, or upload a folder — get instant quality scores, security analysis, and actionable improvement suggestions.

**Live:** [architect.thealxlabs.com](https://architect.thealxlabs.com)

## How It Works

1. Sign in with GitHub, Google, or email
2. Submit code (paste, GitHub URL, or folder upload)
3. AI analyzes code quality, security, performance, and documentation
4. Get scored results with specific feedback
5. Share results via public link

## Quick Start

```bash
git clone https://github.com/thealxlabs/ARCHITECT.git
cd ARCHITECT
npm install
```

Set up your `.env` file (see `.env.example` for required variables):

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_KEY=your_openrouter_api_key
```

Run the database setup SQL from `DATABASE-SETUP.md` in your Supabase SQL Editor, then:

```bash
npm run dev
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Tailwind CSS |
| Build | Vite |
| Routing | React Router v6 |
| Auth + DB | Supabase (PostgreSQL, OAuth, RLS) |
| AI | OpenRouter API (configurable — default: Mistral 7B) |
| Hosting | Vercel |
| Icons | Lucide React |

## Project Structure

```
ARCHITECT/
├── pages/              # Route pages
│   ├── HomePage.tsx        # Public landing
│   ├── Login.tsx           # Auth (GitHub, Google, email)
│   ├── Signup.tsx          # Registration
│   ├── Dashboard.tsx       # Analysis history
│   ├── AnalyzePage.tsx     # Code submission
│   ├── ResultsPage.tsx     # Scored results display
│   └── Settings.tsx        # User settings
├── components/         # Reusable UI
│   ├── Hero.tsx            # Landing page hero
│   ├── InputSection.tsx    # Code input + secret scanning
│   ├── AnalysisLoader.tsx  # Progress animation + timeout
│   └── ProtectedRoute.tsx  # Auth guard
├── services/
│   └── universalAIService.ts  # OpenRouter client + retry + validation
├── lib/
│   └── supabase.ts        # Auth helpers
├── config/
│   ├── api.ts             # Model selection, retry & rate limit config
│   └── auth.ts            # Auth constants
├── types/
│   ├── analysis.ts        # Analysis types
│   └── auth.ts            # Auth types
├── api/
│   └── webhook.ts         # GitHub App webhook handler (Vercel serverless)
├── docs/               # Setup guides, SQL schemas, progress notes
├── constants.ts           # AI system prompt
├── App.tsx                # Router + error boundary + 404
└── archive/               # Deprecated files (reference only)
```

## Routes

| Path | Access | Description |
|------|--------|-------------|
| `/` | Public | Landing page |
| `/login` | Public | Login |
| `/signup` | Public | Registration |
| `/dashboard` | Protected | Analysis history |
| `/analyze` | Protected | Submit code for analysis |
| `/results/:id` | Semi-public | View results (owner or shared) |
| `/share/:token` | Public | Shared analysis link |

## API Rate Limits & Retry

ARCHITECT automatically retries failed API calls with exponential backoff (1.5s → 3s → 6s + jitter). This handles rate limits (429), server errors (5xx), and truncated JSON responses without manual intervention. After 3 failed attempts, the error surfaces to the user with a clear message.

To change the AI model, set `VITE_AI_MODEL` in your `.env` file (e.g. `VITE_AI_MODEL=qwen/qwen-2.5-72b-instruct`). See `config/api.ts` for the full list of available models. The env variable takes priority over the default, so you can run different models per environment without touching code.

## Limitations

ARCHITECT works best with small-to-medium codebases. For large repos, the input is automatically truncated to ~100K characters (roughly 25K tokens) to fit within the model's context window. The AI sees the beginning of your code and a note that it was truncated. For very large projects, consider submitting individual modules or key files rather than the entire codebase.

## Data & Privacy

> **Do not submit sensitive, proprietary, or secret code.** Input is sent to OpenRouter (a third-party API) for analysis. While results are stored in your private Supabase database with row-level security, the code itself passes through OpenRouter's infrastructure during analysis.

Shared links expose only the analysis results (scores, feedback) — not the original code input. Google verification files in `public/` are for domain ownership verification during OAuth setup.

## Testing

No test framework is set up yet. To add frontend tests:

1. Install dependencies: `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`
2. Add to `vite.config.ts`:
   ```ts
   /// <reference types="vitest" />
   export default defineConfig({
     test: { environment: 'jsdom', globals: true, setupFiles: './test/setup.ts' }
   });
   ```
3. Create `test/setup.ts`: `import '@testing-library/jest-dom';`
4. Add script to `package.json`: `"test": "vitest"`
5. Write tests in `__tests__/` or alongside components as `*.test.tsx`

See `SETUP-INSTRUCTIONS.md` for CI integration with GitHub Actions.

## CI/CD

This project deploys to Vercel. To set up automated deployment:

1. Connect your GitHub repo to [Vercel](https://vercel.com)
2. Add environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_KEY`) in Vercel project settings
3. Every push to `main` triggers a deploy automatically

For automated testing, add a GitHub Actions workflow — see `SETUP-INSTRUCTIONS.md` for details.

## Cost

All free tiers: Supabase (50K MAU), Vercel (hobby), OpenRouter (pay-per-use with free models available).

## Docs

| File | Contents |
|------|----------|
| `SETUP-INSTRUCTIONS.md` | Detailed setup, auth, testing & CI/CD |
| `docs/DATABASE-SETUP.md` | SQL schema for Supabase |
| `docs/GITHUB-APP-SETUP.md` | GitHub App integration |
| `docs/DATABASE-GITHUB-APP.sql` | GitHub App database schema |

## Webhooks

The `api/webhook.ts` file is a Vercel serverless function that handles GitHub App webhook events (push, pull request, installation). It verifies the webhook signature using `GITHUB_WEBHOOK_SECRET` and routes events to handlers. Currently the push and PR handlers log events but don't trigger analysis yet (marked as TODO). To configure:

1. Set `GITHUB_WEBHOOK_SECRET` in your Vercel environment variables
2. Point your GitHub App's webhook URL to `https://your-domain.vercel.app/api/webhook`
3. Subscribe to events: `push`, `pull_request`, `installation`, `repository`

See `docs/GITHUB-APP-SETUP.md` for full GitHub App configuration.

## License

MIT — Alexander Wondwossen ([@thealxlabs](https://github.com/thealxlabs))

---

<p align="center">
  <b>Found a bug? Have a suggestion?</b><br>
  <a href="https://github.com/thealxlabs/ARCHITECT/issues/new?template=bug_report.md&labels=bug">Report a Bug</a> · 
  <a href="https://github.com/thealxlabs/ARCHITECT/issues/new?template=feature_request.md&labels=enhancement">Request a Feature</a>
</p>
