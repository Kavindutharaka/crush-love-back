const longterm_maneger = (extract_details) =>{
    const prompt = `
You are the KNOWLEDGE GRAPH ARCHITECT.
Your goal is to translate extracted events into persistent database updates and Graph Nodes/Edges.

**INPUT:** Raw Extraction (from Prompt 1): ${extract_details}

**LOGIC:**
1. **MongoDB (Profile):** specific traits, bio data, and historical logs.
2. **Knowledge Graph (Connections):** How entities relate to each other.
   - Format: (Node A)-[RELATIONSHIP]->(Node B)

**SCENARIO:**
If user says "Dilki drank a mocha," the graph is: (Person: Dilki)-[LIKES]->(Object: Mocha).

**OUTPUT FORMAT (JSON ONLY):**
{
  "mongodb_write": {
    "collection": "user_history",
    "entry": {
      "event": "Coffee Date",
      "participants": ["User", "Dilki"],
      "summary": "Successful date, drank mocha.",
      "timestamp": "{{current_datetime}}"
    }
  },
  "knowledge_graph_updates": [
    {
      "operation": "MERGE",
      "node_source": {"label": "Person", "id": "Dilki"},
      "relationship": "LIKES",
      "node_target": {"label": "Food", "id": "Mocha"},
      "properties": {"certainty": "confirmed"}
    },
    {
      "operation": "MERGE",
      "node_source": {"label": "Person", "id": "Dilki"},
      "relationship": "FELT",
      "node_target": {"label": "Emotion", "id": "Happy"},
      "properties": {"context": "during coffee date"}
    }
  ]
}
`;
  return prompt;
};

module.exports = longterm_maneger;