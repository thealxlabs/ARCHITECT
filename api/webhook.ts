// API Route: /api/webhook.ts
// This handles GitHub App webhooks (push events, PR comments, etc.)

import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify webhook signature
    const signature = req.headers['x-hub-signature-256'];
    const payload = JSON.stringify(req.body);
    const secret = process.env.GITHUB_WEBHOOK_SECRET || 'architect_webhook_secret_2026';
    
    const hmac = crypto.createHmac('sha256', secret);
    const digest = 'sha256=' + hmac.update(payload).digest('hex');
    
    if (signature !== digest) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = req.headers['x-github-event'];
    const data = req.body;

    console.log(`Received ${event} event from GitHub`);

    // Handle different events
    switch (event) {
      case 'installation':
        await handleInstallation(data);
        break;
      
      case 'push':
        await handlePush(data);
        break;
      
      case 'pull_request':
        await handlePullRequest(data);
        break;
      
      case 'repository':
        await handleRepository(data);
        break;
      
      default:
        console.log(`Unhandled event: ${event}`);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleInstallation(data) {
  const action = data.action; // created, deleted, etc.
  const installation = data.installation;
  
  console.log(`Installation ${action}: ${installation.id}`);
  
  if (action === 'created') {
    // Save installation to database
    // You'll need to implement this with Supabase
    console.log(`New installation for: ${installation.account.login}`);
  }
}

async function handlePush(data) {
  const repo = data.repository;
  const commits = data.commits;
  
  console.log(`Push to ${repo.full_name}: ${commits.length} commits`);
  
  // TODO: Trigger code analysis
  // 1. Fetch the code from GitHub
  // 2. Run AI analysis
  // 3. Post results as comment or issue
}

async function handlePullRequest(data) {
  const action = data.action; // opened, synchronize, etc.
  const pr = data.pull_request;
  
  if (action === 'opened' || action === 'synchronize') {
    console.log(`PR #${pr.number} in ${data.repository.full_name}`);
    
    // TODO: Analyze PR changes
    // 1. Get changed files
    // 2. Run analysis
    // 3. Post comment on PR with results
  }
}

async function handleRepository(data) {
  const action = data.action;
  const repo = data.repository;
  
  console.log(`Repository ${action}: ${repo.full_name}`);
}
