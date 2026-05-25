# 🔑 API Keys Checklist

**Status:** Ready for credential collection  
**Last Updated:** May 23, 2026

---

## Required API Keys by Service

### 1. **Supabase** (Database + Auth + Real-time)
**Priority:** 🔴 CRITICAL - App won't work without this

**What to Get:**
- [ ] `NEXT_PUBLIC_SUPABASE_URL` — Your Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Public anonymous key (safe to expose)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` — Private server key (SECRET - keep safe)

**Where to Get:**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Settings → API → Copy the three keys above
4. Project → SQL Editor → Run the migration from `supabase/migrations/001_initial_schema.sql`

**Security Notes:**
- ✅ ANON key can be public (it's limited by Row-Level Security)
- 🔒 SERVICE ROLE key is SECRET — never share or commit to git
- Store in `.env.local` only, never in version control

---

### 2. **Stripe** (Payments)
**Priority:** 🟠 HIGH - Needed for subscription features

**What to Get:**
- [ ] `STRIPE_SECRET_KEY` — Private API key (sk_test_...)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Public key (pk_test_...)
- [ ] `STRIPE_WEBHOOK_SECRET` — For webhook signature verification (whsec_...)
- [ ] `STRIPE_PRO_PRICE_ID` — Product ID for $1/month Pro plan
- [ ] `STRIPE_ENTERPRISE_PRICE_ID` — Product ID for $25/month Enterprise plan

**Where to Get:**
1. Go to [stripe.com](https://stripe.com)
2. Create account (test mode is fine for dev)
3. Dashboard → API Keys → Copy Secret and Publishable keys
4. Developers → Webhooks → Create endpoint:
   - URL: `https://your-vercel-app.vercel.app/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `charge.failed`
   - Copy the webhook secret
5. Products → Create two products:
   - **Pro Plan**: $1 USD, monthly recurring
   - **Enterprise Plan**: $25 USD, monthly recurring
   - Copy the price IDs

**Security Notes:**
- 🔒 SECRET key is PRIVATE — never expose
- ✅ PUBLISHABLE key can be public
- ✅ Webhook secret can be in `.env.local` (used server-side only)

**Testing:**
- Use Stripe test keys (start with `sk_test_` and `pk_test_`)
- Use test card: `4242 4242 4242 4242` (any expiry, any CVC)

---

### 3. **Vercel** (Hosting)
**Priority:** 🟠 HIGH - For production deployment

**What to Get:**
- [ ] Vercel project created (linked to your GitHub repo)
- [ ] `NEXT_PUBLIC_APP_URL` — Your Vercel domain (e.g., `https://metals-agent.vercel.app`)

**Where to Get:**
1. Go to [vercel.com](https://vercel.com)
2. Connect your GitHub account
3. Import the `Metals Agent Appv1` repository
4. Vercel auto-deploys on git push
5. Copy your Vercel domain from project settings

**Deployment:**
- Push to `main` branch → Auto-deploys
- Environment variables set in Vercel dashboard
- See `DEPLOYMENT.md` for step-by-step guide

---

### 4. **OpenAI / Anthropic** (Optional - for sentiment analysis)
**Priority:** 🟢 OPTIONAL - Nice to have for news sentiment

**What to Get:**
- [ ] `ANTHROPIC_API_KEY` — For Claude sentiment analysis (optional)
  OR
- [ ] `OPENAI_API_KEY` — For GPT sentiment analysis (optional)

**Where to Get:**
1. [api.anthropic.com](https://api.anthropic.com) — Claude API
2. [openai.com/api](https://openai.com/api) — GPT API
3. Create account, generate API key
4. Add to `.env.local`

**Use Cases:**
- Analyze news headlines for sentiment
- Generate market insights
- Can be added in Week 3+

---

### 5. **Reddit API** (Optional - for community signals)
**Priority:** 🟢 OPTIONAL - For market sentiment research

**What to Get:**
- [ ] `REDDIT_CLIENT_ID` — OAuth client ID
- [ ] `REDDIT_CLIENT_SECRET` — OAuth secret
- [ ] `REDDIT_USER_AGENT` — Identifier for your bot

**Where to Get:**
1. Create Reddit account at [reddit.com](https://reddit.com)
2. Go to [reddit.com/prefs/apps](https://reddit.com/prefs/apps)
3. Create "script" app, get credentials
4. Add to `.env.local`

**Use Cases:**
- Monitor r/wallstreetbets, r/commodities sentiment
- Detect emerging trends
- Can be added later

---

### 6. **Email / SendGrid** (Optional - for alerts)
**Priority:** 🟢 OPTIONAL - For user notifications

**What to Get:**
- [ ] `SENDGRID_API_KEY` — For transactional emails
  OR
- [ ] `RESEND_API_KEY` — Modern alternative to SendGrid

**Where to Get:**
1. [sendgrid.com](https://sendgrid.com) OR [resend.com](https://resend.com)
2. Create account, generate API key
3. Add to `.env.local`

**Use Cases:**
- Welcome emails
- Alert emails for signals
- Subscription receipts

---

## Environment Variables Template

### `.env.local` (Development)
```bash
# === REQUIRED ===
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

STRIPE_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_PRO_PRICE_ID=price_pro_id_here
STRIPE_ENTERPRISE_PRICE_ID=price_enterprise_id_here

NEXT_PUBLIC_APP_URL=http://localhost:3000

# === OPTIONAL ===
ANTHROPIC_API_KEY=sk_ant_your_key_here
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_secret
SIGNAL_WEBHOOK_SECRET=your_signal_secret_for_verification
```

### Vercel Dashboard (Production)
Same variables as above, but set in:
- Project Settings → Environment Variables
- Use production secrets (live keys, not test keys)

---

## 🚀 Collection Order

**Phase 1 (Today - Minimum to Run Locally):**
1. ✅ Supabase keys — Required to start
2. ✅ Stripe test keys — Required for checkout
3. ✅ Vercel domain — For production URL

**Phase 2 (This Week - Before Launch):**
4. Stripe live keys (when ready to go live)
5. SendGrid/Resend (for email alerts)

**Phase 3 (Later - Optional Enhancements):**
6. Anthropic/OpenAI (for sentiment)
7. Reddit API (for community signals)

---

## ✅ Checklist for Each Service

### Supabase ✓
- [ ] Project created at supabase.com
- [ ] Three API keys copied
- [ ] Database schema deployed (`001_initial_schema.sql` run)
- [ ] Row-Level Security policies enabled
- [ ] Real-time subscriptions enabled

### Stripe ✓
- [ ] Account created at stripe.com
- [ ] Test mode API keys copied
- [ ] Pro product created ($1 monthly)
- [ ] Enterprise product created ($25 monthly)
- [ ] Webhook endpoint configured
- [ ] Webhook secret copied

### Vercel ✓
- [ ] Account created at vercel.com
- [ ] Repository imported (GitHub)
- [ ] Auto-deployment working
- [ ] Domain copied
- [ ] Environment variables set

---

## 🔒 Security Best Practices

**DO:**
- ✅ Keep `SUPABASE_SERVICE_ROLE_KEY` secret
- ✅ Keep `STRIPE_SECRET_KEY` secret
- ✅ Store secrets in `.env.local` only
- ✅ Add `.env.local` to `.gitignore`
- ✅ Use test keys for development
- ✅ Rotate keys periodically
- ✅ Use different keys for dev/prod

**DON'T:**
- ❌ Commit `.env.local` to git
- ❌ Share API keys in Slack/email
- ❌ Use production keys in dev
- ❌ Expose secrets in logs
- ❌ Hardcode keys in source code

---

## Next Steps

1. **Get Supabase keys** — Create project, copy keys
2. **Get Stripe keys** — Test account, copy keys + create products
3. **Create Vercel domain** — Deploy the app
4. **Tell me you have them** — I'll add them to keychain + app

**When ready, run:**
```bash
npm install
npm run dev
# Then open http://localhost:3000
```

---

## Questions?

- **Supabase Setup:** See `03_DEPLOYMENT.md`
- **Stripe Setup:** See `03_DEPLOYMENT.md`
- **Vercel Setup:** See `03_DEPLOYMENT.md`
- **Bot Integration:** See `04_BOT_INTEGRATION.md`
