# MALSARA69 Testing Guide

Complete guide to test the AI Crush Coaching System.

---

## STEP 1: Environment Setup

### 1.1 Check Node.js Version
```bash
node --version
# Should be >= 16.x
```

### 1.2 Install Dependencies
```bash
npm install
```

### 1.3 Configure Environment Variables
```bash
# Copy template
cp .env.example .env

# Edit .env with your credentials
nano .env
```

Required variables:
```env
MONGO_URI=mongodb://localhost:27017/malsara69
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASS=your_password
GEMINI_KEY=your_gemini_api_key
PORT=3001
NODE_ENV=development
```

---

## STEP 2: Database Setup

### 2.1 Start MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB (if not installed)
# Ubuntu/Debian:
sudo apt-get install -y mongodb

# macOS:
brew install mongodb-community

# Start MongoDB
sudo systemctl start mongodb
# OR
mongod --dbpath /path/to/data
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update MONGO_URI in .env

**Verify Connection:**
```bash
mongosh mongodb://localhost:27017/malsara69
# Should connect successfully
```

### 2.2 Start Neo4j

**Option A: Local Neo4j**
```bash
# Download from https://neo4j.com/download/
# Or use Docker:
docker run \
  --name neo4j \
  -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/your_password \
  neo4j:latest
```

**Option B: Neo4j Aura (Cloud)**
1. Go to https://neo4j.com/cloud/aura/
2. Create free instance
3. Get connection details
4. Update NEO4J_URI, NEO4J_USER, NEO4J_PASS in .env

**Verify Connection:**
- Open browser: http://localhost:7474
- Login with credentials
- Run: `MATCH (n) RETURN n LIMIT 1`

### 2.3 Get Gemini API Key

1. Go to https://aistudio.google.com/app/apikey
2. Create API key
3. Copy key to .env as GEMINI_KEY

---

## STEP 3: Start Server

```bash
# Development mode (auto-restart)
npm run dev

# OR production mode
npm start
```

**Expected Output:**
```
MongoDB connected successfully!
Connection established (Neo4j)

╔═══════════════════════════════════════════╗
║                                           ║
║         MALSARA69 SERVER RUNNING          ║
║                                           ║
║   AI Crush Coaching System                ║
║   Port: 3001                              ║
║   Environment: development                ║
║                                           ║
╚═══════════════════════════════════════════╝
```

---

## STEP 4: Create User & Crush Profiles

**IMPORTANT:** Before running AI analysis, you need to create a user and crush profile!

### 4.1 Create a User

```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "age": 24,
    "gender": "male",
    "bio": "Software developer interested in AI"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "userId": "user_a1b2c3d4e5f6",
    "name": "John Doe",
    "email": "john@example.com",
    "age": 24,
    "gender": "male",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Save your `userId` - you'll need it for all future requests!**

### 4.2 Create a Crush Profile

```bash
curl -X POST http://localhost:3001/api/crushes \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_a1b2c3d4e5f6",
    "name": "Sarah",
    "age": 23,
    "gender": "female",
    "relationshipStatus": "single",
    "personality": "introvert",
    "interests": ["reading", "coffee", "photography"],
    "whereMetContext": "Met at coffee shop near campus",
    "notes": "Seems interested, always smiles when we talk"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Crush profile created successfully",
  "crush": {
    "crushId": "crush_x9y8z7w6v5u4",
    "userId": "user_a1b2c3d4e5f6",
    "name": "Sarah",
    "age": 23,
    "gender": "female",
    "relationshipStatus": "single",
    "personality": "introvert",
    "currentStage": "early_stage",
    "createdAt": "2024-01-15T10:05:00.000Z"
  }
}
```

**Save your `crushId` - you'll use this to analyze situations!**

### 4.3 Get User's Crushes

```bash
curl http://localhost:3001/api/users/user_a1b2c3d4e5f6/crushes
```

### 4.4 Update Crush Profile

```bash
curl -X PUT http://localhost:3001/api/crushes/crush_x9y8z7w6v5u4 \
  -H "Content-Type: application/json" \
  -d '{
    "currentStage": "progressing",
    "notes": "We went for coffee together! She seemed really happy."
  }'
```

---

## STEP 5: API Testing

### Test 1: Health Check ✅

```bash
curl http://localhost:3001/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "service": "malsara69",
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Test 2: Get Scenarios 📋

```bash
curl http://localhost:3001/api/scenarios
```

**Expected:** List of 10 scenario patterns

### Test 3: Get Personalities 🧠

```bash
curl http://localhost:3001/api/personalities
```

**Expected:** List of 6 personality types

### Test 4: Analyze Situation (Main Test) 🎯

```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user_001",
    "crushId": "sarah_123",
    "message": "She replied to my text after 2 hours saying \"hey! sorry was busy\". We talked for a bit and she asked about my weekend. What does this mean?"
  }'
```

**Expected Response Structure:**
```json
{
  "success": true,
  "status": "complete",
  "result": {
    "userId": "test_user_001",
    "crushId": "sarah_123",
    "timestamp": "...",
    "steps": {
      "informationGathering": {...},
      "signalDetection": {...},
      "scenarioClassification": {...},
      "strategy": {...}
    },
    "finalRecommendation": {
      "scenario": "warm_signals | mixed_signals | ...",
      "riskLevel": "low | medium | high",
      "interestLevel": "strong_interest | moderate_interest | ...",
      "confidence": 0.7,
      "nextStep": "Suggested action...",
      "explanation": "Reasoning...",
      "warnings": "Things to avoid..."
    }
  }
}
```

### Test 5: Quick Advice ⚡

```bash
curl -X POST http://localhost:3001/api/quick-advice \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user_001",
    "message": "Should I text her again or wait?"
  }'
```

### Test 6: Detect Signals 🔍

```bash
curl -X POST http://localhost:3001/api/detect-signals \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user_001",
    "crushId": "sarah_123",
    "behaviors": {
      "recent_interaction": "She initiated conversation yesterday",
      "response_time": "Usually replies within 1-2 hours",
      "engagement": "Asks follow-up questions"
    }
  }'
```

### Test 7: Evaluate Action 📊

```bash
curl -X POST http://localhost:3001/api/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user_001",
    "crushId": "sarah_123",
    "action": "I asked if she wanted to grab coffee this weekend",
    "feedback": "She said yes and suggested Saturday afternoon"
  }'
```

### Test 8: Get Crush Context 📖

```bash
curl "http://localhost:3001/api/crush/sarah_123?userId=test_user_001"
```

**Note:** Initially returns null/empty since no data stored yet

---

## STEP 6: End-to-End Scenario Test

Run this complete scenario to test the full pipeline:

### Scenario: "First Date Went Well"

**Step 1: Initial Analysis**
```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "john_doe",
    "crushId": "emma_smith",
    "message": "We went for coffee yesterday. She laughed at my jokes, we talked for 2 hours, and she mentioned wanting to try this new restaurant. She texted me this morning saying she had a great time."
  }' | jq
```

**Expected:** Warm signals, high interest probability

**Step 2: Ask for Next Step**
```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "john_doe",
    "crushId": "emma_smith",
    "message": "Should I ask her to that restaurant she mentioned?"
  }' | jq
```

**Expected:** Positive recommendation to follow up

**Step 3: Evaluate Outcome**
```bash
curl -X POST http://localhost:3001/api/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "john_doe",
    "crushId": "emma_smith",
    "action": "I suggested going to the restaurant this weekend",
    "feedback": "She immediately said yes and asked if Saturday works"
  }' | jq
```

**Expected:** Success evaluation, continue progression

---

## STEP 7: Verify Database Storage

### MongoDB Verification
```bash
mongosh mongodb://localhost:27017/malsara69

# Check chat history
db.chats.find().pretty()

# Check session data
db.sessions.find().pretty()

# Check history
db.histories.find().pretty()
```

### Neo4j Verification
```cypher
// Open Neo4j Browser: http://localhost:7474

// Check all nodes
MATCH (n) RETURN n LIMIT 25

// Check relationships
MATCH (a)-[r]->(b) RETURN a, r, b LIMIT 25

// Check Emma's data
MATCH (p:Person {id: "emma_smith"})
OPTIONAL MATCH (p)-[r]->(target)
RETURN p, r, target
```

---

## STEP 8: Error Handling Tests

### Test Invalid Request (No userId)
```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Test message"
  }'
```

**Expected:** 400 Bad Request with validation errors

### Test Rate Limiting
```bash
# Run this 35 times rapidly (limit is 30/min)
for i in {1..35}; do
  curl -X POST http://localhost:3001/api/analyze \
    -H "Content-Type: application/json" \
    -d '{"userId":"test","message":"test"}' &
done
wait
```

**Expected:** 429 Too Many Requests after 30 requests

### Test XSS Protection
```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test",
    "message": "<script>alert(\"xss\")</script>Hello"
  }'
```

**Expected:** Script tags removed, safe processing

---

## STEP 9: Performance Monitoring

### Check Response Times
```bash
time curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "perf_test",
    "message": "Quick test message"
  }'
```

**Expected:**
- Quick mode: < 3 seconds
- Full analysis: 5-15 seconds (depends on AI response time)

### Monitor Server Logs
```bash
# Watch logs in real-time
npm run dev
# Observe console output for each request
```

---

## STEP 10: Common Issues & Solutions

### Issue: MongoDB Connection Failed
**Solution:**
```bash
# Check if MongoDB is running
sudo systemctl status mongodb

# Start MongoDB
sudo systemctl start mongodb

# Check port 27017 is open
netstat -an | grep 27017
```

### Issue: Neo4j Connection Failed
**Solution:**
```bash
# Check Neo4j status
docker ps | grep neo4j

# Restart Neo4j
docker restart neo4j

# Check logs
docker logs neo4j
```

### Issue: Gemini API Error 503
**Solution:**
- System automatically retries 3 times
- Falls back to gemini-2.5-flash if gemini-3-pro-preview fails
- Check API quota: https://aistudio.google.com/

### Issue: Empty Knowledge Graph
**Solution:**
- Normal for first run
- KG builds up as you use the system
- Each analysis adds nodes and relationships

---

## STEP 11: Integration Testing with Postman

### Import Collection

Create file `malsara69.postman_collection.json`:

```json
{
  "info": {
    "name": "MALSARA69 API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "http://localhost:3001/api/health"
      }
    },
    {
      "name": "Analyze Situation",
      "request": {
        "method": "POST",
        "url": "http://localhost:3001/api/analyze",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"userId\": \"test_user\",\n  \"crushId\": \"test_crush\",\n  \"message\": \"She smiled at me today\"\n}"
        }
      }
    }
  ]
}
```

Import into Postman and run collection tests.

---

## STEP 12: Production Readiness Checklist

Before deploying to production:

- [ ] All tests pass
- [ ] MongoDB connected and accessible
- [ ] Neo4j connected and accessible
- [ ] Gemini API key valid and has quota
- [ ] Environment variables set correctly
- [ ] Rate limiting tested
- [ ] Input validation working
- [ ] Error handling verified
- [ ] Performance acceptable (< 15s response)
- [ ] Database backups configured
- [ ] Monitoring/logging in place
- [ ] Security audit completed

---

## 🎯 Success Criteria

Your system is working correctly if:

✅ Server starts without errors
✅ Health endpoint returns 200 OK
✅ Analysis returns structured JSON with recommendations
✅ Memory system stores data in MongoDB
✅ Knowledge graph builds relationships in Neo4j
✅ Rate limiting prevents abuse
✅ Input validation blocks malicious input
✅ AI responses are coherent and helpful

---

## 📞 Troubleshooting

If you encounter issues:

1. Check server logs for error messages
2. Verify all environment variables are set
3. Test database connections separately
4. Ensure API key is valid
5. Check firewall/network settings
6. Review MongoDB and Neo4j logs

---

**Ready to test? Start with Step 1 and work through each section!**
