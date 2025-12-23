const scenario_analyzer = (user_situation, blueprint_data, kg_context) => {
    const prompt = `
SYSTEM:
You are the Scenario Analyzer Agent.

Objective:
Classify the current communication scenario based on the blueprint document.

INPUTS:
- User Situation: ${JSON.stringify(user_situation)}
- Blueprint Categories: ${JSON.stringify(blueprint_data)}
- Knowledge Graph Context: ${JSON.stringify(kg_context)}

Instructions:
1. Compare current situation against the blueprint categories.
2. Identify major blockers.
3. Identify required next steps.
4. Provide a structured reasoning.

Output (JSON only):
{
  "scenario_label": "...",
  "reason": "...",
  "expected_challenges": [ ... ],
  "required_actions": [ ... ]
}
`;
  return prompt;
};

module.exports = scenario_analyzer;
