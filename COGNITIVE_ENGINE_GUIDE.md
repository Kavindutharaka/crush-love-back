# COGNITIVE ENGINE GUIDE
## The Decision-Making Brain of MALSARA69

The Cognitive Engine is the core decision-making system that combines psychological pattern recognition with strategic advice generation. It analyzes crush behavior and provides specific, actionable recommendations.

---

## 🧠 System Architecture

The Cognitive Engine consists of **two main components**:

### 1. **Golden Crush Model**
Pattern recognition system that identifies successful romantic indicators and validates if you're "on the right track".

- Analyzes **10+ behavior pattern categories**
- Calculates a **Golden Score** (0-50 scale)
- Provides **percentile ranking** (0-100%)
- Detects positive, neutral, and negative signals
- Gives clear verdict: "On the right track" or "Need to reassess"

### 2. **Cognitive Engine**
Advanced psychological analysis engine that detects personality types, emotional states, and generates strategic responses.

- Detects **6 personality profiles** (Extravert, Introvert, Emotional, Logical, Confident, Playful)
- Analyzes **6 emotional states** (Happy, Sad, Stressed, Excited, Neutral, Confused)
- Identifies **communication modes** (Fast/Short, Slow/Long, Initiates, etc.)
- Tracks **relationship stages** (Stranger → Dating)
- Selects appropriate **psychological tactics** from configurable rules
- Generates **specific message scripts** with behavioral guidelines

---

## 🎯 How It Works

### Input → Processing → Output Flow

```
User Input: "She sent me 'how are you?' today"
           ↓
┌──────────────────────────────────────┐
│  PHASE 1: Golden Crush Model        │
│  - Pattern matching                  │
│  - Score calculation                 │
│  - Track assessment                  │
└──────────────────────────────────────┘
           ↓
┌──────────────────────────────────────┐
│  PHASE 2: Cognitive Engine           │
│  - Profile detection                 │
│  - State analysis                    │
│  - Tactic selection                  │
│  - Response generation               │
└──────────────────────────────────────┘
           ↓
Complete Analysis with:
✓ Golden Crush verdict
✓ Profile diagnosis
✓ Strategic plan
✓ Exact message script
✓ Behavioral guidelines
✓ Outcome predictions
```

---

## 📡 API Usage

### Endpoint: `POST /api/cognitive-analysis`

#### Request Format

```bash
curl -X POST http://localhost:3001/api/cognitive-analysis \
-H "Content-Type: application/json" \
-d '{
  "userId": "user_abc123",
  "crushId": "crush_xyz789",
  "message": "She sent me a message saying '\''how are you?'\'' today. Is this a good sign?",
  "conversationHistory": [
    {
      "sender": "user",
      "message": "Hey! How was your day?",
      "timestamp": "2024-12-25T10:00:00Z"
    },
    {
      "sender": "crush",
      "message": "Pretty good! How about yours?",
      "timestamp": "2024-12-25T10:05:00Z"
    },
    {
      "sender": "crush",
      "message": "How are you?",
      "timestamp": "2024-12-26T09:00:00Z",
      "isInitiation": true
    }
  ]
}'
```

#### Response Format

```json
{
  "success": true,
  "goldenCrushAnalysis": {
    "verdict": true,
    "message": "YES - You are on the right track!",
    "reasoning": "Multiple strong positive signals detected with no red flags",
    "score": {
      "goldenScore": 18,
      "percentile": 76,
      "interpretation": "VERY POSITIVE"
    },
    "signals": {
      "positive": ["initiates_conversations", "shows_interest"],
      "negative": [],
      "summary": "Things are going well. Multiple positive indicators present."
    },
    "feedback": {
      "strengths": [
        "initiates conversation - EXTREMELY POSITIVE - They are thinking about you"
      ],
      "concerns": [],
      "recommendations": [
        "Maintain current approach - it is working",
        "Look for opportunities to deepen connection"
      ]
    },
    "nextMilestone": "Next milestone: Achieve deeper personal sharing or future plans"
  },
  "cognitiveDiagnosis": {
    "targetProfile": {
      "type": "Playful/Humorous",
      "traits": ["fun", "spontaneous", "light_hearted"],
      "communicationStyle": "Playful, humor-based, enjoys banter",
      "confidence": "65%"
    },
    "currentState": "Happy/Positive",
    "replyMode": "Consistent Pattern",
    "relationshipStage": "Friendly",
    "analysisReasoning": "Profile detected as Playful/Humorous based on 65% confidence match. Current emotional state appears to be Happy/Positive. Signals are positive (2 positive, 0 negative)",
    "signals": {
      "positive": ["initiates_conversations", "shows_interest"],
      "negative": [],
      "overallScore": "75%",
      "interpretation": "positive"
    }
  },
  "redFlags": null,
  "strategy": {
    "selectedTactics": [
      {
        "name": "Active Listening",
        "description": "Show genuine interest by remembering details and asking follow-up questions",
        "whenToUse": ["any_stage", "building_rapport"],
        "psychology": "People feel valued when you remember details about their life"
      },
      {
        "name": "Positive Association",
        "description": "Create positive emotional experiences together",
        "whenToUse": ["friendly_stage", "building_attraction"],
        "psychology": "People associate you with the emotions they feel around you"
      }
    ],
    "strategicGoal": "Maintain momentum and deepen connection",
    "psychologyExplained": "Active Listening: People feel valued when you remember details about their life; Positive Association: People associate you with the emotions they feel around you"
  },
  "execution": {
    "theScript": "I'm doing great! How about you? 😊",
    "alternatives": [
      "Pretty good! What about you?",
      "Doing well! How are you doing?"
    ],
    "tone": "playful",
    "timing": {
      "when": "They're actively chatting, excited state, or urgent topic",
      "duration": "within_minutes"
    },
    "behavioralGuide": [
      "Reply relatively quickly to match their energy",
      "Keep message short (1-2 sentences)",
      "Emojis are okay, but use sparingly",
      "Match their communication style and energy level"
    ]
  },
  "prediction": {
    "successIndicator": "They reply enthusiastically, continue the conversation, or make plans",
    "failState": "Sudden one-word reply or long delay (unlikely given current signals)",
    "nextSteps": "If they respond well, increase interaction frequency and look for opportunities to connect",
    "timeframe": "24-48 hours for response evaluation"
  },
  "metadata": {
    "confidenceLevel": "75%",
    "rulesVersion": "1.0.0",
    "timestamp": "2024-12-26T12:00:00.000Z"
  }
}
```

---

## ⚙️ Configuration System

### Psychology Rules JSON (`src/config/psychologyRules.json`)

The entire Cognitive Engine is **configurable via JSON**. You can modify behavior without changing code.

#### What You Can Configure:

1. **Profile Types** - Add/modify personality profiles
2. **Emotional States** - Define new emotional states
3. **Strategic Tactics** - Add new psychological tactics
4. **Communication Modes** - Define reply patterns
5. **Relationship Stages** - Customize stage progression
6. **Response Guidelines** - Adjust timing and messaging rules
7. **Success Indicators** - Define what signals mean
8. **Red Flags** - Configure warning patterns

#### Example: Adding a New Profile Type

```json
{
  "profileTypes": {
    "your_new_profile": {
      "label": "Adventurous/Explorer",
      "indicators": ["travels", "tries_new_things", "spontaneous", "outdoor_activities"],
      "traits": ["adventurous", "spontaneous", "energetic", "curious"],
      "communicationStyle": "Excited about new experiences, shares adventures",
      "preferredApproach": "Suggest new activities, share interesting places, be spontaneous",
      "avoidances": ["routine_boring_dates", "being_predictable", "staying_indoors_only"]
    }
  }
}
```

#### Example: Adding a New Tactic

```json
{
  "strategicTactics": {
    "your_new_tactic": {
      "name": "Storytelling Connection",
      "category": "connection_building",
      "description": "Share engaging stories that reveal character",
      "when_to_use": ["friendly_stage", "building_rapport"],
      "example": "Share a funny or meaningful story from your life",
      "psychology": "Stories create emotional resonance and are more memorable than facts",
      "effectiveness": "high",
      "ethical": true
    }
  }
}
```

#### How to Reload Configuration

The Cognitive Engine automatically loads `psychologyRules.json` on startup. To reload without restarting:

```javascript
// In your code
const engine = new CognitiveEngine();
engine.reloadRules(); // Reloads JSON configuration
```

---

## 🔬 Golden Crush Model Patterns

### Pattern Categories (Weighted by Importance)

#### TIER 1: Strongest Positive (Weight: 9-10)
- **Initiation Patterns**: They reach out first, double-text, send good morning/night
- **Deep Engagement**: Asks personal questions, remembers details
- **Future Orientation**: Makes plans, talks about doing things together

#### TIER 2: Strong Positive (Weight: 7-8)
- **Consistent Effort**: Responds consistently, long replies, asks questions back
- **Emotional Sharing**: Opens up, seeks support, trusts you
- **Physical Proximity**: Finds reasons to be near you, maintains eye contact

#### TIER 3: Moderate Positive (Weight: 6)
- **Playful Engagement**: Teases, laughs at jokes, inside jokes
- **Social Integration**: Wants you to meet friends, includes you in groups

#### RED FLAGS (Weight: -6 to -8)
- **Distance Signals**: One-word responses, never initiates, takes days to respond
- **Friend-Zone Indicators**: Talks about other crushes, calls you "friend"

### Score Interpretation

| Percentile | Level | Meaning |
|-----------|-------|---------|
| 80-100% | EXCEPTIONAL | Very strong interest signals |
| 60-79% | VERY POSITIVE | Multiple positive indicators |
| 40-59% | MODERATELY POSITIVE | Some positive signs |
| 25-39% | UNCLEAR | Mixed signals, need more data |
| 0-24% | CONCERNING | Weak interest or negative patterns |

---

## 🎨 Example Use Cases

### Example 1: Simple Check-in

**User Input:**
```json
{
  "userId": "user_123",
  "message": "She texted me 'how are you' this morning"
}
```

**System Response:**
- Golden Crush: ✅ "YES - On the right track" (she initiated)
- Profile: Likely Playful or Extravert
- Strategy: Respond warmly and quickly
- Script: "I'm doing great! How about you? 😊"

### Example 2: Complex Situation

**User Input:**
```json
{
  "userId": "user_123",
  "crushId": "crush_456",
  "message": "She's been taking hours to reply lately, but when she does reply they're long messages. She also mentioned she has exams coming up. Should I back off?"
}
```

**System Response:**
- Golden Crush: ⚠️ "UNCLEAR - More data needed"
- Emotional State: Stressed/Busy
- Strategy: Space Respect + Supportive
- Script: "I know you're busy with exams - no rush on replying. Good luck!"
- Behavioral Guide: Wait for her to reach out, don't double-text

### Example 3: Negative Signals

**User Input:**
```json
{
  "message": "She always replies with one word and never asks me anything"
}
```

**System Response:**
- Golden Crush: ❌ "NOT YET - Need to reassess approach"
- Red Flags: Distance signals detected
- Recommendation: "Interest may be low - consider giving space or accepting friendship"

---

## 🧪 Testing the Cognitive Engine

### Test Scenarios

Create a test file `test-cognitive.sh`:

```bash
#!/bin/bash

# Test 1: Positive initiation
curl -X POST http://localhost:3001/api/cognitive-analysis \
-H "Content-Type: application/json" \
-d '{
  "userId": "test_user_1",
  "message": "She texted me first today asking how my day was!",
  "conversationHistory": []
}'

# Test 2: Stressed state
curl -X POST http://localhost:3001/api/cognitive-analysis \
-H "Content-Type: application/json" \
-d '{
  "userId": "test_user_2",
  "message": "She said she is really stressed about exams",
  "conversationHistory": [
    {
      "sender": "crush",
      "message": "I am so stressed about these exams ugh",
      "timestamp": "2024-12-26T10:00:00Z"
    }
  ]
}'

# Test 3: Mixed signals
curl -X POST http://localhost:3001/api/cognitive-analysis \
-H "Content-Type: application/json" \
-d '{
  "userId": "test_user_3",
  "message": "She sometimes replies fast, sometimes takes days. I cannot tell if she is interested.",
  "conversationHistory": []
}'
```

Run tests:
```bash
chmod +x test-cognitive.sh
./test-cognitive.sh
```

---

## 📊 Response Structure Reference

### Top-Level Fields
```typescript
{
  success: boolean,
  goldenCrushAnalysis: GoldenCrushAnalysis,
  cognitiveDiagnosis: CognitiveDiagnosis,
  redFlags: RedFlags | null,
  strategy: Strategy,
  execution: Execution,
  prediction: Prediction,
  metadata: Metadata
}
```

### Golden Crush Analysis
```typescript
{
  verdict: boolean | "uncertain",
  message: string,
  reasoning: string,
  score: {
    goldenScore: number,      // 0-50
    percentile: number,        // 0-100
    interpretation: string     // EXCEPTIONAL, VERY POSITIVE, etc.
  },
  signals: {
    positive: string[],
    negative: string[],
    summary: string
  },
  feedback: {
    strengths: string[],
    concerns: string[],
    recommendations: string[]
  },
  nextMilestone: string
}
```

### Cognitive Diagnosis
```typescript
{
  targetProfile: {
    type: string,
    traits: string[],
    communicationStyle: string,
    confidence: string
  },
  currentState: string,
  replyMode: string,
  relationshipStage: string,
  analysisReasoning: string,
  signals: {
    positive: string[],
    negative: string[],
    overallScore: string,
    interpretation: string
  }
}
```

### Execution (The Move)
```typescript
{
  theScript: string,           // Main message to send
  alternatives: string[],      // Alternative message options
  tone: string,                // playful, supportive, balanced, etc.
  timing: {
    when: string,
    duration: string
  },
  behavioralGuide: string[]    // Specific instructions
}
```

---

## 🔧 Advanced Configuration

### Modifying Detection Sensitivity

In `cognitiveEngine.js`, you can adjust detection thresholds:

```javascript
// In detectProfile method
if (crushContext.personality.toLowerCase().includes(profileKey)) {
  score += 10;  // Adjust this weight
}
```

### Custom Message Templates

In `cognitiveEngine.js`, modify the `craftMessage` method to add custom response templates:

```javascript
craftMessage(crushMessage, profile, emotionalState, tone, tactics, signals, variation) {
  // Add your custom templates here
  if (/custom_pattern/i.test(crushMessage)) {
    return "Your custom response";
  }
  // ... rest of logic
}
```

### Adding New Emotional States

1. Add to `psychologyRules.json`:
```json
{
  "emotionalStates": {
    "your_new_state": {
      "label": "Anxious",
      "indicators": ["worried", "nervous", "anxious"],
      "suggestedActions": ["provide_reassurance", "be_calming"],
      "responseStyle": "Calm, reassuring, grounding"
    }
  }
}
```

2. The engine will automatically detect and use it!

---

## 💡 Best Practices

### 1. **Provide Context**
Always include `conversationHistory` when available for better analysis.

### 2. **Regular Updates**
Update crush profiles (`crushId`) with new information as the relationship progresses.

### 3. **Configuration Versioning**
Keep track of `psychologyRules.json` versions in case you need to roll back changes.

### 4. **Monitor Confidence Levels**
Check `metadata.confidenceLevel` - if it's below 50%, the analysis may be uncertain.

### 5. **Red Flag Alerts**
Always check the `redFlags` field - if not null, review the warnings carefully.

### 6. **Iterate on Rules**
The psychology rules are meant to be refined based on real-world outcomes. Track what works!

---

## 🚀 Integration Example

### Frontend Integration

```javascript
// React example
async function getCognitiveAdvice(userMessage, conversationHistory) {
  const response = await fetch('http://localhost:3001/api/cognitive-analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: currentUser.userId,
      crushId: currentCrush.crushId,
      message: userMessage,
      conversationHistory: conversationHistory
    })
  });

  const data = await response.json();

  if (data.success) {
    // Display Golden Crush verdict
    console.log('Verdict:', data.goldenCrushAnalysis.verdict);
    console.log('Message:', data.goldenCrushAnalysis.message);

    // Display the script to send
    console.log('Send this:', data.execution.theScript);

    // Show behavioral guide
    console.log('Guidelines:', data.execution.behavioralGuide);

    return data;
  }
}
```

---

## 📝 Summary

The Cognitive Engine is a sophisticated, configurable decision-making system that:

✅ Analyzes crush behavior patterns
✅ Detects personality types and emotional states
✅ Provides specific message scripts
✅ Gives behavioral guidelines
✅ Predicts outcomes
✅ Fully configurable via JSON
✅ Based on psychological principles

**Key Files:**
- `/src/engine/cognitiveEngine.js` - Main engine logic
- `/src/engine/goldenCrushModel.js` - Pattern recognition
- `/src/config/psychologyRules.json` - Configuration (YOU CAN EDIT THIS!)
- `/src/route/api.js` - API endpoint

**Main Endpoint:**
```
POST /api/cognitive-analysis
```

Start using it now to get psychologically-informed advice on your crush situations! 🎯
