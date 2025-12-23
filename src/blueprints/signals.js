/**
 * SIGNAL DETECTION RULES
 * Interprets crush behaviors and maps them to interest levels
 */

const POSITIVE_SIGNALS = {
  STRONG: [
    { signal: "initiates_conversation_frequently", weight: 0.9 },
    { signal: "makes_time_despite_being_busy", weight: 0.85 },
    { signal: "physical_touch_appropriate", weight: 0.9 },
    { signal: "remembers_small_details", weight: 0.85 },
    { signal: "asks_about_relationship_status", weight: 0.95 },
    { signal: "suggests_one_on_one_time", weight: 0.9 },
    { signal: "shows_jealousy_subtly", weight: 0.8 },
    { signal: "compliments_frequently", weight: 0.7 },
    { signal: "mirrors_body_language", weight: 0.75 }
  ],
  MODERATE: [
    { signal: "responds_within_reasonable_time", weight: 0.6 },
    { signal: "laughs_at_jokes", weight: 0.5 },
    { signal: "shares_personal_stories", weight: 0.65 },
    { signal: "asks_follow_up_questions", weight: 0.7 },
    { signal: "engages_in_longer_conversations", weight: 0.6 },
    { signal: "likes_social_media_posts", weight: 0.4 },
    { signal: "mentions_common_interests", weight: 0.55 }
  ],
  WEAK: [
    { signal: "responds_eventually", weight: 0.3 },
    { signal: "polite_but_not_engaged", weight: 0.2 },
    { signal: "group_interaction_only", weight: 0.25 },
    { signal: "friendly_but_distant", weight: 0.3 }
  ]
};

const NEGATIVE_SIGNALS = {
  STRONG: [
    { signal: "ignores_messages_consistently", weight: -0.9 },
    { signal: "cancels_plans_repeatedly", weight: -0.85 },
    { signal: "talks_about_other_crushes", weight: -0.95 },
    { signal: "avoids_physical_proximity", weight: -0.8 },
    { signal: "one_word_responses_always", weight: -0.85 },
    { signal: "never_initiates_contact", weight: -0.7 },
    { signal: "mentions_just_friends_explicitly", weight: -1.0 }
  ],
  MODERATE: [
    { signal: "slow_response_time_usually", weight: -0.5 },
    { signal: "keeps_conversations_superficial", weight: -0.6 },
    { signal: "declines_invitations_often", weight: -0.65 },
    { signal: "distracted_during_interaction", weight: -0.55 }
  ],
  WEAK: [
    { signal: "occasionally_busy", weight: -0.2 },
    { signal: "tired_or_stressed", weight: -0.1 },
    { signal: "slow_to_open_up", weight: -0.15 }
  ]
};

const NEUTRAL_SIGNALS = [
  { signal: "friendly_conversation", context: "baseline" },
  { signal: "polite_interaction", context: "social_norm" },
  { signal: "group_chat_participation", context: "not_personal" },
  { signal: "professional_courtesy", context: "work_or_school" }
];

/**
 * Calculate interest probability based on signals
 */
const calculateInterestScore = (signals) => {
  let score = 0;
  let count = 0;

  signals.forEach(detectedSignal => {
    // Search in positive signals
    Object.values(POSITIVE_SIGNALS).forEach(category => {
      const found = category.find(s => s.signal === detectedSignal);
      if (found) {
        score += found.weight;
        count++;
      }
    });

    // Search in negative signals
    Object.values(NEGATIVE_SIGNALS).forEach(category => {
      const found = category.find(s => s.signal === detectedSignal);
      if (found) {
        score += found.weight;
        count++;
      }
    });
  });

  // Normalize score to 0-1 range
  const normalizedScore = count > 0 ? (score + count) / (count * 2) : 0.5;
  return Math.max(0, Math.min(1, normalizedScore));
};

module.exports = {
  POSITIVE_SIGNALS,
  NEGATIVE_SIGNALS,
  NEUTRAL_SIGNALS,
  calculateInterestScore
};
