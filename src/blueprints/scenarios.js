/**
 * MALSARA69 BLUEPRINT SYSTEM
 * Defines structured scenarios, signals, and response strategies
 */

const SCENARIOS = {
  // Positive signals - crush showing interest
  WARM_SIGNALS: {
    label: "warm_signals",
    description: "Crush is showing positive interest signals",
    indicators: [
      "frequent_replies",
      "initiates_conversation",
      "asks_personal_questions",
      "shares_personal_info",
      "laughs_at_jokes",
      "prolonged_eye_contact",
      "finds_reasons_to_talk"
    ],
    risk_level: "low",
    recommended_actions: [
      "maintain_current_pace",
      "show_reciprocal_interest",
      "build_comfort_gradually",
      "suggest_casual_activity"
    ],
    avoid: [
      "overwhelming_with_attention",
      "rushing_to_commitment",
      "becoming_overly_serious"
    ]
  },

  // Mixed signals - unclear intentions
  MIXED_SIGNALS: {
    label: "mixed_signals",
    description: "Crush showing inconsistent or contradictory behavior",
    indicators: [
      "inconsistent_response_time",
      "warm_in_person_distant_online",
      "says_one_thing_does_another",
      "hot_and_cold_behavior"
    ],
    risk_level: "medium",
    recommended_actions: [
      "observe_without_reacting",
      "give_space",
      "maintain_friendly_neutrality",
      "focus_on_own_activities",
      "gather_more_data_points"
    ],
    avoid: [
      "demanding_clarity",
      "overthinking_every_message",
      "confronting_directly",
      "assuming_worst_case"
    ]
  },

  // Crush is stressed or busy
  STRESS_MODE: {
    label: "stress_mode",
    description: "Crush is dealing with external pressures (exams, work, family)",
    indicators: [
      "mentions_stress",
      "shorter_replies",
      "less_available",
      "preoccupied_behavior",
      "tired_or_overwhelmed"
    ],
    risk_level: "low",
    recommended_actions: [
      "be_supportive_not_demanding",
      "offer_help_if_appropriate",
      "reduce_communication_frequency",
      "send_encouraging_messages",
      "respect_boundaries"
    ],
    avoid: [
      "taking_distance_personally",
      "adding_to_their_stress",
      "demanding_attention",
      "overthinking_silence"
    ]
  },

  // Cold or distant behavior
  COLD_SIGNALS: {
    label: "cold_signals",
    description: "Crush showing disinterest or creating distance",
    indicators: [
      "one_word_replies",
      "never_initiates",
      "ignores_questions",
      "avoids_meetups",
      "shows_interest_in_others"
    ],
    risk_level: "high",
    recommended_actions: [
      "pull_back_significantly",
      "respect_their_space",
      "focus_on_self_improvement",
      "explore_other_connections",
      "accept_possible_disinterest"
    ],
    avoid: [
      "chasing_harder",
      "guilt_tripping",
      "demanding_explanations",
      "emotional_outbursts"
    ]
  },

  // Early stage - just met or barely know each other
  EARLY_STAGE: {
    label: "early_stage",
    description: "Beginning phase, minimal interaction history",
    indicators: [
      "recently_met",
      "few_conversations",
      "limited_shared_context",
      "still_learning_about_each_other"
    ],
    risk_level: "medium",
    recommended_actions: [
      "build_rapport_slowly",
      "find_common_interests",
      "be_genuinely_curious",
      "show_authentic_self",
      "create_comfortable_interactions"
    ],
    avoid: [
      "oversharing_too_soon",
      "intense_declarations",
      "stalking_social_media",
      "forcing_connection"
    ]
  },

  // Friendship established, testing romantic interest
  FRIEND_ZONE_RISK: {
    label: "friend_zone_risk",
    description: "Strong friendship exists, but romantic signals unclear",
    indicators: [
      "close_friendship",
      "comfortable_together",
      "no_romantic_escalation",
      "talks_about_other_crushes"
    ],
    risk_level: "high",
    recommended_actions: [
      "create_subtle_romantic_context",
      "increase_light_flirting",
      "suggest_different_activity_types",
      "gauge_receptiveness_carefully",
      "be_prepared_for_friendship_outcome"
    ],
    avoid: [
      "sudden_confession",
      "dramatic_changes",
      "pressuring_for_clarity",
      "emotional_manipulation"
    ]
  },

  // Crush is in a relationship
  UNAVAILABLE: {
    label: "unavailable",
    description: "Crush is currently in a relationship with someone else",
    indicators: [
      "mentions_partner",
      "relationship_status_known",
      "talks_about_relationship"
    ],
    risk_level: "critical",
    recommended_actions: [
      "maintain_respectful_distance",
      "focus_elsewhere",
      "preserve_friendship_only",
      "avoid_romantic_pursuit",
      "work_on_moving_on"
    ],
    avoid: [
      "attempting_to_interfere",
      "waiting_for_breakup",
      "competing_with_partner",
      "inappropriate_advances"
    ]
  },

  // Post-rejection scenario
  POST_REJECTION: {
    label: "post_rejection",
    description: "Crush has indicated they're not interested romantically",
    indicators: [
      "explicit_rejection",
      "stated_lack_of_interest",
      "friend_zone_declaration"
    ],
    risk_level: "critical",
    recommended_actions: [
      "accept_gracefully",
      "take_space_to_heal",
      "focus_on_self_growth",
      "redirect_energy_elsewhere",
      "consider_friendship_later"
    ],
    avoid: [
      "trying_to_change_their_mind",
      "staying_in_painful_proximity",
      "bargaining_or_begging",
      "resentful_behavior"
    ]
  },

  // Progress made - dating or moving toward relationship
  PROGRESS_STAGE: {
    label: "progress_stage",
    description: "Clear mutual interest, moving toward relationship",
    indicators: [
      "regular_dates",
      "physical_affection",
      "explicit_interest",
      "future_planning_together",
      "introduced_to_friends"
    ],
    risk_level: "low",
    recommended_actions: [
      "continue_building_connection",
      "communicate_openly",
      "maintain_healthy_pace",
      "show_consistency",
      "discuss_expectations"
    ],
    avoid: [
      "becoming_complacent",
      "rushing_major_steps",
      "ignoring_red_flags",
      "losing_individual_identity"
    ]
  },

  // Confusion or overthinking phase
  ANALYSIS_PARALYSIS: {
    label: "analysis_paralysis",
    description: "User is overthinking and creating unnecessary mental stress",
    indicators: [
      "constant_second_guessing",
      "reading_too_much_into_details",
      "anxiety_about_small_things",
      "seeking_constant_validation"
    ],
    risk_level: "medium",
    recommended_actions: [
      "refocus_on_present_moment",
      "reduce_mental_rumination",
      "engage_in_other_activities",
      "practice_mindfulness",
      "trust_the_process"
    ],
    avoid: [
      "over_analyzing_every_interaction",
      "creating_imaginary_problems",
      "catastrophizing",
      "seeking_constant_reassurance"
    ]
  }
};

module.exports = { SCENARIOS };
