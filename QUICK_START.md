# 🚀 MALSARA69 Quick Start

Get started with the AI Crush Coaching System in 5 minutes!

---

## ⚡ Prerequisites

```bash
# 1. Install dependencies
npm install

# 2. Configure .env (get Gemini API key + database credentials)
cp .env.example .env
nano .env

# 3. Start MongoDB and Neo4j (or use cloud versions)
# See TESTING.md for setup instructions
```

---

## 🎯 Basic Usage (Copy & Paste)

### 1️⃣ Create Your User Account

```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "age": 24,
    "gender": "male"
  }'
```

**Response:**
```json
{
  "success": true,
  "user": {
    "userId": "user_abc123xyz456",   ← SAVE THIS!
    "name": "John Doe"
  }
}
```

---

### 2️⃣ Add Your Crush

```bash
curl -X POST http://localhost:3001/api/crushes \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_abc123xyz456",
    "name": "Sarah",
    "age": 23,
    "gender": "female",
    "personality": "introvert",
    "notes": "Met at coffee shop, seems interested"
  }'
```

**Response:**
```json
{
  "success": true,
  "crush": {
    "crushId": "crush_xyz789abc123",   ← SAVE THIS!
    "name": "Sarah",
    "currentStage": "early_stage"
  }
}
```

---

### 3️⃣ Get AI Analysis

```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_abc123xyz456",
    "crushId": "crush_xyz789abc123",
    "message": "She replied to my text after 2 hours saying she was busy studying. We chatted for a bit. Is this a good sign?"
  }'
```

**Response:**
```json
{
  "success": true,
  "result": {
    "finalRecommendation": {
      "scenario": "warm_signals",
      "interestLevel": "moderate_interest",
      "confidence": 0.7,
      "nextStep": "Give her space while she's studying, follow up tomorrow with something casual",
      "explanation": "Delayed reply due to genuine reason + continued conversation = positive sign",
      "warnings": "Don't overthink response time, context matters"
    }
  }
}
```

---

## 📋 All Available Endpoints

### User Management
```bash
POST   /api/users                    # Create user
GET    /api/users/:userId            # Get user
PUT    /api/users/:userId            # Update user
```

### Crush Management
```bash
POST   /api/crushes                  # Create crush profile
GET    /api/crushes/:crushId         # Get crush profile
GET    /api/users/:userId/crushes    # List all crushes
PUT    /api/crushes/:crushId         # Update crush
DELETE /api/crushes/:crushId         # Delete crush
```

### AI Analysis
```bash
POST   /api/analyze                  # Full situation analysis
POST   /api/quick-advice             # Quick advice
POST   /api/evaluate                 # Evaluate past action
POST   /api/detect-signals           # Detect interest signals
```

### Blueprints
```bash
GET    /api/scenarios                # Get all scenarios
GET    /api/personalities            # Get all personality types
```

### System
```bash
GET    /api/health                   # Health check
GET    /                             # API documentation
```

---

## 🎨 Example Scenarios

### Scenario 1: First Message

```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "YOUR_USER_ID",
    "crushId": "YOUR_CRUSH_ID",
    "message": "We exchanged numbers at the party. Should I text her first?"
  }'
```

### Scenario 2: Mixed Signals

```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "YOUR_USER_ID",
    "crushId": "YOUR_CRUSH_ID",
    "message": "She seems really interested in person but takes forever to reply to texts. What does this mean?"
  }'
```

### Scenario 3: After a Date

```bash
curl -X POST http://localhost:3001/api/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "YOUR_USER_ID",
    "crushId": "YOUR_CRUSH_ID",
    "action": "We went for coffee",
    "feedback": "She said she had a great time and wants to do it again"
  }'
```

---

## 🔄 Complete Workflow Example

```bash
# Step 1: Create user
USER_ID="user_abc123"
CRUSH_ID="crush_xyz789"

# Step 2: First analysis
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\":\"$USER_ID\",
    \"crushId\":\"$CRUSH_ID\",
    \"message\":\"Just met her, got her number\"
  }"

# Step 3: Get advice on next step
curl -X POST http://localhost:3001/api/quick-advice \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\":\"$USER_ID\",
    \"message\":\"When should I text her?\"
  }"

# Step 4: Evaluate outcome
curl -X POST http://localhost:3001/api/evaluate \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\":\"$USER_ID\",
    \"crushId\":\"$CRUSH_ID\",
    \"action\":\"I texted her the next day\",
    \"feedback\":\"She replied within an hour!\"
  }"

# Step 5: View all crushes
curl "http://localhost:3001/api/users/$USER_ID/crushes"
```

---

## 📚 Documentation Files

- **QUICK_START.md** (this file) - Fast overview
- **USER_GUIDE.md** - Detailed usage examples
- **TESTING.md** - Complete testing guide
- **README.md** - Full system documentation

---

## ⚠️ Important

- **Requires databases**: MongoDB + Neo4j + Gemini API
- **Setup time**: ~30 minutes for first time
- **Test mode available**: Use `node src/server-test.js` to test without databases

---

## 🆘 Stuck?

```bash
# Quick health check
curl http://localhost:3001/api/health

# View all endpoints
curl http://localhost:3001/

# Check server logs
npm run dev
```

---

**You're ready! Start by creating a user, then add a crush, then get AI analysis!** 🚀
