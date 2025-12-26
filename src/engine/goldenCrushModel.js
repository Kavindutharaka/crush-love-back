/**
 * GOLDEN CRUSH MODEL
 *
 * Pattern recognition system that identifies successful romantic patterns
 * and provides validation of whether the crush's behavior indicates positive interest
 *
 * This works alongside the Cognitive Engine to provide the "Golden Model Analysis"
 */

class GoldenCrushModel {
  constructor() {
    this.goldenPatterns = this.loadGoldenPatterns();
  }

  /**
   * Load the "golden patterns" - behaviors that indicate successful romantic interest
   */
  loadGoldenPatterns() {
    return {
      // TIER 1: Strongest positive indicators
      initiationPatterns: {
        weight: 10,
        patterns: [
          'initiates_conversation_frequently',
          'double_texts',
          'sends_good_morning_good_night',
          'reaches_out_without_reason',
          'shares_random_thoughts'
        ],
        interpretation: 'EXTREMELY POSITIVE - They are thinking about you'
      },

      deepEngagement: {
        weight: 9,
        patterns: [
          'asks_personal_questions',
          'remembers_small_details',
          'brings_up_past_conversations',
          'wants_to_know_your_opinion',
          'shares_personal_information'
        ],
        interpretation: 'VERY POSITIVE - They want to know you deeply'
      },

      futureOrientation: {
        weight: 9,
        patterns: [
          'makes_future_plans',
          'talks_about_doing_things_together',
          'includes_you_in_future_thinking',
          'says_we_should',
          'plans_ahead_with_you'
        ],
        interpretation: 'VERY POSITIVE - They see you in their future'
      },

      // TIER 2: Strong positive indicators
      consistentEffort: {
        weight: 8,
        patterns: [
          'responds_consistently',
          'maintains_conversation',
          'long_thoughtful_replies',
          'asks_questions_back',
          'keeps_conversation_going'
        ],
        interpretation: 'POSITIVE - They value talking to you'
      },

      emotionalSharing: {
        weight: 8,
        patterns: [
          'shares_feelings',
          'opens_up_about_problems',
          'seeks_your_support',
          'trusts_you_with_secrets',
          'vulnerable_with_you'
        ],
        interpretation: 'POSITIVE - They trust you emotionally'
      },

      physicalProximity: {
        weight: 7,
        patterns: [
          'finds_reasons_to_be_near_you',
          'sits_close',
          'casual_touching',
          'maintains_eye_contact',
          'faces_you_when_talking'
        ],
        interpretation: 'POSITIVE - Physical attraction present'
      },

      // TIER 3: Moderate positive indicators
      playfulEngagement: {
        weight: 6,
        patterns: [
          'teases_you_playfully',
          'laughs_at_your_jokes',
          'inside_jokes_developing',
          'playful_banter',
          'sends_memes_or_funny_content'
        ],
        interpretation: 'MODERATELY POSITIVE - Comfortable and enjoying interaction'
      },

      socialIntegration: {
        weight: 6,
        patterns: [
          'wants_you_to_meet_friends',
          'includes_you_in_group_activities',
          'talks_about_you_to_others',
          'wants_to_meet_your_friends',
          'integrates_you_socially'
        ],
        interpretation: 'MODERATELY POSITIVE - Wants you in their social world'
      },

      // MIXED SIGNALS (Lower weight, need context)
      responsiveness: {
        weight: 4,
        patterns: [
          'replies_within_reasonable_time',
          'doesnt_leave_you_on_read',
          'explains_delays',
          'apologizes_for_slow_response'
        ],
        interpretation: 'NEUTRAL TO POSITIVE - Basic respect and interest'
      },

      // RED FLAGS (Negative patterns)
      distanceSignals: {
        weight: -8,
        patterns: [
          'one_word_responses',
          'never_initiates',
          'takes_days_to_respond',
          'ignores_questions',
          'always_busy_excuse',
          'cancels_plans_frequently'
        ],
        interpretation: 'CONCERNING - Low interest or avoidance'
      },

      friendZoneIndicators: {
        weight: -6,
        patterns: [
          'talks_about_other_crushes',
          'asks_for_dating_advice',
          'explicitly_calls_you_friend',
          'sets_clear_boundaries',
          'treats_you_like_sibling'
        ],
        interpretation: 'NEGATIVE - Likely friend-zone'
      }
    };
  }

  /**
   * MAIN ANALYSIS METHOD
   * Analyzes a situation against the golden patterns
   *
   * @param {Object} input - Analysis input
   * @param {string} input.userMessage - What user is describing
   * @param {Object} input.crushContext - Crush information
   * @param {Array} input.conversationHistory - Message history
   * @returns {Object} Golden model analysis
   */
  analyze(input) {
    const { userMessage, crushContext, conversationHistory = [] } = input;

    // Extract patterns from the situation
    const detectedPatterns = this.detectPatterns(userMessage, conversationHistory);

    // Calculate golden score
    const score = this.calculateGoldenScore(detectedPatterns);

    // Generate interpretation
    const interpretation = this.interpretScore(score, detectedPatterns);

    // Determine if "on right track"
    const onRightTrack = this.assessTrack(score, detectedPatterns);

    // Generate specific feedback
    const feedback = this.generateFeedback(detectedPatterns, onRightTrack);

    return {
      goldenScore: score.total,
      maxPossibleScore: score.maxPossible,
      percentile: score.percentile,
      detectedPatterns: detectedPatterns,
      interpretation: interpretation,
      onRightTrack: onRightTrack,
      feedback: feedback,
      nextMilestone: this.getNextMilestone(score.total, detectedPatterns)
    };
  }

  /**
   * Detect which golden patterns are present in the situation
   */
  detectPatterns(userMessage, conversationHistory) {
    const detected = {
      positive: [],
      negative: [],
      neutral: []
    };

    const msgLower = userMessage.toLowerCase();

    // Check each pattern category
    for (const [categoryKey, categoryData] of Object.entries(this.goldenPatterns)) {
      categoryData.patterns.forEach(pattern => {
        const patternText = pattern.replace(/_/g, ' ');

        // Check if pattern exists in user message
        if (msgLower.includes(patternText)) {
          const detection = {
            category: categoryKey,
            pattern: pattern,
            weight: categoryData.weight,
            interpretation: categoryData.interpretation
          };

          if (categoryData.weight > 0) {
            detected.positive.push(detection);
          } else if (categoryData.weight < 0) {
            detected.negative.push(detection);
          } else {
            detected.neutral.push(detection);
          }
        }
      });

      // Additional contextual detection
      this.detectContextualPatterns(msgLower, categoryKey, categoryData, detected);
    }

    return detected;
  }

  /**
   * Detect patterns based on context (not just keywords)
   */
  detectContextualPatterns(msgLower, categoryKey, categoryData, detected) {
    // Initiation patterns
    if (categoryKey === 'initiationPatterns') {
      if (/(she texted me|she messaged|she sent|she reached out)/i.test(msgLower)) {
        detected.positive.push({
          category: categoryKey,
          pattern: 'initiates_conversation',
          weight: categoryData.weight,
          interpretation: categoryData.interpretation
        });
      }
    }

    // Deep engagement
    if (categoryKey === 'deepEngagement') {
      if (/(she asked about|she wanted to know|she remembered)/i.test(msgLower)) {
        detected.positive.push({
          category: categoryKey,
          pattern: 'shows_deep_interest',
          weight: categoryData.weight,
          interpretation: categoryData.interpretation
        });
      }
    }

    // Future orientation
    if (categoryKey === 'futureOrientation') {
      if (/(we should|let's|want to.*together|next time)/i.test(msgLower)) {
        detected.positive.push({
          category: categoryKey,
          pattern: 'future_oriented_language',
          weight: categoryData.weight,
          interpretation: categoryData.interpretation
        });
      }
    }

    // Distance signals (red flags)
    if (categoryKey === 'distanceSignals') {
      if (/(one word|short response|left on read|no reply)/i.test(msgLower)) {
        detected.negative.push({
          category: categoryKey,
          pattern: 'low_engagement_response',
          weight: categoryData.weight,
          interpretation: categoryData.interpretation
        });
      }
    }
  }

  /**
   * Calculate the golden score based on detected patterns
   */
  calculateGoldenScore(detectedPatterns) {
    let total = 0;
    const maxPossible = 50; // Theoretical maximum from top-tier patterns

    // Add positive patterns
    detectedPatterns.positive.forEach(p => {
      total += p.weight;
    });

    // Subtract negative patterns
    detectedPatterns.negative.forEach(p => {
      total += p.weight; // Already negative
    });

    // Calculate percentile (0-100)
    const percentile = Math.max(0, Math.min(100, ((total + 10) / (maxPossible + 10)) * 100));

    return {
      total: total,
      maxPossible: maxPossible,
      percentile: Math.round(percentile)
    };
  }

  /**
   * Interpret the score into actionable insight
   */
  interpretScore(score, detectedPatterns) {
    const percentile = score.percentile;

    if (percentile >= 80) {
      return {
        level: 'EXCEPTIONAL',
        message: 'This is outstanding! They are showing very strong interest signals.',
        confidence: 'Very High',
        action: 'Continue current approach and consider moving relationship forward'
      };
    } else if (percentile >= 60) {
      return {
        level: 'VERY POSITIVE',
        message: 'Things are going well. Multiple positive indicators present.',
        confidence: 'High',
        action: 'Build on this momentum with consistent engagement'
      };
    } else if (percentile >= 40) {
      return {
        level: 'MODERATELY POSITIVE',
        message: 'Some positive signs, but not clear-cut yet.',
        confidence: 'Moderate',
        action: 'Continue building rapport and look for clearer signals'
      };
    } else if (percentile >= 25) {
      return {
        level: 'UNCLEAR',
        message: 'Mixed signals present. Need more information.',
        confidence: 'Low',
        action: 'Be patient and observe patterns over time'
      };
    } else {
      return {
        level: 'CONCERNING',
        message: 'Interest signals are weak or negative patterns are present.',
        confidence: 'High',
        action: 'Consider if pursuing this is the best path forward'
      };
    }
  }

  /**
   * Determine if user is "on the right track"
   */
  assessTrack(score, detectedPatterns) {
    const hasStrongPositive = detectedPatterns.positive.some(p => p.weight >= 8);
    const hasNegative = detectedPatterns.negative.length > 0;
    const percentile = score.percentile;

    if (percentile >= 60 && !hasNegative) {
      return {
        status: true,
        message: 'YES - You are on the right track!',
        reasoning: 'Multiple strong positive signals detected with no red flags'
      };
    } else if (percentile >= 40 && hasStrongPositive) {
      return {
        status: true,
        message: 'YES - Generally on the right track',
        reasoning: 'Strong positive indicators present, keep building momentum'
      };
    } else if (hasNegative && percentile < 40) {
      return {
        status: false,
        message: 'NOT YET - Need to reassess approach',
        reasoning: 'Negative patterns detected, interest may be low'
      };
    } else {
      return {
        status: 'uncertain',
        message: 'UNCLEAR - More data needed',
        reasoning: 'Signals are mixed, continue building connection and observe'
      };
    }
  }

  /**
   * Generate specific feedback based on patterns
   */
  generateFeedback(detectedPatterns, onRightTrack) {
    const feedback = {
      strengths: [],
      concerns: [],
      recommendations: []
    };

    // Identify strengths
    detectedPatterns.positive.forEach(p => {
      feedback.strengths.push(`${p.pattern.replace(/_/g, ' ')} - ${p.interpretation}`);
    });

    // Identify concerns
    detectedPatterns.negative.forEach(p => {
      feedback.concerns.push(`${p.pattern.replace(/_/g, ' ')} - ${p.interpretation}`);
    });

    // Generate recommendations
    if (onRightTrack.status === true) {
      feedback.recommendations.push('Maintain current approach - it is working');
      feedback.recommendations.push('Look for opportunities to deepen connection');
      feedback.recommendations.push('Be consistent and authentic in your interactions');
    } else if (onRightTrack.status === false) {
      feedback.recommendations.push('Give them space and reassess their interest level');
      feedback.recommendations.push('Do not push harder - focus on building friendship first');
      feedback.recommendations.push('Be prepared that romantic interest may not be mutual');
    } else {
      feedback.recommendations.push('Continue current pace without rushing');
      feedback.recommendations.push('Look for clearer signals over the next 2-3 interactions');
      feedback.recommendations.push('Be patient and let connection develop naturally');
    }

    return feedback;
  }

  /**
   * Get the next milestone to aim for
   */
  getNextMilestone(score, detectedPatterns) {
    if (score < 10) {
      return 'First goal: Get consistent responses and basic conversation flow';
    } else if (score < 20) {
      return 'Next milestone: Build rapport through shared interests and regular interaction';
    } else if (score < 35) {
      return 'Next milestone: Achieve initiation from their side or deeper personal sharing';
    } else if (score < 50) {
      return 'Next milestone: Create opportunities for one-on-one time and future plans';
    } else {
      return 'Next milestone: Express romantic interest or move toward dating';
    }
  }
}

module.exports = GoldenCrushModel;
