# ✅ Deployment Checklist

**Objective:** Deploy quota-optimized Metals Agent with confidence  
**Estimated Time:** 15 minutes  
**Difficulty:** Easy (mostly copy-paste)

---

## 📋 Pre-Deployment

### Read Documentation
- [ ] Read `API_USAGE_GUIDE.md` (understand the split)
- [ ] Read `DASHBOARD_INTEGRATION.md` (understand the hook)
- [ ] Read `QUOTA_OPTIMIZATION_SUMMARY.md` (understand the changes)

### Code Setup

#### Backend (Already Done ✅)
- [x] `dataService.ts` - Added `getPricesOnly()` and `getSentimentOnly()`
- [x] `/api/commodities/live` - Updated to use prices only
- [x] `/api/commodities/sentiment` - Created new endpoint

#### Frontend (Need to Do)
- [ ] Create `frontend/hooks/useCommodities.ts`
  - Copy from `DASHBOARD_INTEGRATION.md` (full code provided)
  - Paste into new file
- [ ] Update `frontend/app/dashboard/page.tsx`
  - Replace with code from `DASHBOARD_INTEGRATION.md`
  - Imports and uses `useCommodities` hook
- [ ] Update `frontend/app/dashboard/components/CommodityCard.tsx`
  - Replace with code from `DASHBOARD_INTEGRATION.md`
  - Shows sentiment data from hook

### Local Testing
```bash
cd ~/Desktop/Metals\ Agent\ Appv1/

# Install dependencies (if needed)
npm install

# Start dev server
npm run dev

# In another terminal, test endpoints
curl http://localhost:3000/api/commodities/live | jq '.commodities[0]'
curl http://localhost:3000/api/commodities/sentiment | jq '.quotaUsage'

# Check browser
open http://localhost:3000/dashboard
# Should see:
# - Prices updating (watch for timestamp changes)
# - Sentiment showing (or "neutral" if fetching)
# - No console errors
```

### Type Checking
```bash
npm run type-check
# Should pass with no errors
```

---

## 🚀 Deployment

### Step 1: Create Hook File

```bash
# Create the hook directory
mkdir -p frontend/hooks

# Create the file
touch frontend/hooks/useCommodities.ts

# Copy code from DASHBOARD_INTEGRATION.md
# Paste entire hook code into this file
```

### Step 2: Update Dashboard Files

```bash
# Edit dashboard
nano frontend/app/dashboard/page.tsx
# Replace with code from DASHBOARD_INTEGRATION.md

# Edit commodity card component
nano frontend/app/dashboard/components/CommodityCard.tsx
# Replace with code from DASHBOARD_INTEGRATION.md
```

### Step 3: Verify All Changes

```bash
# Check that files exist
ls frontend/hooks/useCommodities.ts
ls frontend/lib/dataService.ts
ls frontend/app/api/commodities/live/route.ts
ls frontend/app/api/commodities/sentiment/route.ts

# Check imports are correct
grep "useCommodities" frontend/app/dashboard/page.tsx
grep "getPricesOnly" frontend/lib/dataService.ts
grep "getSentimentOnly" frontend/lib/dataService.ts
```

### Step 4: Git Commit

```bash
cd ~/Desktop/Metals\ Agent\ Appv1/

# Add all files
git add frontend/lib/dataService.ts
git add frontend/app/api/commodities/live/route.ts
git add frontend/app/api/commodities/sentiment/route.ts
git add frontend/hooks/useCommodities.ts
git add frontend/app/dashboard/page.tsx
git add frontend/app/dashboard/components/CommodityCard.tsx
git add API_USAGE_GUIDE.md
git add DASHBOARD_INTEGRATION.md
git add QUOTA_OPTIMIZATION_SUMMARY.md
git add DEPLOY_CHECKLIST.md

# Verify staging
git status
# Should show all new/modified files ready to commit

# Commit with message
git commit -m "♻️ Quota optimization: Split price/sentiment endpoints (100x reduction)

Architecture:
- Prices: Every 30s, 0 NewsAPI calls (metals.live unlimited)
- Sentiment: Every 60min, 3 NewsAPI calls (cached)
- Result: 8,640 → 72 calls/day

Files:
- dataService.ts: Added getPricesOnly() + getSentimentOnly()
- /api/commodities/live: Prices only (no sentiment)
- /api/commodities/sentiment: New endpoint for sentiment
- useCommodities hook: Coordinates dual endpoints
- Dashboard: Updated to use new hook

Impact:
- Infinite scaling on free APIs
- Prices still real-time
- Sentiment updates hourly
- Zero cost maintained
- Safe within free tier forever"

# Push to GitHub
git push origin main
```

### Step 5: Wait for Vercel Deployment

```
Expected deploy time: 1-2 minutes

Dashboard: https://metals-agent.vercel.app/dashboard
Prices API: https://metals-agent.vercel.app/api/commodities/live
Sentiment API: https://metals-agent.vercel.app/api/commodities/sentiment
```

---

## ✅ Post-Deployment Verification

### Immediate (First 5 minutes)

```bash
# Check build succeeded
# Look at Vercel dashboard → Deployments
# Should see green checkmark

# Test endpoints are live
curl https://metals-agent.vercel.app/api/commodities/live
curl https://metals-agent.vercel.app/api/commodities/sentiment

# Both should return 200 OK with JSON
```

### Short-term (First hour)

- [ ] Visit dashboard: https://metals-agent.vercel.app/dashboard
- [ ] Prices visible with numbers (e.g., Copper $4.65)
- [ ] Sentiment showing (could be "neutral" initially)
- [ ] No console errors (open DevTools)
- [ ] Responsive on mobile (open dev tools → mobile view)

### Medium-term (First day)

- [ ] Prices update (watch timestamp change every 30s)
- [ ] Sentiment updates (should change from neutral if NewsAPI key active)
- [ ] Visit again after 1 hour → sentiment might have refreshed
- [ ] No API errors in console

### Long-term (First week)

Monitor in Vercel dashboard:
- [ ] No 500 errors
- [ ] Response times < 500ms
- [ ] No memory leaks
- [ ] Error rate 0%

Check quota:
```bash
# Visit sentiment endpoint
curl https://metals-agent.vercel.app/api/commodities/sentiment | jq '.quotaUsage'

# Should show:
{
  "apiCallsMade": 3,
  "estimatedDailyUsage": "72 calls/day at 1-hour polling",
  "freeQuotaLimit": "100-500 calls/day",
  "status": "Well within limits ✅"
}
```

---

## 🛠️ Troubleshooting

### Issue: Build failed on Vercel

**Symptoms:** Red X on deployment  
**Fix:**
```bash
# Check for TypeScript errors locally
npm run type-check

# If there are errors, fix them
# Then push again
git push origin main
```

### Issue: Prices showing but all sentiment is "neutral"

**Symptoms:**
- Prices update correctly every 30s
- Sentiment is always "neutral"

**Fix:**
```bash
# Check if NewsAPI key is set in Vercel
# Go to: vercel.com → Project Settings → Environment Variables
# Should have: NEXT_PUBLIC_NEWS_API_KEY=your_key

# If missing, add it:
# NEXT_PUBLIC_NEWS_API_KEY=b6f99a716e084c6bbdb0de4f1b37fedb

# Then redeploy:
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

### Issue: Sentiment endpoint returns errors

**Symptoms:**
- `/api/commodities/sentiment` returns 500 status
- Console shows NewsAPI errors

**Fix:**
```bash
# Check NewsAPI key is valid
curl "https://newsapi.org/v2/everything?q=copper&apiKey=YOUR_KEY" | jq

# If 401 error, key is invalid
# Get a new one: https://newsapi.org/register
# Update in Vercel dashboard

# If rate limited (429), wait 1 hour
```

### Issue: Everything works locally but fails on Vercel

**Symptoms:**
- Works with `npm run dev`
- Fails after deploy to Vercel

**Fix:**
```bash
# Check environment variables are set in Vercel
# Vercel Dashboard → Settings → Environment Variables
# Should have:
# - NEXT_PUBLIC_NEWS_API_KEY=...

# Check for differences between .env.local and Vercel env
# Vercel env is for production, .env.local is local only

# Make sure to redeploy after setting variables:
git push origin main
```

---

## 📊 What to Monitor

### Daily
- [ ] Prices updating every 30 seconds
- [ ] No API errors in production
- [ ] Sentiment updates at least once (check timestamp)

### Weekly
- [ ] NewsAPI usage stays around 72 calls/day
- [ ] Response times consistent (< 500ms)
- [ ] No error spikes
- [ ] Traffic growing (or stable if no marketing)

### Monthly
- [ ] Verify architecture is sustainable
- [ ] Plan next features (WebSocket, alerts, charts)
- [ ] Consider monetization strategy

---

## 🎯 Success Criteria

✅ **Deployment Successful When:**

1. Dashboard loads without errors
2. Prices show real data from metals.live
3. Prices update every ~30 seconds
4. Sentiment shows (might be "neutral" initially)
5. Sentiment updates within 1 hour
6. No 500 errors in console
7. Responsive on mobile
8. Quota metrics visible in footer: "72 calls/day (free tier: 100-500)"

---

## 📞 Quick Reference

| What | Command | Expected Result |
|------|---------|-----------------|
| Start dev | `npm run dev` | Server running on :3000 |
| Type check | `npm run type-check` | No errors |
| Test prices | `curl localhost:3000/api/commodities/live` | 200 OK, JSON data |
| Test sentiment | `curl localhost:3000/api/commodities/sentiment` | 200 OK, quota info |
| Push to deploy | `git push origin main` | Vercel auto-deploys |
| Check quota | Visit sentiment endpoint | Shows "72 calls/day" |

---

## 🎉 When You're Done

After successful deployment:

1. ✅ **Share the victory**
   - Your app now scales infinitely
   - Real commodity data, real sentiment, zero cost
   - 100x less API usage than before

2. ✅ **Monitor for a week**
   - Verify prices update consistently
   - Verify sentiment is meaningful
   - Check no quota issues

3. ✅ **Plan next features**
   - Real-time WebSocket updates
   - Price alerts and notifications
   - Advanced charts (TradingView integration)
   - Mobile app (React Native)
   - ML-powered predictions

---

## 📝 Notes

- Prices use metals.live API (unlimited calls, real-time)
- Sentiment uses NewsAPI (100-500 calls/day, cached hourly)
- Infrastructure projects are static data (no API calls)
- Dashboard merges all data client-side
- Error handling gracefully degrades if APIs fail

---

**Status: 🟢 READY TO DEPLOY**

Follow the steps above, and your quota-optimized Metals Agent will be live in 15 minutes.
