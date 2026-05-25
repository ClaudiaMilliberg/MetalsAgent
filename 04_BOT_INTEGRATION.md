# Bot Integration Guide: Connect Your Metals Agent

**Goal:** Make your metals agent's signals appear on CommodityBubbles dashboard

**Effort:** 5 minutes of code  
**Risk:** None (loosely coupled, no auth, no coupling)

---

## **How It Works**

```
Your Metals Agent (hourly_agent_runner.sh)
  Every hour:
    1. Fetch headlines
    2. Sentiment analysis
    3. Edge detection
    4. Send signal to CommodityBubbles
       
       POST https://your-vercel-app.vercel.app/api/signals/ingest
       {
         sentiment: "bullish",
         confidence: 0.92,
         edge_pct: 40,
         ...
       }
       ↓
CommodityBubbles receives signal
  → Stores in database
  → Broadcasts to all connected users
  ↓
Dashboard updates in real-time
  "Your bot just sent: Bullish (92% confidence)"
```

---

## **Step 1: Get Your App URL**

After deploying to Vercel, you have a URL like:
```
https://commoditybubbles-abc123.vercel.app
```

This is where your bot will send signals.

---

## **Step 2: Update hourly_agent_runner.sh**

In `~/Desktop/Metals\ Agent/backtest/hourly_agent_runner.sh`, find the section where you log decisions. After logging a decision to CSV, add:

```bash
# After you've calculated SENTIMENT, CONFIDENCE, EDGE_PCT:

WEBHOOK_URL="https://your-vercel-app.vercel.app/api/signals/ingest"
TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)

# Send to CommodityBubbles
curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"sentiment\":\"$SENTIMENT\",
    \"confidence\":$CONFIDENCE,
    \"edge_pct\":$EDGE_PCT,
    \"commodity\":\"copper\",
    \"timestamp\":\"$TIMESTAMP\",
    \"source\":\"metals-agent-v1\"
  }" \
  -s -w "Signal sent (HTTP %{http_code})\n" >> hourly_agent_runs.log

# Continue with rest of loop...
```

---

## **Step 3: Extract Variables from Your Agent**

Your agent likely already calculates these. Find them:

### SENTIMENT
Where you classify bullish/bearish:
```bash
# Your current code (example):
SENTIMENT=$(python3 -c "
  import json
  response = json.loads('$CLAUDE_RESPONSE')
  print(response['sentiment'].lower())
")
```

### CONFIDENCE
Your sentiment confidence score (0-1):
```bash
# Your current code (example):
CONFIDENCE=$(python3 -c "
  import json
  response = json.loads('$CLAUDE_RESPONSE')
  print(response['confidence'])
")
```

### EDGE_PCT
Your edge detection (how much better than market odds):
```bash
# Your current code (example):
EDGE_PCT=$((CONFIDENCE_PCT - MARKET_ODDS_PCT))
```

---

## **Step 4: Test the Integration**

### Local Test
```bash
# Manually call the webhook (replace URL with your actual URL)
curl -X POST https://commoditybubbles-abc123.vercel.app/api/signals/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "sentiment": "bullish",
    "confidence": 0.92,
    "edge_pct": 40,
    "commodity": "copper",
    "timestamp": "2026-05-23T14:00:00Z",
    "source": "metals-agent-v1"
  }'

# Should get:
# {"success": true, "signal_id": "sig_abc123"}
```

### Check Dashboard
1. Go to `https://your-vercel-app.vercel.app`
2. Login with your test user
3. Go to dashboard
4. Should see new signal in "Recent Signals" section
5. Copper bubble should show updated sentiment

---

## **Step 5: Automate It**

Once your agent runs hourly, signals will appear automatically:

**Timeline:**
- Hour 1: Agent sends signal → Dashboard updates
- Hour 2: Agent sends signal → Dashboard updates
- ... (continues every hour)

**What users see:**
- Bubble map shows copper bubble color changes (🟢 bullish, 🔴 bearish, 🟡 mixed)
- Signal history shows: "Your bot: Bullish (92%) at 14:00"
- Trend visualization: "3 bullish signals in last 24h"

---

## **Advanced: Track Bot Performance**

Once Phase 1 finishes and you have outcomes (WIN/LOSS), you can sync that too:

```bash
# After prediction_resolver.py marks outcomes:
OUTCOME=$(grep "$DECISION_ID" live_dryrun_decisions.csv | cut -d, -f10)

if [ "$OUTCOME" = "WIN" ]; then
  curl -X POST "$WEBHOOK_URL/outcome" \
    -d "{ \"signal_id\": \"$SIGNAL_ID\", \"outcome\": \"win\" }"
fi
```

This lets dashboard show: "Your bot is 72% accurate over 50 signals"

---

## **Full Integration Example**

Here's what a complete hourly agent loop looks like with CommodityBubbles integration:

```bash
#!/bin/bash

# hourly_agent_runner.sh (simplified)

LOG_FILE="hourly_agent_runs.log"
CSV_FILE="live_dryrun_decisions.csv"
WEBHOOK_URL="https://your-vercel-app.vercel.app/api/signals/ingest"

while true; do
  TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
  
  echo "[$TIMESTAMP] Cycle start" >> $LOG_FILE
  
  # Step 1: Resolve outcomes from yesterday
  python3 prediction_resolver.py >> $LOG_FILE
  
  # Step 2: Fetch headlines
  HEADLINES=$(python3 fetch_headlines.py)
  
  # Step 3: Sentiment analysis
  SENTIMENT_RESPONSE=$(python3 classify_sentiment.py "$HEADLINES")
  SENTIMENT=$(echo $SENTIMENT_RESPONSE | jq -r '.sentiment')
  CONFIDENCE=$(echo $SENTIMENT_RESPONSE | jq -r '.confidence')
  
  # Step 4: Fetch market odds
  MARKET_ODDS=$(python3 fetch_polymarket_odds.py)
  
  # Step 5: Calculate edge
  EDGE_PCT=$((CONFIDENCE * 100 - MARKET_ODDS * 100))
  
  # Step 6: Log to CSV
  if (( $(echo "$EDGE_PCT > 4" | bc -l) )); then
    echo "$TIMESTAMP,$SENTIMENT,$CONFIDENCE,$EDGE_PCT" >> $CSV_FILE
    SIGNAL_ID=$(tail -1 $CSV_FILE | cut -d, -f1)
  fi
  
  # Step 7: Send to CommodityBubbles webhook ← NEW
  if [ ! -z "$EDGE_PCT" ] && (( $(echo "$EDGE_PCT > 4" | bc -l) )); then
    WEBHOOK_RESPONSE=$(curl -s -X POST "$WEBHOOK_URL" \
      -H "Content-Type: application/json" \
      -d "{
        \"sentiment\":\"$SENTIMENT\",
        \"confidence\":$CONFIDENCE,
        \"edge_pct\":$(printf "%.1f" $EDGE_PCT),
        \"commodity\":\"copper\",
        \"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
        \"source\":\"metals-agent-v1\"
      }")
    
    echo "Webhook response: $WEBHOOK_RESPONSE" >> $LOG_FILE
  fi
  
  # Step 8: Write heartbeat
  date '+%Y-%m-%d %H:%M:%S' > HEARTBEAT.txt
  
  echo "[$TIMESTAMP] Cycle complete" >> $LOG_FILE
  sleep 3600  # 1 hour
done
```

---

## **Looser Coupling (No Changes to Agent)**

If you want zero changes to your agent code, use a separate webhook proxy:

```bash
#!/bin/bash
# separate_webhook_proxy.sh

# Tail the CSV and watch for new signals
tail -f live_dryrun_decisions.csv | while read line; do
  SENTIMENT=$(echo $line | cut -d, -f2)
  CONFIDENCE=$(echo $line | cut -d, -f3)
  EDGE=$(echo $line | cut -d, -f4)
  
  curl -s -X POST "https://your-vercel-app.vercel.app/api/signals/ingest" \
    -d "{...}"
done
```

Run this in a separate terminal. Zero changes to your agent.

---

## **Webhook Payload Reference**

**Required fields:**
- `sentiment`: "bullish" | "bearish" | "neutral"
- `confidence`: 0.0-1.0 (float)
- `edge_pct`: number (can be negative)
- `commodity`: "copper" | "nickel" | "zinc" | "gold"
- `timestamp`: ISO 8601 datetime

**Optional fields:**
- `source`: Your bot identifier
- `metadata`: { headline, market_odds, etc. }

---

## **Error Handling**

If webhook fails (network down, app offline), what happens?

```bash
# Current behavior: curl fails silently
# Better: log and retry

WEBHOOK_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$WEBHOOK_URL" ...)
HTTP_CODE=$(echo "$WEBHOOK_RESPONSE" | tail -1)

if [ "$HTTP_CODE" != "200" ]; then
  echo "[ERROR] Webhook failed (HTTP $HTTP_CODE)" >> $LOG_FILE
  # Could retry here, or just log and continue
fi
```

---

## **Monitoring Signals**

### Check Dashboard
1. Go to app
2. See "Recent Signals" section
3. Watch for your bot's signals appearing

### Check Logs
```bash
# In CommodityBubbles Vercel dashboard:
# → Deployments → Function Logs
# → Search for "signal_id"
```

### Check Database
```bash
# In Supabase:
# SQL Editor → Run:
SELECT * FROM signals 
WHERE source = 'metals-agent-v1' 
ORDER BY timestamp DESC 
LIMIT 10;
```

---

## **Roadmap: Future Enhancements**

**Phase 1 (MVP):** Basic signal sync (what you're doing now)  
**Phase 2:** Outcome sync (bot accuracy tracking)  
**Phase 3:** Two-way integration (bot queries dashboard for sentiment)  
**Phase 4:** White-label (enterprise customers add their own bots)

---

## **Troubleshooting**

### "Webhook returns 400 error"
```
Check:
- Invalid commodity name (must be copper|nickel|zinc|gold)
- Missing required fields
- Malformed JSON
```

### "Webhook returns 500 error"
```
Check:
- Is app deployed on Vercel?
- Is Supabase connection working?
- Check Vercel logs for details
```

### "Signal shows up but with wrong data"
```
Check:
- Is SENTIMENT being parsed correctly?
- Is CONFIDENCE in range 0-1?
- Is TIMESTAMP in ISO 8601 format?
```

### "No signals showing on dashboard"
```
Check:
- Are you logged in as a Pro user? (Free users don't see signals)
- Did you click refresh? (Some browsers cache)
- Check browser console (F12) for errors
- Check that commodity = "copper" (case-sensitive)
```

---

**Status:** Bot integration guide complete. Ready to wire up your agent.

**Next:** Start Week 1 development (see `QUICK_START.md`)
