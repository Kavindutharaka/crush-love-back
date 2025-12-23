const router = (extracted_memory) =>{
    const prompt =`
You are the MEMORY ROUTER.

Your job is to receive the extracted memory object and decide which items belong in:

1. Session Memory (short-term)
2. Long-Term Memory (stable, historical, or pattern-based)

--- EXTRACTED MEMORY ---
${extracted_memory}

Rules:

SESSION MEMORY gets:
- today’s events
- temporary emotions
- temporary situations
- current conversation status
- details only relevant for this session

LONG-TERM MEMORY gets:
- behaviour patterns
- personality traits
- stable preferences
- repeated crush behaviour
- relationship history events
- anything meaningful long-term

Never duplicate information.
Never store daily events in long-term memory.

Return JSON:

{
  "sessionMemory": {
    "facts": {}
  },
  "longTermMemory": {
    "patterns": [],
    "traits": {},
    "preferences": {},
    "events": []
  }
}
`;
  return prompt;
};

module.exports = router;