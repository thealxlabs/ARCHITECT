# ARCHITECT — Setup Instructions

## Prerequisites

- Node.js 18+
- npm
- A [Supabase](https://supabase.com) account (free tier works)
- An [OpenRouter](https://openrouter.ai) API key (free models available)

## 1. Clone & Install

```bash
git clone https://github.com/thealxlabs/ARCHITECT.git
cd ARCHITECT
npm install
```

## 2. Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

You need three values:

| Variable | Where to get it |
|----------|----------------|
| `VITE_SUPABASE_URL` | Supabase Dashboard → Project Settings → API → URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API → `anon` key |
| `VITE_API_KEY` | [openrouter.ai/keys](https://openrouter.ai/keys) |

**Never commit your `.env` file.** The `.gitignore` already excludes it.

## 3. Database Setup

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project → SQL Editor
3. Copy the SQL from `docs/DATABASE-SETUP.md` and run it
4. This creates the `analyses` table with row-level security policies

## 4. Auth Setup

Authentication is handled by Supabase. To enable OAuth providers:

**GitHub OAuth:**
1. Go to GitHub → Settings → Developer Settings → OAuth Apps → New
2. Set Authorization callback URL to `https://your-supabase-url.supabase.co/auth/v1/callback`
3. Copy Client ID and Secret into Supabase → Authentication → Providers → GitHub

**Google OAuth:**
1. Go to Google Cloud Console → APIs & Services → Credentials → Create OAuth Client
2. Set Authorized redirect URI to `https://your-supabase-url.supabase.co/auth/v1/callback`
3. Copy Client ID and Secret into Supabase → Authentication → Providers → Google

**Email/Password:** Enabled by default in Supabase.

## 5. Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## User Flow

1. Landing page → "Get Started"
2. Login/Signup (GitHub, Google, or email)
3. Dashboard shows past analyses
4. "New Analysis" → paste code / GitHub URL / upload folder
5. AI analyzes and scores the code
6. View results → optionally share via public link

## Routes

| Path | Access | Page |
|------|--------|------|
| `/` | Public | Landing |
| `/login` | Public | Login |
| `/signup` | Public | Signup |
| `/dashboard` | Protected | Analysis history |
| `/analyze` | Protected | Code input |
| `/results/:id` | Semi-public | Results (owner or shared) |
| `/share/:token` | Public | Shared analysis |
| `/settings` | Protected | User settings |

## CI/CD with Vercel

### Automated Deployment

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project → Select your repo
3. Add environment variables in Vercel project settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_KEY`
4. Every push to `main` auto-deploys

### GitHub Actions (optional)

To add CI checks on pull requests, create `.github/workflows/ci.yml`:

```yaml
name: CI
on:
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
          VITE_API_KEY: ${{ secrets.VITE_API_KEY }}
```

Add the secrets in GitHub → Repo Settings → Secrets and Variables → Actions.

## Changing the AI Model

Set `VITE_AI_MODEL` in your `.env` to any OpenRouter model string:

```
VITE_AI_MODEL=qwen/qwen-2.5-72b-instruct
```

If the model is unavailable or errors out, the retry mechanism will attempt 3 times before showing an error. You can see all available models at [openrouter.ai/models](https://openrouter.ai/models).

## Frontend Testing (optional)

No test framework is pre-configured. To add Vitest + React Testing Library:

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

Add a `test` block to `vite.config.ts`:

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './test/setup.ts',
  },
});
```

Create `test/setup.ts`:

```ts
import '@testing-library/jest-dom';
```

Add to `package.json` scripts:

```json
"test": "vitest",
"test:ci": "vitest run"
```

Then update your GitHub Actions workflow to include `npm run test:ci` before the build step.

## Troubleshooting

**"Missing Supabase environment variables"** — Your `.env` file is missing or the values are empty. Double-check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

**Analysis fails with JSON parse error** — The AI model response was truncated. This can happen with long codebases. Try again — shorter responses usually succeed on retry.

**Rate limit error (429)** — OpenRouter's API has per-key rate limits. Wait a minute and try again, or use a different free model in `config/api.ts`.

**OAuth redirect not working** — Make sure your callback URL in GitHub/Google matches your Supabase project URL exactly, including the `/auth/v1/callback` suffix.
