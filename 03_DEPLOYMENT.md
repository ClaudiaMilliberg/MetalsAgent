# Deployment Guide: Vercel + Supabase + Stripe

**Timeline:** 30 minutes (one-time setup)

---

## **Step 1: Vercel Setup (5 min)**

### 1.1 Create Vercel Account
```bash
# If not already done
vercel login
# Opens browser → authenticate
```

### 1.2 Create Vercel Project
```bash
cd ~/Desktop/Metals\ Agent\ Appv1/frontend/
vercel --prod
# Follows interactive setup
# Asks for project name: "commoditybubbles"
# Asks for framework: Select "Next.js"
# Accepts all defaults
```

**Result:** Your app gets a URL: `https://commoditybubbles-xyz.vercel.app`

---

## **Step 2: Supabase Setup (10 min)**

### 2.1 Create Supabase Project
1. Go to **supabase.com** → Dashboard
2. Click **New Project**
3. Fill in:
   - **Name:** commoditybubbles
   - **Database password:** (save this!)
   - **Region:** Closest to you (e.g., us-east-1)
4. Click **Create new project** (takes 2-3 min)

### 2.2 Get Connection Keys
1. In Supabase Dashboard, go **Settings** → **API**
2. Copy these keys:
   - **Project URL** (looks like `https://abc123.supabase.co`)
   - **anon key** (public key, safe to expose in frontend)
   - **service_role key** (secret, keep it safe)

### 2.3 Create API Keys in .env.local
```bash
cd ~/Desktop/Metals\ Agent\ Appv1/frontend/

cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=https://abc123.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_abc123
STRIPE_SECRET_KEY=sk_live_xyz

PERPLEXITY_API_KEY=ppl_abc123
OPENAI_API_KEY=sk-abc123
EOF
```

---

## **Step 3: Stripe Setup (8 min)**

### 3.1 Create Stripe Account
1. Go to **stripe.com** → Create account
2. Verify email
3. Complete account setup

### 3.2 Get API Keys
1. Dashboard → **Developers** → **API Keys**
2. Copy:
   - **Publishable key** (starts with `pk_live_`)
   - **Secret key** (starts with `sk_live_`, KEEP SAFE)
3. Add to `.env.local` (above)

### 3.3 Create Products in Stripe
1. Dashboard → **Products**
2. Click **Add product**

**Product 1: Pro**
- **Name:** CommodityBubbles Pro
- **Price:** $1.00/month
- **Billing period:** Monthly
- **ID:** (Stripe will generate, copy it)

**Product 2: Enterprise**
- **Name:** CommodityBubbles Enterprise
- **Price:** $25.00/month
- **Billing period:** Monthly
- **ID:** (Stripe will generate, copy it)

Add these IDs to `.env.local`:
```bash
STRIPE_PRO_PRODUCT_ID=prod_abc123
STRIPE_ENTERPRISE_PRODUCT_ID=prod_xyz
```

### 3.4 Set Webhook
1. Dashboard → **Webhooks**
2. Click **Add endpoint**
3. **Endpoint URL:** `https://your-vercel-app.vercel.app/api/webhooks/stripe`
4. **Listen to:** Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy **Signing secret** (starts with `whsec_`)
6. Add to `.env.local`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_abc123
```

---

## **Step 4: Database Migrations (5 min)**

### 4.1 Run Migrations
```bash
cd ~/Desktop/Metals\ Agent\ Appv1/frontend/

npm run db:push
# Applies schema from supabase/migrations/ to your Supabase
```

### 4.2 Verify Tables
1. Supabase Dashboard → **SQL Editor**
2. Run: `SELECT * FROM users;`
3. Should return: (empty table but no error)

---

## **Step 5: Deploy to Production (5 min)**

### 5.1 Connect GitHub (Optional but Recommended)
```bash
# If you have a GitHub repo
git add .
git commit -m "Initial CommodityBubbles setup"
git push origin main

# In Vercel Dashboard, link repo
# → Auto-deploy on every push
```

### 5.2 Deploy to Vercel
```bash
# Manual deploy
vercel deploy --prod

# Or, if GitHub connected:
# Just push to main, Vercel auto-deploys
```

### 5.3 Verify Deployment
1. Go to your Vercel URL
2. Should see login page
3. Try signup: create test user
4. Dashboard should load (empty, no data yet)

---

## **Step 6: Connect Everything (5 min)**

### 6.1 Update Stripe Webhook URL
In Stripe Dashboard → Webhooks:
- Edit the endpoint you created
- Change URL from `http://localhost:3000` to your Vercel URL
- **Endpoint URL:** `https://your-vercel-app.vercel.app/api/webhooks/stripe`

### 6.2 Test the Signal Webhook
```bash
# From your Metals Agent, test the webhook:
curl -X POST https://your-vercel-app.vercel.app/api/signals/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "sentiment": "bullish",
    "confidence": 0.92,
    "edge_pct": 40,
    "commodity": "copper",
    "timestamp": "2026-05-23T14:00:00Z"
  }'

# Should get: {"success": true, "signal_id": "sig_..."}
```

### 6.3 Test Stripe Checkout
1. Go to your app: `https://your-vercel-app.vercel.app`
2. Login with test user
3. Click **Subscribe** → Select **Pro ($1/month)**
4. Stripe test card: **4242 4242 4242 4242** (any exp/CVC)
5. Should complete checkout
6. Check dashboard → **Subscription** shows "Active"

---

## **Production Checklist**

- [ ] Vercel project created and deployed
- [ ] Supabase project created and running
- [ ] All `.env.local` variables set
- [ ] Database migrations applied
- [ ] Stripe products created
- [ ] Stripe webhook configured
- [ ] Test user can signup
- [ ] Test user can checkout
- [ ] Signal webhook responds correctly
- [ ] Domain configured (optional, can add later)

---

## **Monitoring (Post-Deploy)**

### Check App Health
```bash
# Is it running?
curl https://your-vercel-app.vercel.app/api/health

# Check logs in Vercel Dashboard
# → Deployments → Function Logs
```

### Monitor Stripe
Stripe Dashboard → **Customers**
- Should see your test user
- Subscription should show "Active"

### Monitor Supabase
Supabase Dashboard → **SQL Editor**
```sql
SELECT * FROM signals ORDER BY timestamp DESC LIMIT 5;
-- Should see test signals you posted
```

---

## **Scaling Beyond MVP**

Once you have 5+ users and want to scale:

1. **Database:** Supabase auto-scales (no action needed)
2. **API:** Vercel auto-scales (no action needed)
3. **Real-time:** Enable Supabase real-time subscriptions (already on)
4. **Cost:** Should stay $0-50/mo until 10,000+ users

---

## **Troubleshooting**

### "Vercel deploy fails with build error"
```bash
# Check logs
vercel logs --prod

# Common fix: Missing env variable
# Add it to Vercel Dashboard → Settings → Environment Variables
```

### "Stripe webhook not firing"
1. Check Supabase webhook signing
2. Verify `STRIPE_WEBHOOK_SECRET` matches
3. Stripe Dashboard → Webhooks → Check recent attempts

### "Signal webhook returns 500 error"
1. Check Vercel logs: `vercel logs --prod`
2. Verify Supabase connection string in `.env.local`
3. Test locally: `npm run dev` then `curl localhost:3000/api/...`

### "Can't login after deploy"
1. Check Supabase Auth is enabled
2. Verify email verification (if required)
3. Check browser console for JWT errors

---

**Status:** Deployment pipeline ready. Everything configured for 4-week MVP launch.

Next: Connect your metals agent webhook (see `04_BOT_INTEGRATION.md`)
