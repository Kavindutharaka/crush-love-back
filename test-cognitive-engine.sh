#!/bin/bash

# Test script for Cognitive Engine
# Run this to test the cognitive analysis endpoint

API_URL="http://localhost:3001/api/cognitive-analysis"

echo "🧠 COGNITIVE ENGINE TEST SUITE"
echo "================================"
echo ""

# Test 1: Positive Signal - She initiated contact
echo "TEST 1: Positive Signal - Initiation"
echo "-------------------------------------"
curl -X POST $API_URL \
-H "Content-Type: application/json" \
-d '{
  "userId": "test_user_1",
  "message": "She sent me a message this morning saying '\''how are you?'\'' - is this a good sign?",
  "conversationHistory": [
    {
      "sender": "crush",
      "message": "How are you?",
      "timestamp": "2024-12-26T09:00:00Z",
      "isInitiation": true
    }
  ]
}' | jq '.'

echo ""
echo ""

# Test 2: Stressed State
echo "TEST 2: Stressed State Detection"
echo "---------------------------------"
curl -X POST $API_URL \
-H "Content-Type: application/json" \
-d '{
  "userId": "test_user_2",
  "message": "She mentioned she is really stressed about her exams coming up",
  "conversationHistory": [
    {
      "sender": "crush",
      "message": "I am so stressed about these exams, I have so much to study",
      "timestamp": "2024-12-26T10:00:00Z"
    }
  ]
}' | jq '.'

echo ""
echo ""

# Test 3: Mixed Signals
echo "TEST 3: Mixed Signals Analysis"
echo "-------------------------------"
curl -X POST $API_URL \
-H "Content-Type: application/json" \
-d '{
  "userId": "test_user_3",
  "message": "She sometimes replies really fast with long messages, but other times takes hours. I cannot tell if she is interested or not."
}' | jq '.'

echo ""
echo ""

# Test 4: Red Flag Detection
echo "TEST 4: Red Flag Detection"
echo "--------------------------"
curl -X POST $API_URL \
-H "Content-Type: application/json" \
-d '{
  "userId": "test_user_4",
  "message": "She always gives one word answers and never asks me anything about myself. She also talks about other guys a lot."
}' | jq '.'

echo ""
echo ""

# Test 5: Multiple Positive Signals
echo "TEST 5: Multiple Positive Signals"
echo "----------------------------------"
curl -X POST $API_URL \
-H "Content-Type: application/json" \
-d '{
  "userId": "test_user_5",
  "crushId": "crush_test_1",
  "message": "She texted me first today, asked how my exam went (she remembered!), and suggested we should grab coffee this weekend.",
  "conversationHistory": [
    {
      "sender": "crush",
      "message": "Hey! How did your exam go? I remembered you had it today",
      "timestamp": "2024-12-26T14:00:00Z",
      "isInitiation": true
    },
    {
      "sender": "user",
      "message": "It went well! Thanks for asking",
      "timestamp": "2024-12-26T14:05:00Z"
    },
    {
      "sender": "crush",
      "message": "That is great! We should grab coffee this weekend to celebrate",
      "timestamp": "2024-12-26T14:06:00Z"
    }
  ]
}' | jq '.'

echo ""
echo ""
echo "✅ Test suite complete!"
echo ""
echo "Note: These tests require the server to be running on port 3001"
echo "Start server with: npm start"
