# CommodityBubbles API Schema

## **Webhook: POST /api/signals/ingest**

**Purpose:** Receive signals from your metals agent (loosely coupled, no auth)

**Request:**
```json
{
  "sentiment": "bullish|bearish|neutral",
  "confidence": 0.92,
  "edge_pct": 40,
  "commodity": "copper|nickel|zinc|gold",
  "timestamp": "2026-05-23T14:00:00Z",
  "source": "metals-agent-v1",
  "metadata": {
    "headline": "Copper demand up from China",
    "market_odds": 0.65
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "signal_id": "sig_abc123",
  "stored_at": "2026-05-23T14:00:05Z"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Invalid commodity: copper_xxx",
  "code": "VALIDATION_ERROR"
}
```

**cURL Example:**
```bash
curl -X POST https://commoditybubbles.vercel.app/api/signals/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "sentiment": "bullish",
    "confidence": 0.92,
    "edge_pct": 40,
    "commodity": "copper",
    "timestamp": "2026-05-23T14:00:00Z",
    "source": "metals-agent-v1"
  }'
```

**Rate Limit:** Unlimited (designed for webhook integration)

---

## **Authenticated Endpoints**

All authenticated endpoints require JWT token in `Authorization: Bearer <token>` header.

Token obtained via `/api/auth/login`.

---

### **GET /api/signals/latest**

**Purpose:** Fetch recent signals for a commodity

**Query Parameters:**
- `commodity` (string, required): "copper" | "nickel" | "zinc" | "gold"
- `limit` (number, optional): 1-50, default 10
- `hours` (number, optional): Last N hours, default 24

**Request:**
```
GET /api/signals/latest?commodity=copper&limit=10&hours=24
Authorization: Bearer eyJhbGc...
```

**Response:**
```json
{
  "signals": [
    {
      "id": "sig_abc123",
      "sentiment": "bullish",
      "confidence": 0.92,
      "edge_pct": 40,
      "timestamp": "2026-05-23T14:00:00Z",
      "source": "metals-agent-v1"
    },
    {
      "id": "sig_abc122",
      "sentiment": "neutral",
      "confidence": 0.55,
      "edge_pct": 2,
      "timestamp": "2026-05-23T13:00:00Z",
      "source": "metals-agent-v1"
    }
  ],
  "count": 2,
  "total_in_range": 47
}
```

---

### **GET /api/dashboard/data**

**Purpose:** Get all data needed for dashboard render

**Request:**
```
GET /api/dashboard/data
Authorization: Bearer eyJhbGc...
```

**Response:**
```json
{
  "commodities": [
    {
      "id": "copper",
      "name": "Copper",
      "symbol": "HG=F",
      "current_price": 4.85,
      "price_change_24h": 12.3,
      "sentiment_score": 0.92,
      "bubble_size": "large",
      "bubble_color": "green",
      "latest_signal": {
        "sentiment": "bullish",
        "confidence": 0.92,
        "timestamp": "2026-05-23T14:00:00Z"
      }
    },
    {
      "id": "nickel",
      "name": "Nickel",
      "symbol": "NI=F",
      "current_price": 8.42,
      "price_change_24h": -2.1,
      "sentiment_score": 0.45,
      "bubble_size": "medium",
      "bubble_color": "yellow",
      "latest_signal": null
    }
  ],
  "user_subscription": {
    "tier": "pro",
    "features": ["real_time", "sentiment", "alerts"],
    "renews_at": "2026-06-23"
  },
  "recent_signals": [
    {
      "commodity": "copper",
      "sentiment": "bullish",
      "confidence": 0.92,
      "timestamp": "2026-05-23T14:00:00Z"
    }
  ]
}
```

---

### **GET /api/prices/history**

**Purpose:** Historical price data for charts (Pro+ only)

**Query Parameters:**
- `commodity` (string, required)
- `days` (number): 7, 30, 90, 365, default 30
- `interval` (string): "1h", "1d", default "1d"

**Request:**
```
GET /api/prices/history?commodity=copper&days=30&interval=1d
Authorization: Bearer eyJhbGc...
```

**Response:**
```json
{
  "commodity": "copper",
  "interval": "1d",
  "prices": [
    { "timestamp": "2026-04-23T00:00:00Z", "price": 4.31 },
    { "timestamp": "2026-04-24T00:00:00Z", "price": 4.35 },
    { "timestamp": "2026-04-25T00:00:00Z", "price": 4.41 },
    ...
    { "timestamp": "2026-05-23T00:00:00Z", "price": 4.85 }
  ],
  "count": 30,
  "min": 4.15,
  "max": 4.92,
  "avg": 4.52
}
```

---

### **GET /api/user/subscription**

**Purpose:** Check user's subscription status

**Request:**
```
GET /api/user/subscription
Authorization: Bearer eyJhbGc...
```

**Response:**
```json
{
  "user_id": "user_xyz",
  "tier": "pro",
  "stripe_customer_id": "cus_abc123",
  "stripe_subscription_id": "sub_xyz",
  "status": "active",
  "current_period_start": "2026-05-23T00:00:00Z",
  "current_period_end": "2026-06-23T00:00:00Z",
  "features": {
    "real_time": true,
    "sentiment": true,
    "alerts": true,
    "history": "7d",
    "api_access": false
  },
  "renewal_in_days": 31
}
```

---

### **POST /api/checkout**

**Purpose:** Create Stripe checkout session (for subscription)

**Request:**
```json
{
  "tier": "pro"
}
```

Or:
```json
{
  "tier": "enterprise"
}
```

**Response:**
```json
{
  "success": true,
  "checkout_url": "https://checkout.stripe.com/pay/cs_live_xyz",
  "session_id": "cs_live_abc123"
}
```

**Redirect user to `checkout_url`, Stripe handles rest.**

---

## **Auth Endpoints**

### **POST /api/auth/signup**

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "user_id": "user_xyz",
  "token": "eyJhbGc...",
  "expires_in": 86400
}
```

---

### **POST /api/auth/login**

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "user_id": "user_xyz",
  "token": "eyJhbGc...",
  "expires_in": 86400
}
```

---

### **POST /api/auth/logout**

**Request:**
```
POST /api/auth/logout
Authorization: Bearer eyJhbGc...
```

**Response:**
```json
{
  "success": true
}
```

---

## **Stripe Webhooks (Incoming)**

**Endpoint:** `POST /api/webhooks/stripe`

Stripe posts these events automatically (you don't call them):

### **customer.subscription.created**
```json
{
  "type": "customer.subscription.created",
  "data": {
    "object": {
      "customer": "cus_abc123",
      "id": "sub_xyz",
      "metadata": {
        "tier": "pro"
      }
    }
  }
}
```

**Action:** Set `users.tier = 'pro'`, enable features

---

### **customer.subscription.updated**
```json
{
  "type": "customer.subscription.updated",
  "data": {
    "object": {
      "customer": "cus_abc123",
      "id": "sub_xyz",
      "metadata": {
        "tier": "enterprise"
      }
    }
  }
}
```

**Action:** Update `users.tier`, unlock new features

---

### **customer.subscription.deleted**
```json
{
  "type": "customer.subscription.deleted",
  "data": {
    "object": {
      "customer": "cus_abc123",
      "id": "sub_xyz"
    }
  }
}
```

**Action:** Set `users.tier = 'free'` (revoke features)

---

## **Error Codes**

| Code | HTTP | Meaning |
|------|------|---------|
| VALIDATION_ERROR | 400 | Invalid input (bad commodity, etc) |
| UNAUTHORIZED | 401 | Missing or invalid JWT token |
| FORBIDDEN | 403 | Tier doesn't allow this feature |
| NOT_FOUND | 404 | Resource doesn't exist |
| RATE_LIMIT | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error (rare) |

---

## **Testing the Webhook (4-week MVP)**

### Local Testing

```bash
# Start dev server
npm run dev

# In another terminal, send test signal
curl -X POST http://localhost:3000/api/signals/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "sentiment": "bullish",
    "confidence": 0.92,
    "edge_pct": 40,
    "commodity": "copper",
    "timestamp": "2026-05-23T14:00:00Z"
  }'

# Check response
# Should see: {"success": true, "signal_id": "sig_..."}
```

### From Your Metals Agent

```bash
# In hourly_agent_runner.sh, after edge detection:
curl -X POST https://your-app.vercel.app/api/signals/ingest \
  -H "Content-Type: application/json" \
  -d "{
    \"sentiment\":\"$SENTIMENT\",
    \"confidence\":$CONFIDENCE,
    \"edge_pct\":$EDGE,
    \"commodity\":\"copper\",
    \"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"
  }" \
  -w "\nStatus: %{http_code}\n"
```

---

## **SDK Example (Frontend)**

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Get latest signals
const { data, error } = await supabase
  .from('signals')
  .select('*')
  .eq('commodity', 'copper')
  .order('timestamp', { ascending: false })
  .limit(10)

// Subscribe to new signals in real-time
const subscription = supabase
  .from('signals')
  .on('INSERT', (payload) => {
    console.log('New signal:', payload.new)
  })
  .subscribe()
```

---

**Status:** All endpoints defined. Ready to implement Week 1.
