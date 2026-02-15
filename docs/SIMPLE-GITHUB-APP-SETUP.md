# 🚀 SIMPLE GITHUB APP SETUP (5 Minutes)

## Step 1: Create the GitHub App (2 minutes)

1. **Go to:** https://github.com/settings/apps/new

2. **Fill out the form:**

```
GitHub App name: architect-ai
Description: AI code analysis - instant quality scores and documentation
Homepage URL: https://archlabs.vercel.app
```

**Important Settings:**
- ☑ Webhook: UNCHECK "Active" (we'll add this later)
- Repository permissions:
  - Contents: Read-only
  - Metadata: Read-only (auto-selected)
- Where can this app be installed? **Any account**

3. **Click "Create GitHub App"**

4. **You're done!** Copy the app URL (it will be something like):
   ```
   https://github.com/apps/architect-ai
   ```

---

## Step 2: Update Your Code (1 minute)

Open `components/GitHubAppInstall.tsx` and change line 7:

**From:**
```typescript
const githubAppUrl = 'https://github.com/apps/architect-ai/installations/new';
```

**To:**
```typescript
const githubAppUrl = 'https://github.com/apps/YOUR-APP-NAME/installations/new';
```

(Replace YOUR-APP-NAME with whatever you named it)

---

## Step 3: Add Install Button to Dashboard (1 minute)

The button is already created! Just import it in Dashboard.

---

## Step 4: Test It! (1 minute)

1. Push code to GitHub
2. Go to https://archlabs.vercel.app/dashboard
3. Click "Install GitHub App"
4. Install it on a test repo
5. Done! ✅

---

## That's It!

No webhooks, no backend, no database needed yet!

Users can:
1. Install your app on their repos
2. This gives your app READ access to their code
3. They can then paste the repo URL in your analyzer
4. Your app can fetch the code (because it has permission)

Later you can add:
- Webhooks (auto-analyze on push)
- Database (save installations)
- Auto-comments on PRs

But for now, this is PLUG AND PLAY! 🎉
