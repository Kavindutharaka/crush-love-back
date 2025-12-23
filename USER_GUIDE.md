# MALSARA69 User Guide

Quick guide to using the AI Crush Coaching System.

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Create Your Account

```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Name",
    "email": "your@email.com",
    "age": 24,
    "gender": "male"
  }'
```

**Save the `userId` from the response!**

---

### Step 2: Add Your Crush

```bash
curl -X POST http://localhost:3001/api/crushes \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "YOUR_USER_ID_HERE",
    "name": "Crush Name",
    "age": 23,
    "gender": "female",
    "personality": "introvert",
    "whereMetContext": "Met at university",
    "notes": "Always smiles when we talk"
  }'
```

**Save the `crushId` from the response!**

---

### Step 3: Get AI Analysis

```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "YOUR_USER_ID",
    "crushId": "YOUR_CRUSH_ID",
    "message": "She replied to my text after 2 hours saying she was studying. Is that a good sign?"
  }'
```

**You'll get:**
- Scenario classification (warm signals, mixed signals, etc.)
- Interest probability score
- Recommended next step
- Things to avoid
- Detailed explanation

---

## 📖 Common Use Cases

### Situation 1: First Interaction

```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_abc123",
    "crushId": "crush_xyz789",
    "message": "We just met at a party. She seemed friendly. Should I text her?"
  }'
```

### Situation 2: Mixed Signals

```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_abc123",
    "crushId": "crush_xyz789",
    "message": "She takes hours to reply but when we talk in person, she seems really interested. What does this mean?"
  }'
```

### Situation 3: Post-Date Evaluation

```bash
curl -X POST http://localhost:3001/api/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_abc123",
    "crushId": "crush_xyz789",
    "action": "I asked her out for coffee",
    "feedback": "She said yes and suggested this Saturday!"
  }'
```

---

## 🔄 Managing Your Crush Profile

### View All Your Crushes

```bash
curl http://localhost:3001/api/users/YOUR_USER_ID/crushes
```

### Update Crush Stage

```bash
curl -X PUT http://localhost:3001/api/crushes/YOUR_CRUSH_ID \
  -H "Content-Type: application/json" \
  -d '{
    "currentStage": "progressing",
    "notes": "We went on our first date. It went really well!"
  }'
```

### Delete a Crush Profile

```bash
curl -X DELETE http://localhost:3001/api/crushes/YOUR_CRUSH_ID
```

---

## 🎯 Understanding AI Responses

### Scenario Types

- **warm_signals** - Clear signs of interest
- **mixed_signals** - Unclear or contradictory behavior
- **stress_mode** - Crush is busy/stressed
- **cold_signals** - Low interest signs
- **early_stage** - Just starting to know each other
- **friend_zone_risk** - Strong friendship, unclear romance
- **progress_stage** - Things are going well

### Interest Levels

- **strong_interest** (0.7 - 1.0) - Very positive signs
- **moderate_interest** (0.5 - 0.7) - Good signs, proceed carefully
- **unclear** (0.3 - 0.5) - Not enough data or mixed signals
- **likely_disinterest** (0.0 - 0.3) - Low interest signals

### Risk Levels

- **low** - Safe to proceed
- **medium** - Proceed with caution
- **high** - High risk, be very careful
- **critical** - Stop or reassess completely

---

## 📊 Example Full Workflow

```bash
# 1. Create user
USER_RESPONSE=$(curl -s -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alex","age":25,"gender":"male"}')

USER_ID=$(echo $USER_RESPONSE | jq -r '.user.userId')
echo "User ID: $USER_ID"

# 2. Create crush
CRUSH_RESPONSE=$(curl -s -X POST http://localhost:3001/api/crushes \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"$USER_ID\",\"name\":\"Emma\",\"age\":24}")

CRUSH_ID=$(echo $CRUSH_RESPONSE | jq -r '.crush.crushId')
echo "Crush ID: $CRUSH_ID"

# 3. Get analysis
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\":\"$USER_ID\",
    \"crushId\":\"$CRUSH_ID\",
    \"message\":\"We had lunch together and she laughed at my jokes. Good sign?\"
  }" | jq

# 4. Check crush context (after some interactions)
curl "http://localhost:3001/api/crush/$CRUSH_ID?userId=$USER_ID" | jq
```

---

## 🛡️ Best Practices

1. **Be Honest** - Give accurate information about situations
2. **Update Regularly** - Keep crush profiles updated
3. **Follow Advice** - The AI gives safe, respectful guidance
4. **Don't Rush** - Follow the recommended pace
5. **Respect Boundaries** - If signals are cold, respect that

---

## ⚠️ Important Notes

- System prioritizes **safety and respect**
- No manipulation or deception tactics
- Honest about disinterest signals
- Teaches emotional awareness
- Helps you become more confident

---

## 🆘 Need Help?

- Check `TESTING.md` for full API documentation
- Review `README.md` for system architecture
- All responses include explanations
- Ask specific questions for better guidance

---

**Remember: MALSARA69 is a decision-support tool, not a guarantee. Real relationships require genuine connection, respect, and mutual interest.**
