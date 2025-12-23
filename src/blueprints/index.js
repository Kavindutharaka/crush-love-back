/**
 * BLUEPRINT SYSTEM INDEX
 * Central access point for all decision rules and patterns
 */

const { SCENARIOS } = require('./scenarios');
const { PERSONALITY_TYPES } = require('./personalities');
const { 
  POSITIVE_SIGNALS, 
  NEGATIVE_SIGNALS, 
  NEUTRAL_SIGNALS,
  calculateInterestScore 
} = require('./signals');

/**
 * Find matching scenario based on indicators
 */
const matchScenario = (indicators) => {
  let bestMatch = null;
  let highestMatchCount = 0;

  Object.values(SCENARIOS).forEach(scenario => {
    const matchCount = indicators.filter(indicator => 
      scenario.indicators.includes(indicator)
    ).length;

    if (matchCount > highestMatchCount) {
      highestMatchCount = matchCount;
      bestMatch = scenario;
    }
  });

  return bestMatch || SCENARIOS.EARLY_STAGE;
};

/**
 * Identify personality type based on traits
 */
const identifyPersonality = (traits) => {
  let bestMatch = null;
  let highestMatchCount = 0;

  Object.values(PERSONALITY_TYPES).forEach(personality => {
    const matchCount = traits.filter(trait => 
      personality.characteristics.includes(trait)
    ).length;

    if (matchCount > highestMatchCount) {
      highestMatchCount = matchCount;
      bestMatch = personality;
    }
  });

  return bestMatch;
};

/**
 * Get recommended actions for a scenario
 */
const getRecommendedActions = (scenarioLabel) => {
  const scenario = Object.values(SCENARIOS).find(s => s.label === scenarioLabel);
  return scenario ? {
    recommended: scenario.recommended_actions,
    avoid: scenario.avoid,
    riskLevel: scenario.risk_level
  } : null;
};

/**
 * Analyze signals and return comprehensive assessment
 */
const analyzeSignals = (detectedSignals) => {
  const interestScore = calculateInterestScore(detectedSignals);
  
  let interpretation = "neutral";
  if (interestScore >= 0.7) interpretation = "strong_interest";
  else if (interestScore >= 0.5) interpretation = "moderate_interest";
  else if (interestScore >= 0.3) interpretation = "weak_interest";
  else interpretation = "likely_disinterest";

  return {
    score: interestScore,
    interpretation,
    confidence: Math.abs(interestScore - 0.5) * 2 // 0 = uncertain, 1 = very confident
  };
};

module.exports = {
  SCENARIOS,
  PERSONALITY_TYPES,
  POSITIVE_SIGNALS,
  NEGATIVE_SIGNALS,
  NEUTRAL_SIGNALS,
  matchScenario,
  identifyPersonality,
  getRecommendedActions,
  analyzeSignals,
  calculateInterestScore
};
