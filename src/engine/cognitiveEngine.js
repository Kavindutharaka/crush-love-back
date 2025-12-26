/**
 * COGNITIVE ENGINE - The Decision-Making Brain of MALSARA69
 *
 * This engine analyzes crush behavior patterns and provides strategic advice
 * based on psychological principles loaded from psychologyRules.json
 *
 * Flow: User Input → Profile Detection → State Analysis → Strategic Selection → Response Generation
 */

const fs = require('fs');
const path = require('path');

class CognitiveEngine {
  constructor() {
    this.rules = null;
    this.loadPsychologyRules();
  }

  /**
   * Load psychology rules from JSON configuration
   */
  loadPsychologyRules() {
    try {
      const rulesPath = path.join(__dirname, '../config/psychologyRules.json');
      const rulesData = fs.readFileSync(rulesPath, 'utf8');
      this.rules = JSON.parse(rulesData);
      console.log('[CognitiveEngine] Psychology rules loaded successfully');
    } catch (error) {
      console.error('[CognitiveEngine] Failed to load psychology rules:', error);
      throw new Error('Cannot initialize Cognitive Engine without psychology rules');
    }
  }

  /**
   * Reload rules from JSON (allows hot-reloading of configuration)
   */
  reloadRules() {
    this.loadPsychologyRules();
    return { success: true, message: 'Psychology rules reloaded' };
  }

  /**
   * MAIN PROCESSING METHOD
   * Analyzes the situation and generates strategic advice
   *
   * @param {Object} input - User input and context
   * @param {string} input.userMessage - What the user is asking/reporting
   * @param {Object} input.crushContext - Information about the crush from KG
   * @param {Object} input.conversationHistory - Recent messages
   * @param {string} input.relationshipStage - Current stage (optional, will auto-detect)
   * @returns {Object} Complete cognitive analysis with strategy
   */
  async analyze(input) {
    try {
      const {
        userMessage,
        crushContext = {},
        conversationHistory = [],
        relationshipStage = null
      } = input;

      // STEP 1: Profile Detection
      const detectedProfile = this.detectProfile(crushContext, conversationHistory);

      // STEP 2: Emotional State Detection
      const emotionalState = this.detectEmotionalState(userMessage, conversationHistory, crushContext);

      // STEP 3: Communication Mode Analysis
      const communicationMode = this.detectCommunicationMode(conversationHistory);

      // STEP 4: Relationship Stage Detection
      const stage = relationshipStage || this.detectRelationshipStage(crushContext, conversationHistory);

      // STEP 5: Signal Analysis (positive, neutral, negative)
      const signals = this.analyzeSignals(userMessage, conversationHistory, crushContext);

      // STEP 6: Red Flag Check
      const redFlags = this.checkRedFlags(crushContext, conversationHistory, signals);

      // STEP 7: Strategic Tactic Selection
      const selectedTactics = this.selectTactics(detectedProfile, emotionalState, stage, signals);

      // STEP 8: Generate Response Strategy
      const responseStrategy = this.generateResponseStrategy(
        userMessage,
        detectedProfile,
        emotionalState,
        communicationMode,
        selectedTactics,
        signals
      );

      // STEP 9: Create Behavioral Guidelines
      const behavioralGuide = this.createBehavioralGuide(
        detectedProfile,
        emotionalState,
        communicationMode,
        selectedTactics
      );

      // STEP 10: Predict Outcomes
      const prediction = this.predictOutcomes(signals, selectedTactics, stage);

      // Return complete analysis
      return {
        success: true,
        analysis: {
          // === COGNITIVE DIAGNOSIS ===
          diagnosis: {
            targetProfile: detectedProfile,
            emotionalState: emotionalState,
            communicationMode: communicationMode,
            relationshipStage: stage,
            analysisReasoning: this.generateAnalysisReasoning(
              detectedProfile,
              emotionalState,
              signals,
              userMessage
            )
          },

          // === SIGNAL ANALYSIS ===
          signals: {
            positive: signals.positive,
            neutral: signals.neutral,
            negative: signals.negative,
            overallScore: signals.score,
            interpretation: signals.interpretation
          },

          // === RED FLAGS ===
          redFlags: redFlags,

          // === THE STRATEGY ===
          strategy: {
            selectedTactics: selectedTactics,
            strategicGoal: this.getStrategicGoal(stage, signals, selectedTactics),
            psychologyBehind: this.explainPsychology(selectedTactics)
          },

          // === EXECUTION (The Move) ===
          execution: {
            messageScript: responseStrategy.script,
            alternatives: responseStrategy.alternatives || [],
            tone: responseStrategy.tone,
            timing: behavioralGuide.timing,
            behavioralInstructions: behavioralGuide.instructions
          },

          // === PREDICTION ===
          prediction: prediction,

          // === METADATA ===
          metadata: {
            rulesVersion: this.rules.version,
            timestamp: new Date().toISOString(),
            confidenceLevel: this.calculateConfidence(signals, detectedProfile, emotionalState)
          }
        }
      };

    } catch (error) {
      console.error('[CognitiveEngine] Analysis failed:', error);
      return {
        success: false,
        error: error.message,
        fallbackAdvice: 'Be genuine, respectful, and authentic in your communication.'
      };
    }
  }

  /**
   * PROFILE DETECTION
   * Matches crush behavior to personality profiles from psychologyRules.json
   */
  detectProfile(crushContext, conversationHistory) {
    const profiles = this.rules.profileTypes;
    const scores = {};

    // Score each profile based on indicators
    for (const [profileKey, profileData] of Object.entries(profiles)) {
      let score = 0;
      const indicators = profileData.indicators;

      // Check crush context for indicators
      if (crushContext.personality) {
        if (crushContext.personality.toLowerCase().includes(profileKey)) {
          score += 10;
        }
      }

      // Check conversation history for behavioral indicators
      conversationHistory.forEach(msg => {
        const msgText = (msg.message || '').toLowerCase();

        indicators.forEach(indicator => {
          const indicatorPattern = indicator.replace(/_/g, ' ');
          if (msgText.includes(indicatorPattern)) {
            score += 1;
          }
        });

        // Check message characteristics
        if (profileKey === 'extravert' && msg.message && msg.message.length > 100) score += 1;
        if (profileKey === 'introvert' && msg.message && msg.message.length > 200) score += 2;
        if (profileKey === 'emotional' && /[😢😭😊😍🥺💕]/.test(msg.message)) score += 2;
        if (profileKey === 'logical' && msg.message && msg.message.length < 50) score += 1;
        if (profileKey === 'playful' && /[😂🤣😄😎]/.test(msg.message)) score += 2;
      });

      scores[profileKey] = score;
    }

    // Find highest scoring profile
    const topProfile = Object.entries(scores).reduce((a, b) => b[1] > a[1] ? b : a);
    const profileKey = topProfile[0];
    const profileData = profiles[profileKey];

    return {
      type: profileKey,
      label: profileData.label,
      traits: profileData.traits,
      communicationStyle: profileData.communicationStyle,
      preferredApproach: profileData.preferredApproach,
      avoidances: profileData.avoidances,
      confidence: Math.min(topProfile[1] * 10, 100) // Convert to percentage
    };
  }

  /**
   * EMOTIONAL STATE DETECTION
   * Determines current emotional state from recent context
   */
  detectEmotionalState(userMessage, conversationHistory, crushContext) {
    const states = this.rules.emotionalStates;
    let detectedState = 'neutral';
    let maxScore = 0;

    // Analyze the most recent message from crush
    const recentMessages = conversationHistory.slice(-3);
    const lastCrushMessage = recentMessages.reverse().find(msg => msg.sender === 'crush');

    if (lastCrushMessage) {
      const msgText = lastCrushMessage.message.toLowerCase();

      // Check each emotional state
      for (const [stateKey, stateData] of Object.entries(states)) {
        let score = 0;

        stateData.indicators.forEach(indicator => {
          const pattern = indicator.replace(/_/g, ' ');
          if (msgText.includes(pattern)) score += 2;
        });

        // Check for emotional emojis
        if (stateKey === 'happy' && /[😊😄😃🙂☺️]/.test(msgText)) score += 3;
        if (stateKey === 'sad' && /[😢😭🥺😞]/.test(msgText)) score += 3;
        if (stateKey === 'excited' && /[😍🥰✨🎉!]{2,}/.test(msgText)) score += 3;
        if (stateKey === 'stressed' && /(busy|stress|tired|exam|work)/.test(msgText)) score += 2;

        if (score > maxScore) {
          maxScore = score;
          detectedState = stateKey;
        }
      }
    }

    // Also check user's description of the situation
    const userMsgLower = userMessage.toLowerCase();
    if (/(she seems happy|she's excited|good mood)/.test(userMsgLower)) detectedState = 'happy';
    if (/(she seems sad|she's down|upset)/.test(userMsgLower)) detectedState = 'sad';
    if (/(she's busy|stressed|overwhelmed)/.test(userMsgLower)) detectedState = 'stressed';

    const stateData = states[detectedState];
    return {
      current: detectedState,
      label: stateData.label,
      suggestedActions: stateData.suggestedActions,
      responseStyle: stateData.responseStyle,
      avoid: stateData.avoid || []
    };
  }

  /**
   * COMMUNICATION MODE DETECTION
   * Analyzes reply patterns and messaging behavior
   */
  detectCommunicationMode(conversationHistory) {
    const modes = this.rules.communicationModes;

    if (conversationHistory.length < 2) {
      return {
        mode: 'neutral',
        ...modes.consistent
      };
    }

    const crushMessages = conversationHistory.filter(msg => msg.sender === 'crush');

    // Calculate average response time and length
    let avgLength = 0;
    let initiationCount = 0;
    let seenNoReply = false;

    crushMessages.forEach((msg, idx) => {
      avgLength += (msg.message || '').length;
      if (msg.isInitiation) initiationCount++;
    });

    avgLength = avgLength / crushMessages.length;

    // Detect mode based on patterns
    let detectedMode = 'consistent';

    if (avgLength < 30) {
      detectedMode = 'fast_short';
    } else if (avgLength > 100) {
      detectedMode = 'slow_long';
    }

    if (initiationCount > crushMessages.length * 0.3) {
      detectedMode = 'initiates';
    }

    // Check for seen but no reply (would need to be passed in context)
    // For now, default to detected mode

    return {
      mode: detectedMode,
      ...modes[detectedMode]
    };
  }

  /**
   * RELATIONSHIP STAGE DETECTION
   * Determines current stage of relationship
   */
  detectRelationshipStage(crushContext, conversationHistory) {
    const stages = this.rules.relationshipStages;

    // Use crushContext.currentStage if available
    if (crushContext.currentStage) {
      const stageKey = crushContext.currentStage;
      if (stages[stageKey]) {
        return {
          stage: stageKey,
          ...stages[stageKey]
        };
      }
    }

    // Otherwise, infer from conversation patterns
    const messageCount = conversationHistory.length;
    const crushMessages = conversationHistory.filter(msg => msg.sender === 'crush');
    const initiationCount = crushMessages.filter(msg => msg.isInitiation).length;

    let inferredStage = 'stranger';

    if (messageCount > 50 && initiationCount > 10) inferredStage = 'close_friend';
    else if (messageCount > 20 && initiationCount > 5) inferredStage = 'friendly';
    else if (messageCount > 5) inferredStage = 'acquaintance';

    return {
      stage: inferredStage,
      ...stages[inferredStage]
    };
  }

  /**
   * SIGNAL ANALYSIS
   * Analyzes positive, neutral, and negative signals
   */
  analyzeSignals(userMessage, conversationHistory, crushContext) {
    const signalDefs = this.rules.successIndicators;

    const detected = {
      positive: [],
      neutral: [],
      negative: []
    };

    const msgLower = userMessage.toLowerCase();

    // Check for positive signals
    signalDefs.positive_signals.forEach(signal => {
      const pattern = signal.replace(/_/g, ' ');
      if (msgLower.includes(pattern)) {
        detected.positive.push(signal);
      }
    });

    // Specific pattern checks
    if (/(she texted me|she messaged|she sent|she asked)/i.test(userMessage)) {
      detected.positive.push('initiates_conversations');
    }
    if (/(remembered|asked about me|how are you)/i.test(userMessage)) {
      detected.positive.push('shows_interest');
    }

    // Check for negative signals
    signalDefs.negative_signals.forEach(signal => {
      const pattern = signal.replace(/_/g, ' ');
      if (msgLower.includes(pattern)) {
        detected.negative.push(signal);
      }
    });

    // Check for neutral signals
    signalDefs.neutral_signals.forEach(signal => {
      const pattern = signal.replace(/_/g, ' ');
      if (msgLower.includes(pattern)) {
        detected.neutral.push(signal);
      }
    });

    // Calculate overall score
    const score = (detected.positive.length * 2) - (detected.negative.length * 2);
    const maxScore = 10;
    const normalizedScore = Math.max(0, Math.min(100, ((score + maxScore) / (maxScore * 2)) * 100));

    let interpretation = 'neutral';
    if (normalizedScore > 70) interpretation = 'very_positive';
    else if (normalizedScore > 55) interpretation = 'positive';
    else if (normalizedScore < 30) interpretation = 'concerning';
    else if (normalizedScore < 45) interpretation = 'unclear';

    return {
      positive: detected.positive,
      neutral: detected.neutral,
      negative: detected.negative,
      score: normalizedScore,
      interpretation: interpretation
    };
  }

  /**
   * RED FLAG CHECKER
   * Identifies warning signs
   */
  checkRedFlags(crushContext, conversationHistory, signals) {
    const flagDefs = this.rules.redFlags;
    const detected = {
      yourBehavior: [],
      theirBehavior: [],
      situationWarnings: []
    };

    // Check for concerning patterns in signals
    if (signals.negative.includes('never_initiates')) {
      detected.theirBehavior.push('never_initiates');
    }
    if (signals.negative.includes('one_word_answers')) {
      detected.theirBehavior.push('consistently_disrespectful');
    }

    // Check crush context for warnings
    if (crushContext.relationshipStatus === 'in_relationship') {
      detected.situationWarnings.push('they_are_in_relationship');
    }

    const hasRedFlags = detected.yourBehavior.length > 0 ||
                        detected.theirBehavior.length > 0 ||
                        detected.situationWarnings.length > 0;

    return {
      hasRedFlags: hasRedFlags,
      flags: detected,
      severity: hasRedFlags ? (detected.situationWarnings.length > 0 ? 'high' : 'medium') : 'none',
      recommendation: hasRedFlags ? 'Proceed with caution or reconsider pursuing this' : 'Clear to proceed'
    };
  }

  /**
   * TACTIC SELECTION
   * Selects appropriate psychological tactics from the rules
   */
  selectTactics(profile, emotionalState, stage, signals) {
    const tactics = this.rules.strategicTactics;
    const selected = [];

    // Always include active listening
    selected.push(tactics.active_listening);

    // Select based on emotional state
    if (emotionalState.current === 'sad' || emotionalState.current === 'stressed') {
      selected.push(tactics.validation);
      selected.push(tactics.empowerment);
    }

    // Select based on profile
    if (profile.type === 'confident') {
      selected.push(tactics.respectful_challenge);
      selected.push(tactics.healthy_scarcity);
    }
    if (profile.type === 'emotional') {
      selected.push(tactics.vulnerability);
      selected.push(tactics.validation);
    }
    if (profile.type === 'playful') {
      selected.push(tactics.positive_association);
    }
    if (profile.type === 'logical') {
      selected.push(tactics.respectful_challenge);
    }

    // Select based on stage
    if (stage.stage === 'friendly' || stage.stage === 'close_friend') {
      selected.push(tactics.shared_identity);
      selected.push(tactics.vulnerability);
    }

    // Select based on signals
    if (signals.interpretation === 'very_positive') {
      selected.push(tactics.positive_association);
    }

    // Always include mirroring and space respect
    selected.push(tactics.mirroring);
    if (emotionalState.current === 'stressed') {
      selected.push(tactics.space_respect);
    }

    // Remove duplicates
    const uniqueTactics = Array.from(new Map(selected.map(t => [t.name, t])).values());

    return uniqueTactics.slice(0, 4); // Return top 4 tactics
  }

  /**
   * RESPONSE STRATEGY GENERATION
   * Creates the actual message script and alternatives
   */
  generateResponseStrategy(userMessage, profile, emotionalState, communicationMode, tactics, signals) {
    const guidelines = this.rules.responseGuidelines;

    // Extract what the crush said from user message
    const crushMessage = this.extractCrushMessage(userMessage);

    // Determine tone
    let tone = 'balanced';
    if (profile.type === 'playful' && emotionalState.current === 'happy') tone = 'playful';
    if (emotionalState.current === 'sad' || emotionalState.current === 'stressed') tone = 'supportive';
    if (profile.type === 'logical') tone = 'intellectual';

    // Generate main script
    const script = this.craftMessage(crushMessage, profile, emotionalState, tone, tactics, signals);

    // Generate alternatives
    const alternatives = [
      this.craftMessage(crushMessage, profile, emotionalState, tone, tactics, signals, 'variation1'),
      this.craftMessage(crushMessage, profile, emotionalState, tone, tactics, signals, 'variation2')
    ];

    return {
      script: script,
      alternatives: alternatives,
      tone: tone
    };
  }

  /**
   * CRAFT ACTUAL MESSAGE
   * Creates the specific text to send
   */
  craftMessage(crushMessage, profile, emotionalState, tone, tactics, signals, variation = 'main') {
    // This is a template-based system - you can make it more sophisticated

    // Handle common scenarios
    if (/how are you/i.test(crushMessage)) {
      if (tone === 'playful') {
        return variation === 'main'
          ? "I'm doing great! How about you? 😊"
          : "Pretty good! What about you?";
      }
      if (tone === 'supportive') {
        return "I'm doing well, thanks for asking! How are you holding up?";
      }
      return variation === 'main'
        ? "I'm good! How are you doing?"
        : "Doing well! How about you?";
    }

    // Handle if crush initiated conversation
    if (signals.positive.includes('initiates_conversations')) {
      if (tone === 'playful') {
        return "Hey! Good to hear from you 😊 What's up?";
      }
      return "Hey! What's going on?";
    }

    // Default responses based on emotional state
    if (emotionalState.current === 'sad') {
      return "I'm here if you want to talk about it. No pressure though.";
    }

    if (emotionalState.current === 'stressed') {
      return "I know you're busy, so no rush on replying. Good luck with everything!";
    }

    // Generic fallback
    return "That's interesting! Tell me more about that.";
  }

  /**
   * Extract what the crush said from user's message
   */
  extractCrushMessage(userMessage) {
    // Simple extraction - look for quotes or "she said" patterns
    const quotedMatch = userMessage.match(/"([^"]+)"/);
    if (quotedMatch) return quotedMatch[1];

    const sheSaidMatch = userMessage.match(/she (?:said|texted|sent|asked)[:\s]+([^.!?]+)/i);
    if (sheSaidMatch) return sheSaidMatch[1];

    return userMessage; // Fallback to full message
  }

  /**
   * CREATE BEHAVIORAL GUIDE
   * Specific instructions on how to send the message
   */
  createBehavioralGuide(profile, emotionalState, communicationMode, tactics) {
    const guidelines = this.rules.responseGuidelines;
    const instructions = [];

    // Timing guidance
    let timing = guidelines.timing.moderate_reply;
    if (emotionalState.current === 'stressed') {
      timing = guidelines.timing.delayed_reply;
      instructions.push('Give them space - wait before replying');
    } else if (emotionalState.current === 'excited' || emotionalState.current === 'happy') {
      timing = guidelines.timing.fast_reply;
      instructions.push('Reply relatively quickly to match their energy');
    }

    // Message length guidance
    if (communicationMode.mode === 'fast_short') {
      instructions.push('Keep message short (1-2 sentences)');
    } else if (communicationMode.mode === 'slow_long') {
      instructions.push('Match their message length - take time to craft a thoughtful reply');
    }

    // Emoji guidance
    if (profile.type === 'emotional' || profile.type === 'playful') {
      instructions.push('Emojis are okay, but use sparingly');
    } else if (profile.type === 'logical') {
      instructions.push('Minimal or no emojis');
    }

    // Tactic-specific instructions
    tactics.forEach(tactic => {
      if (tactic.name === 'Space Respect') {
        instructions.push('Do not double-text or push for immediate response');
      }
      if (tactic.name === 'Mirroring') {
        instructions.push('Match their communication style and energy level');
      }
    });

    return {
      timing: timing,
      instructions: instructions
    };
  }

  /**
   * PREDICT OUTCOMES
   * What to expect from this strategy
   */
  predictOutcomes(signals, tactics, stage) {
    let successIndicator = '';
    let failState = '';

    if (signals.interpretation === 'very_positive') {
      successIndicator = 'They reply enthusiastically, continue the conversation, or make plans';
      failState = 'Sudden one-word reply or long delay (unlikely given current signals)';
    } else if (signals.interpretation === 'positive') {
      successIndicator = 'Positive reply, asks questions back, maintains conversation';
      failState = 'Short/delayed response or topic change';
    } else {
      successIndicator = 'Any engaged response or continued conversation';
      failState = 'No reply or very minimal engagement';
    }

    return {
      successIndicator: successIndicator,
      failState: failState,
      nextSteps: this.getNextSteps(stage, signals),
      timeframe: '24-48 hours for response evaluation'
    };
  }

  /**
   * Helper: Get next steps based on stage
   */
  getNextSteps(stage, signals) {
    if (stage.stage === 'acquaintance' && signals.interpretation === 'positive') {
      return 'If they respond well, increase interaction frequency and look for opportunities to connect';
    }
    if (stage.stage === 'friendly' && signals.interpretation === 'very_positive') {
      return 'Consider moving toward deeper conversations and one-on-one time';
    }
    return 'Continue building connection at current pace';
  }

  /**
   * Helper: Generate analysis reasoning
   */
  generateAnalysisReasoning(profile, emotionalState, signals, userMessage) {
    const reasons = [];

    reasons.push(`Profile detected as ${profile.label} based on ${profile.confidence}% confidence match`);
    reasons.push(`Current emotional state appears to be ${emotionalState.label}`);
    reasons.push(`Signals are ${signals.interpretation} (${signals.positive.length} positive, ${signals.negative.length} negative)`);

    return reasons.join('. ');
  }

  /**
   * Helper: Get strategic goal
   */
  getStrategicGoal(stage, signals, tactics) {
    if (signals.interpretation === 'very_positive') {
      return 'Maintain momentum and deepen connection';
    }
    if (signals.interpretation === 'concerning') {
      return 'Re-establish positive rapport and gauge genuine interest';
    }
    return `Progress from ${stage.label} to next relationship stage`;
  }

  /**
   * Helper: Explain psychology behind tactics
   */
  explainPsychology(tactics) {
    return tactics.map(t => `${t.name}: ${t.psychology}`).join('; ');
  }

  /**
   * Helper: Calculate confidence level
   */
  calculateConfidence(signals, profile, emotionalState) {
    let confidence = 50; // Base confidence

    // Increase based on clear signals
    if (signals.positive.length > 2) confidence += 20;
    if (signals.negative.length > 2) confidence -= 10;

    // Increase based on profile detection confidence
    confidence += (profile.confidence / 10);

    return Math.min(95, Math.max(30, confidence));
  }
}

module.exports = CognitiveEngine;
