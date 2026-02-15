# UPDATE GITHUB OAUTH SETTINGS

To make the repo dropdown work, you need to add scopes to your GitHub OAuth:

## Go to Supabase Dashboard

1. https://supabase.com/dashboard
2. Select ARCHITECT project
3. **Authentication** → **Providers** → **GitHub**

## Update Settings

Find the **"Scopes"** field and change it to:
```
repo read:user
```

This allows Claude to:
- `repo` - Read your repositories
- `read:user` - Read your user profile

## Click SAVE

That's it! Now when users connect GitHub, ARCHITECT can see their repos!

---

## Why This Works

- Uses Supabase GitHub OAuth (already configured)
- No backend needed
- Fetches repos using GitHub's API
- Shows dropdown with all your repos
- Click repo → auto-fills URL → analyze!
