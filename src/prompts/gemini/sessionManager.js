const session_maneger = (extract_details, pre_ses_context='') =>{
    const prompt = `
You are the SESSION MEMORY MANAGER.
Your goal is to maintain the immediate conversational context. 

**INPUTS:**
1. Previous Session Context: ${pre_ses_context}
2. New Raw Extraction (from Prompt 1): ${extract_details}

**RULES:**
1. **Update:** Overwrite temporary feelings or current topics. 
2. **Prune:** If a topic from 5 turns ago is finished, remove it.
3. **Goal Tracking:** Are we currently analyzing a specific scenario? Keep that active.

**OUTPUT FORMAT (JSON ONLY):**
{
  "session_update": {
    "current_topic": "Post-date analysis",
    "conversation_stage": "Data Gathering", 
    "active_context": {
      "last_event": "Coffee date with Dilki",
      "user_mood": "Positive"
    },
    "immediate_next_step": "Analyze the crush's behavior details"
  }
}
`;
  return prompt;
};

module.exports = session_maneger;