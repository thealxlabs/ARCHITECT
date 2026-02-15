# GitHub App Configuration for ARCHITECT

## Step 1: Create the App on GitHub

Go to: https://github.com/settings/apps/new

Fill out with these exact values:

---

### Basic Information

**GitHub App name:**
```
ARCHITECT
```

**Description:**
```
AI-powered code analysis that generates documentation, quality scores, and security insights in plain English. Get instant feedback on code quality, security vulnerabilities, and best practices.
```

**Homepage URL:**
```
https://archlabs.vercel.app
```

**User authorization callback URL:**
```
https://archlabs.vercel.app/auth/github/callback
```

**Setup URL (optional):**
```
https://archlabs.vercel.app/install
```
☑ Check "Redirect on update"

---

### Webhook

**Webhook URL:**
```
https://archlabs.vercel.app/api/webhook
```

**Webhook secret:**
```
architect_webhook_secret_2026
```
(You can change this to anything secure)

☑ Check "Active"

---

### Permissions

**Repository permissions:**
- Contents: **Read-only** (to read code)
- Metadata: **Read-only** (required, auto-selected)
- Issues: **Read & write** (to create issues)
- Pull requests: **Read & write** (to comment on PRs)

**Account permissions:**
- Email addresses: **Read-only**

---

### Subscribe to events

Check these boxes:
- ☑ Push
- ☑ Pull request  
- ☑ Repository
- ☑ Installation

---

### Where can this GitHub App be installed?

Select: **○ Any account**

---

### Click "Create GitHub App"

After creation, you'll get:
- App ID
- Client ID
- Client Secret (generate this)
- Private Key (generate and download .pem file)

**Save all of these!**

---

## Step 2: I'll Build the Integration

Creating the code now...
