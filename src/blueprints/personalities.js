/**
 * PERSONALITY TYPES BLUEPRINT
 * Helps identify crush personality patterns for better strategy
 */

const PERSONALITY_TYPES = {
  INTROVERT: {
    label: "introvert",
    characteristics: [
      "prefers_one_on_one",
      "needs_alone_time",
      "thoughtful_responses",
      "selective_with_sharing",
      "deeper_conversations"
    ],
    communication_style: "quality_over_quantity",
    best_approach: [
      "respect_their_space",
      "initiate_meaningful_conversations",
      "suggest_quiet_activities",
      "be_patient_with_responses",
      "avoid_overwhelming"
    ],
    warning_signs: [
      "silence_is_normal",
      "slow_to_open_up",
      "may_need_processing_time"
    ]
  },

  EXTROVERT: {
    label: "extrovert",
    characteristics: [
      "energized_by_people",
      "quick_to_respond",
      "shares_openly",
      "enjoys_group_settings",
      "expressive"
    ],
    communication_style: "frequent_and_enthusiastic",
    best_approach: [
      "match_their_energy",
      "engage_actively",
      "suggest_social_activities",
      "be_responsive",
      "show_enthusiasm"
    ],
    warning_signs: [
      "friendliness_may_not_equal_interest",
      "naturally_warm_with_everyone"
    ]
  },

  ANALYTICAL: {
    label: "analytical",
    characteristics: [
      "logical_thinker",
      "needs_time_to_decide",
      "values_competence",
      "detail_oriented",
      "cautious_with_emotions"
    ],
    communication_style: "thoughtful_and_precise",
    best_approach: [
      "be_genuine_and_consistent",
      "show_intelligence",
      "respect_their_process",
      "avoid_drama",
      "build_trust_slowly"
    ],
    warning_signs: [
      "slow_emotional_opening",
      "may_overanalyze"
    ]
  },

  SPONTANEOUS: {
    label: "spontaneous",
    characteristics: [
      "goes_with_flow",
      "enjoys_surprises",
      "flexible",
      "adventurous",
      "lives_in_moment"
    ],
    communication_style: "casual_and_adaptive",
    best_approach: [
      "be_fun_and_playful",
      "suggest_spontaneous_plans",
      "keep_things_light",
      "show_adventurous_side",
      "avoid_rigidity"
    ],
    warning_signs: [
      "may_be_inconsistent",
      "commitment_may_scare_them"
    ]
  },

  CAUTIOUS: {
    label: "cautious",
    characteristics: [
      "careful_decision_maker",
      "needs_security",
      "values_stability",
      "risk_averse",
      "traditional"
    ],
    communication_style: "steady_and_measured",
    best_approach: [
      "build_trust_first",
      "show_reliability",
      "move_slowly",
      "demonstrate_consistency",
      "respect_boundaries"
    ],
    warning_signs: [
      "very_slow_progression",
      "may_reject_if_uncertain"
    ]
  },

  DIRECT: {
    label: "direct",
    characteristics: [
      "straightforward",
      "says_what_they_mean",
      "values_honesty",
      "no_games",
      "clear_communicator"
    ],
    communication_style: "honest_and_clear",
    best_approach: [
      "be_authentic",
      "communicate_clearly",
      "avoid_mind_games",
      "be_upfront",
      "respect_directness"
    ],
    warning_signs: [
      "bluntness_is_not_rudeness",
      "rejection_will_be_clear"
    ]
  }
};

module.exports = { PERSONALITY_TYPES };
