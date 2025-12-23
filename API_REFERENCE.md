# 📡 MALSARA69 API Reference

Complete API documentation for the AI Crush Coaching System.

**Base URL:** `http://localhost:3001/api`

---

## 📋 Table of Contents

1. [User Management](#user-management)
2. [Crush Management](#crush-management)
3. [AI Analysis](#ai-analysis)
4. [Blueprints](#blueprints)
5. [System](#system)
6. [Error Responses](#error-responses)

---

## 🔐 Authentication

Currently, no authentication required. Future versions will implement JWT-based authentication.

---

## 👤 User Management

### Create User

**POST** `/api/users`

Create a new user account.

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (optional)",
  "age": "number (optional, 13-120)",
  "gender": "string (optional: male|female|non-binary|prefer-not-to-say|other)",
  "bio": "string (optional, max 500 chars)"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "age": 24,
    "gender": "male",
    "bio": "Software developer"
  }'
```

**Success Response (201):**
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

**Error Response (400):**
```json
{
  "error": "Name is required"
}
```

---

### Get User

**GET** `/api/users/:userId`

Retrieve user profile by userId.

**URL Parameters:**
- `userId` - User ID (required)

**Example Request:**
```bash
curl http://localhost:3001/api/users/user_a1b2c3d4e5f6
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "userId": "user_a1b2c3d4e5f6",
    "name": "John Doe",
    "email": "john@example.com",
    "age": 24,
    "gender": "male",
    "bio": "Software developer",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "error": "User not found"
}
```

---

### Update User

**PUT** `/api/users/:userId`

Update user profile information.

**URL Parameters:**
- `userId` - User ID (required)

**Request Body:** (all fields optional)
```json
{
  "name": "string",
  "email": "string",
  "age": "number",
  "gender": "string",
  "bio": "string"
}
```

**Example Request:**
```bash
curl -X PUT http://localhost:3001/api/users/user_a1b2c3d4e5f6 \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Senior software developer",
    "age": 25
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "user": { /* updated user object */ }
}
```

---

## 💘 Crush Management

### Create Crush Profile

**POST** `/api/crushes`

Create a new crush profile.

**Request Body:**
```json
{
  "userId": "string (required)",
  "name": "string (required)",
  "age": "number (optional, 13-120)",
  "gender": "string (optional)",
  "relationshipStatus": "string (optional: single|in-relationship|complicated|unknown)",
  "personality": "string (optional: introvert|extrovert|analytical|spontaneous|cautious|direct|unknown)",
  "interests": "array of strings (optional)",
  "whereMetContext": "string (optional, max 500 chars)",
  "notes": "string (optional, max 2000 chars)"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/crushes \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_a1b2c3d4e5f6",
    "name": "Sarah Johnson",
    "age": 23,
    "gender": "female",
    "relationshipStatus": "single",
    "personality": "introvert",
    "interests": ["reading", "coffee", "photography"],
    "whereMetContext": "Met at university coffee shop",
    "notes": "Always smiles when we talk, seems interested"
  }'
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Crush profile created successfully",
  "crush": {
    "crushId": "crush_x9y8z7w6v5u4",
    "userId": "user_a1b2c3d4e5f6",
    "name": "Sarah Johnson",
    "age": 23,
    "gender": "female",
    "relationshipStatus": "single",
    "personality": "introvert",
    "currentStage": "early_stage",
    "createdAt": "2024-01-15T10:05:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "error": "User not found. Create user first."
}
```

---

### Get Crush Profile

**GET** `/api/crushes/:crushId`

Get specific crush profile by crushId.

**URL Parameters:**
- `crushId` - Crush ID (required)

**Example Request:**
```bash
curl http://localhost:3001/api/crushes/crush_x9y8z7w6v5u4
```

**Success Response (200):**
```json
{
  "success": true,
  "crush": {
    "crushId": "crush_x9y8z7w6v5u4",
    "userId": "user_a1b2c3d4e5f6",
    "name": "Sarah Johnson",
    "age": 23,
    "gender": "female",
    "relationshipStatus": "single",
    "personality": "introvert",
    "interests": ["reading", "coffee", "photography"],
    "whereMetContext": "Met at university coffee shop",
    "notes": "Always smiles when we talk",
    "currentStage": "early_stage",
    "lastInteraction": "2024-01-15T10:05:00.000Z",
    "createdAt": "2024-01-15T10:05:00.000Z",
    "updatedAt": "2024-01-15T10:05:00.000Z"
  }
}
```

---

### Get User's Crushes

**GET** `/api/users/:userId/crushes`

Get all crush profiles for a specific user.

**URL Parameters:**
- `userId` - User ID (required)

**Example Request:**
```bash
curl http://localhost:3001/api/users/user_a1b2c3d4e5f6/crushes
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "crushes": [
    {
      "crushId": "crush_x9y8z7w6v5u4",
      "name": "Sarah Johnson",
      "currentStage": "progressing",
      "createdAt": "2024-01-15T10:05:00.000Z"
    },
    {
      "crushId": "crush_abc123def456",
      "name": "Emma Wilson",
      "currentStage": "early_stage",
      "createdAt": "2024-01-14T15:20:00.000Z"
    }
  ]
}
```

---

### Update Crush Profile

**PUT** `/api/crushes/:crushId`

Update crush profile information.

**URL Parameters:**
- `crushId` - Crush ID (required)

**Request Body:** (all fields optional)
```json
{
  "name": "string",
  "age": "number",
  "personality": "string",
  "relationshipStatus": "string",
  "currentStage": "string (early_stage|getting_to_know|friend_zone|progressing|dating|rejected|inactive)",
  "interests": "array of strings",
  "notes": "string"
}
```

**Example Request:**
```bash
curl -X PUT http://localhost:3001/api/crushes/crush_x9y8z7w6v5u4 \
  -H "Content-Type: application/json" \
  -d '{
    "currentStage": "progressing",
    "notes": "We went for coffee! She seemed really happy and wants to hang out again."
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Crush profile updated successfully",
  "crush": { /* updated crush object */ }
}
```

---

### Delete Crush Profile

**DELETE** `/api/crushes/:crushId`

Delete a crush profile permanently.

**URL Parameters:**
- `crushId` - Crush ID (required)

**Example Request:**
```bash
curl -X DELETE http://localhost:3001/api/crushes/crush_x9y8z7w6v5u4
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Crush profile deleted successfully"
}
```

---

## 🤖 AI Analysis

### Analyze Situation

**POST** `/api/analyze`

Get comprehensive AI analysis of a crush situation.

**Request Body:**
```json
{
  "userId": "string (required)",
  "crushId": "string (optional)",
  "message": "string (required, max 5000 chars)",
  "previousAction": "string (optional)",
  "feedback": "string (optional)"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_a1b2c3d4e5f6",
    "crushId": "crush_x9y8z7w6v5u4",
    "message": "She replied to my text after 2 hours saying she was studying. We chatted for 20 minutes. She asked about my weekend plans. Is this a good sign?"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "status": "complete",
  "result": {
    "userId": "user_a1b2c3d4e5f6",
    "crushId": "crush_x9y8z7w6v5u4",
    "timestamp": "2024-01-15T14:30:00.000Z",
    "steps": {
      "informationGathering": {
        "missing_fields": [],
        "questions": []
      },
      "signalDetection": {
        "detected_signals": [
          {
            "behavior": "responded_after_delay_with_reason",
            "classification": "moderate_positive",
            "weight": 0.6,
            "reasoning": "Provided legitimate reason for delay"
          },
          {
            "behavior": "engaged_in_conversation",
            "classification": "strong_positive",
            "weight": 0.8,
            "reasoning": "Continued chatting for 20 minutes"
          },
          {
            "behavior": "asked_about_plans",
            "classification": "strong_positive",
            "weight": 0.85,
            "reasoning": "Showing interest in your life"
          }
        ],
        "overall_assessment": {
          "interest_probability": 0.75,
          "interpretation": "moderate_interest",
          "confidence": 0.8
        }
      },
      "scenarioClassification": {
        "aiClassification": {
          "scenario_label": "warm_signals",
          "reason": "Multiple positive engagement signals detected",
          "expected_challenges": ["maintaining_momentum"],
          "required_actions": ["continue_building_rapport"]
        },
        "blueprintMatch": {
          "label": "warm_signals",
          "description": "Crush is showing positive interest signals",
          "risk_level": "low"
        },
        "recommendedActions": {
          "recommended": [
            "maintain_current_pace",
            "show_reciprocal_interest",
            "build_comfort_gradually",
            "suggest_casual_activity"
          ],
          "avoid": [
            "overwhelming_with_attention",
            "rushing_to_commitment",
            "becoming_overly_serious"
          ],
          "riskLevel": "low"
        }
      },
      "strategy": {
        "plan_step": "Follow up tomorrow with a casual, low-pressure message related to her studies or weekend",
        "explanation": "She's showing clear interest signals. The delayed response was justified and she actively engaged. Asking about your weekend indicates she wants to know more about you.",
        "follow_up_step": "If she responds positively, suggest a casual meet-up related to shared interests",
        "risk_notes": "Don't overthink response times when she provides legitimate reasons. Focus on quality of engagement."
      }
    },
    "finalRecommendation": {
      "scenario": "warm_signals",
      "riskLevel": "low",
      "interestLevel": "moderate_interest",
      "confidence": 0.75,
      "nextStep": "Follow up tomorrow with a casual message. If she engages well, suggest meeting up casually.",
      "explanation": "She's demonstrating clear interest through continued engagement and asking about your life. The delayed response was justified by studying. These are positive signs of growing interest.",
      "warnings": "Don't rush things. Keep interactions casual and build comfort gradually. Avoid overwhelming her with constant messages.",
      "avoid": [
        "Texting her multiple times if she doesn't respond immediately",
        "Being too serious or intense too quickly",
        "Overthinking every detail of her responses"
      ]
    }
  }
}
```

**Error Response (400):**
```json
{
  "error": "Validation failed",
  "details": ["userId is required", "message is required"]
}
```

---

### Quick Advice

**POST** `/api/quick-advice`

Get rapid advice without full analysis pipeline (faster response).

**Request Body:**
```json
{
  "userId": "string (required)",
  "crushId": "string (optional)",
  "message": "string (required)"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/quick-advice \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_a1b2c3d4e5f6",
    "message": "Should I text her today or wait?"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "advice": {
    "scenario": "unclear",
    "nextStep": "If your last message was yesterday and she responded positively, it's fine to send a casual message today",
    "confidence": 0.6
  }
}
```

---

### Evaluate Action

**POST** `/api/evaluate`

Evaluate how a previous action went and get feedback.

**Request Body:**
```json
{
  "userId": "string (required)",
  "crushId": "string (optional)",
  "action": "string (required)",
  "feedback": "string (required)"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_a1b2c3d4e5f6",
    "crushId": "crush_x9y8z7w6v5u4",
    "action": "I asked if she wanted to grab coffee this weekend",
    "feedback": "She said yes and suggested Saturday afternoon!"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "evaluation": {
    "evaluation": "success",
    "reasoning": "Clear enthusiastic acceptance with specific time suggestion shows strong positive interest",
    "possible_causes": ["genuine_interest", "comfortable_with_you", "ready_for_next_step"],
    "hidden_signal": "Suggesting specific time (Saturday afternoon) indicates she's making it a priority",
    "next_action_type": "confirm_plans_and_prepare",
    "kg_update": [
      {
        "relationship": "SHOWED_INTEREST_IN",
        "confidence": "high"
      }
    ]
  }
}
```

---

### Detect Signals

**POST** `/api/detect-signals`

Analyze specific behaviors to detect interest signals.

**Request Body:**
```json
{
  "userId": "string (required)",
  "crushId": "string (optional)",
  "behaviors": "object or string (required)"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/detect-signals \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_a1b2c3d4e5f6",
    "crushId": "crush_x9y8z7w6v5u4",
    "behaviors": {
      "recent_interaction": "She initiated conversation yesterday",
      "response_time": "Usually replies within 1-2 hours",
      "engagement": "Asks follow-up questions and shares about herself"
    }
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "signals": {
    "detected_signals": [
      {
        "behavior": "initiates_conversation",
        "classification": "strong_positive",
        "weight": 0.9
      },
      {
        "behavior": "quick_response_time",
        "classification": "moderate_positive",
        "weight": 0.7
      },
      {
        "behavior": "high_engagement",
        "classification": "strong_positive",
        "weight": 0.85
      }
    ],
    "overall_assessment": {
      "interest_probability": 0.82,
      "interpretation": "strong_interest",
      "confidence": 0.85
    }
  }
}
```

---

### Get Crush Context (Knowledge Graph)

**GET** `/api/crush/:crushId`

Retrieve comprehensive knowledge graph data about a crush.

**URL Parameters:**
- `crushId` - Crush ID (required)

**Query Parameters:**
- `userId` - User ID (optional)

**Example Request:**
```bash
curl "http://localhost:3001/api/crush/crush_x9y8z7w6v5u4?userId=user_a1b2c3d4e5f6"
```

**Success Response (200):**
```json
{
  "success": true,
  "crush": {
    "personInfo": {
      "person": {
        "id": "crush_x9y8z7w6v5u4",
        "name": "Sarah Johnson"
      },
      "relationships": [
        {
          "type": "LIKES",
          "target": { "id": "coffee", "label": "Food" },
          "properties": { "certainty": "confirmed" }
        }
      ]
    },
    "preferences": [
      {
        "type": "LIKES",
        "item": { "id": "coffee", "label": "Food" }
      }
    ],
    "recentEmotions": [
      {
        "emotion": "Happy",
        "context": "during coffee date",
        "certainty": "high"
      }
    ],
    "behavioralPatterns": [
      {
        "action": "LIKES",
        "frequency": 5
      }
    ],
    "interactionHistory": []
  }
}
```

---

## 📖 Blueprints

### Get Scenarios

**GET** `/api/scenarios`

Get all available scenario patterns and blueprints.

**Example Request:**
```bash
curl http://localhost:3001/api/scenarios
```

**Success Response (200):**
```json
{
  "success": true,
  "scenarios": {
    "WARM_SIGNALS": {
      "label": "warm_signals",
      "description": "Crush is showing positive interest signals",
      "indicators": ["frequent_replies", "initiates_conversation", ...],
      "risk_level": "low",
      "recommended_actions": [...],
      "avoid": [...]
    },
    "MIXED_SIGNALS": { ... },
    "STRESS_MODE": { ... },
    "COLD_SIGNALS": { ... },
    "EARLY_STAGE": { ... },
    "FRIEND_ZONE_RISK": { ... },
    "UNAVAILABLE": { ... },
    "POST_REJECTION": { ... },
    "PROGRESS_STAGE": { ... },
    "ANALYSIS_PARALYSIS": { ... }
  }
}
```

---

### Get Personalities

**GET** `/api/personalities`

Get all personality type blueprints.

**Example Request:**
```bash
curl http://localhost:3001/api/personalities
```

**Success Response (200):**
```json
{
  "success": true,
  "personalities": {
    "INTROVERT": {
      "label": "introvert",
      "characteristics": ["prefers_one_on_one", ...],
      "communication_style": "quality_over_quantity",
      "best_approach": [...],
      "warning_signs": [...]
    },
    "EXTROVERT": { ... },
    "ANALYTICAL": { ... },
    "SPONTANEOUS": { ... },
    "CAUTIOUS": { ... },
    "DIRECT": { ... }
  }
}
```

---

## ⚙️ System

### Health Check

**GET** `/api/health`

Check if the API is running and healthy.

**Example Request:**
```bash
curl http://localhost:3001/api/health
```

**Success Response (200):**
```json
{
  "status": "healthy",
  "service": "malsara69",
  "version": "1.0.0",
  "timestamp": "2024-01-15T14:30:00.000Z"
}
```

---

### Root Endpoint

**GET** `/`

Get API information and all available endpoints.

**Example Request:**
```bash
curl http://localhost:3001/
```

**Success Response (200):**
```json
{
  "service": "MALSARA69",
  "description": "AI-powered crush coaching and decision-support system",
  "version": "1.0.0",
  "endpoints": {
    "userManagement": { ... },
    "crushManagement": { ... },
    "aiAnalysis": { ... },
    "blueprints": { ... },
    "system": { ... }
  },
  "documentation": "https://github.com/yourusername/malsara69"
}
```

---

## ❌ Error Responses

### Common HTTP Status Codes

- **200 OK** - Request successful
- **201 Created** - Resource created successfully
- **400 Bad Request** - Invalid request data
- **404 Not Found** - Resource not found
- **429 Too Many Requests** - Rate limit exceeded (30 req/min)
- **500 Internal Server Error** - Server error

### Error Response Format

```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

### Validation Error Format

```json
{
  "error": "Validation failed",
  "details": [
    "userId is required",
    "message must be a non-empty string"
  ]
}
```

---

## 🔒 Rate Limiting

- **Limit:** 30 requests per minute per user/IP
- **Response when exceeded:**

```json
{
  "error": "Too many requests",
  "message": "Please wait before making another request"
}
```

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- All request bodies must have `Content-Type: application/json`
- User IDs are auto-generated in format: `user_xxxxxxxxxxxx`
- Crush IDs are auto-generated in format: `crush_xxxxxxxxxxxx`
- Maximum message length: 5000 characters
- Input is sanitized to prevent XSS attacks

---

## 🔗 Quick Reference

```
POST   /api/users                    Create user
GET    /api/users/:userId            Get user
PUT    /api/users/:userId            Update user

POST   /api/crushes                  Create crush
GET    /api/crushes/:crushId         Get crush
GET    /api/users/:userId/crushes    List crushes
PUT    /api/crushes/:crushId         Update crush
DELETE /api/crushes/:crushId         Delete crush

POST   /api/analyze                  AI analysis
POST   /api/quick-advice             Quick advice
POST   /api/evaluate                 Evaluate action
POST   /api/detect-signals           Detect signals
GET    /api/crush/:crushId           Get KG context

GET    /api/scenarios                Get scenarios
GET    /api/personalities            Get personalities

GET    /api/health                   Health check
GET    /                             API info
```

---

**For integration examples, see FRONTEND_GUIDE.md**
