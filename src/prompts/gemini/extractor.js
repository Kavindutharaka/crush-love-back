const extractor = (user_message,current_datetime = new Date().toISOString()) =>{
    const prompt = `
You are the RAW INSIGHT EXTRACTOR. 
Your goal is to parse the User's latest message and extract every distinct piece of data into a structured JSON format.

**INPUT CONTEXT:**
User Message: "${user_message}"
Current Date/Time: "${current_datetime}"

**INSTRUCTIONS:**
1. Analyze the message for Entities (People, Places, Objects).
2. Analyze for Sentiment (Positive, Negative, Anxious, Excited).
3. Extract specific activities or events.
4. particular attention to "The Crush" (attributes, reactions).

**OUTPUT FORMAT (JSON ONLY):**
{
  "raw_extraction": {
    "entities": [
      {"name": "Dilki", "type": "person", "role": "crush"},
      {"name": "Mocha", "type": "object", "category": "drink"}
    ],
    "event_detected": {
      "activity": "Coffee Date",
      "sentiment_score": 0.9,
      "time_context": "today"
    },
    "user_state": {
      "emotion": "Happy",
      "intent": "Sharing news"
    },
    "crush_signals": {
      "action": "hangout happily",
      "implied_interest": "high"
    }
  }
}
`;
  return prompt;
};
module.exports = extractor;