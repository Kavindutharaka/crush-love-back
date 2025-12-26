/**
 * CRUSH REASONING ENGINE
 * The core orchestrator that coordinates all agents and makes strategic decisions
 */

const llmRun = require('../controllers/geminiController');
const llmResponseConverter = require('../controllers/jsonController');
const { getCrushContext } = require('../controllers/kgController');
const { get_session_data } = require('../controllers/sessionController');

// Import agents
const conversation_collector = require('../prompts/agent/conversation');
const signal_detector = require('../prompts/agent/signaldetector');
const personality_analyzer = require('../prompts/agent/personalityanalyzer');
const scenario_analyzer = require('../prompts/agent/scenarioanalyzer');
const diagnoser_agent = require('../prompts/agent/diagnoseragent');
const strategy_planner = require('../prompts/agent/strategyplanner');

// Import blueprint system
const {
  SCENARIOS,
  PERSONALITY_TYPES,
  POSITIVE_SIGNALS,
  NEGATIVE_SIGNALS,
  matchScenario,
  identifyPersonality,
  getRecommendedActions,
  analyzeSignals
} = require('../blueprints');

// Import Cognitive Engine and Golden Crush Model
const CognitiveEngine = require('./cognitiveEngine');
const GoldenCrushModel = require('./goldenCrushModel');

class CrushReasoningEngine {
  constructor(userId, crushId = null) {
    this.userId = userId;
    this.crushId = crushId;
    this.kgContext = null;
    this.sessionContext = null;

    // Initialize Cognitive Engine and Golden Crush Model
    this.cognitiveEngine = new CognitiveEngine();
    this.goldenCrushModel = new GoldenCrushModel();
  }

  /**
   * Initialize engine with context data
   */
  async initialize() {
    try {
      // Load session context
      this.sessionContext = await get_session_data(this.userId);

      // Load knowledge graph context if crush ID is available
      if (this.crushId) {
        this.kgContext = await getCrushContext(this.crushId, this.userId);
      }

      console.log(' Crush Reasoning Engine initialized');
      return true;
    } catch (error) {
      console.error('L Engine initialization failed:', error);
      return false;
    }
  }

  /**
   * STEP 1: Gather missing information
   */
  async gatherInformation(userMessage) {
    try {
      const prompt = conversation_collector(userMessage);
      const response = await llmRun(prompt);
      const parsed = llmResponseConverter(response);

      return {
        missingFields: parsed.missing_fields || [],
        questions: parsed.questions || []
      };
    } catch (error) {
      console.error('L Information gathering failed:', error);
      return { missingFields: [], questions: [] };
    }
  }

  /**
   * STEP 2: Detect and analyze signals
   */
  async detectSignals(userReport) {
    try {
      const signalRules = { POSITIVE_SIGNALS, NEGATIVE_SIGNALS };
      const prompt = signal_detector(userReport, this.kgContext, signalRules);
      const response = await llmRun(prompt);
      const parsed = llmResponseConverter(response);

      // Also use blueprint analysis
      const blueprintAnalysis = analyzeSignals(
        parsed.detected_signals?.map(s => s.behavior) || []
      );

      return {
        ...parsed,
        blueprintAnalysis
      };
    } catch (error) {
      console.error('L Signal detection failed:', error);
      return null;
    }
  }

  /**
   * STEP 3: Analyze personality
   */
  async analyzePersonality(crushBehaviors) {
    try {
      const prompt = personality_analyzer(
        crushBehaviors,
        this.kgContext,
        PERSONALITY_TYPES
      );
      const response = await llmRun(prompt);
      const parsed = llmResponseConverter(response);

      // Cross-check with blueprint system
      const blueprintMatch = identifyPersonality(
        crushBehaviors.map(b => b.trait)
      );

      return {
        aiAnalysis: parsed,
        blueprintMatch
      };
    } catch (error) {
      console.error('L Personality analysis failed:', error);
      return null;
    }
  }

  /**
   * STEP 4: Classify scenario
   */
  async classifyScenario(userSituation) {
    try {
      const blueprintData = Object.values(SCENARIOS);
      const prompt = scenario_analyzer(
        userSituation,
        blueprintData,
        this.kgContext
      );
      const response = await llmRun(prompt);
      const parsed = llmResponseConverter(response);

      // Match with blueprint
      const blueprintMatch = matchScenario(
        parsed.scenario_label ? [parsed.scenario_label] : []
      );

      return {
        aiClassification: parsed,
        blueprintMatch,
        recommendedActions: getRecommendedActions(blueprintMatch.label)
      };
    } catch (error) {
      console.error('L Scenario classification failed:', error);
      return null;
    }
  }

  /**
   * STEP 5: Evaluate previous action (if any)
   */
  async evaluatePreviousAction(previousAction, userFeedback) {
    try {
      const prompt = diagnoser_agent(
        previousAction,
        userFeedback,
        this.kgContext
      );
      const response = await llmRun(prompt);
      const parsed = llmResponseConverter(response);

      return parsed;
    } catch (error) {
      console.error('L Evaluation failed:', error);
      return null;
    }
  }

  /**
   * STEP 6: Plan strategy and next step
   */
  async planStrategy(scenarioAnalysis, evaluatorOutput) {
    try {
      const prompt = strategy_planner(
        scenarioAnalysis,
        evaluatorOutput,
        this.kgContext
      );
      const response = await llmRun(prompt);
      const parsed = llmResponseConverter(response);

      return parsed;
    } catch (error) {
      console.error('L Strategy planning failed:', error);
      return null;
    }
  }

  /**
   * ORCHESTRATE: Full reasoning pipeline
   */
  async reason(userInput, options = {}) {
    const {
      previousAction = null,
      userFeedback = null,
      mode = 'full' // 'full' | 'quick' | 'evaluate'
    } = options;

    try {
      console.log('>� Starting Crush Reasoning Engine...');

      const result = {
        userId: this.userId,
        crushId: this.crushId,
        timestamp: new Date().toISOString(),
        steps: {}
      };

      // STEP 1: Check for missing info
      if (mode === 'full') {
        result.steps.informationGathering = await this.gatherInformation(userInput);

        if (result.steps.informationGathering.questions.length > 0) {
          // Need more info from user
          return {
            status: 'incomplete',
            questions: result.steps.informationGathering.questions,
            result
          };
        }
      }

      // STEP 2: Detect signals
      result.steps.signalDetection = await this.detectSignals(userInput);

      // STEP 3: Analyze personality (if enough data)
      if (this.kgContext && this.kgContext.behavioralPatterns.length > 0) {
        result.steps.personalityAnalysis = await this.analyzePersonality(
          this.kgContext.behavioralPatterns
        );
      }

      // STEP 4: Classify scenario
      result.steps.scenarioClassification = await this.classifyScenario(userInput);

      // STEP 5: Evaluate previous action (if exists)
      if (previousAction && userFeedback) {
        result.steps.evaluation = await this.evaluatePreviousAction(
          previousAction,
          userFeedback
        );
      }

      // STEP 6: Plan strategy
      result.steps.strategy = await this.planStrategy(
        result.steps.scenarioClassification,
        result.steps.evaluation || {}
      );

      // FINAL SYNTHESIS
      result.finalRecommendation = this.synthesizeRecommendation(result.steps);

      console.log(' Reasoning complete!');

      return {
        status: 'complete',
        result
      };
    } catch (error) {
      console.error('L Reasoning engine failed:', error);
      return {
        status: 'error',
        error: error.message
      };
    }
  }

  /**
   * COGNITIVE ANALYSIS MODE
   * Uses Cognitive Engine + Golden Crush Model for advanced decision-making
   * This is the "brain" that provides the formatted cognitive response
   *
   * @param {string} userMessage - User's question/situation
   * @param {Array} conversationHistory - Recent conversation messages
   * @returns {Object} Formatted cognitive analysis
   */
  async cognitiveAnalysis(userMessage, conversationHistory = []) {
    try {
      console.log('[CognitiveEngine] Starting cognitive analysis...');

      // PHASE 1: Golden Crush Model Analysis
      const goldenAnalysis = this.goldenCrushModel.analyze({
        userMessage,
        crushContext: this.kgContext || {},
        conversationHistory
      });

      // PHASE 2: Cognitive Engine Processing
      const cognitiveResult = await this.cognitiveEngine.analyze({
        userMessage,
        crushContext: this.kgContext || {},
        conversationHistory,
        relationshipStage: this.kgContext?.currentStage || null
      });

      // PHASE 3: Synthesize both analyses into final response
      const finalResponse = this.formatCognitiveResponse(
        goldenAnalysis,
        cognitiveResult,
        userMessage
      );

      console.log('[CognitiveEngine] Analysis complete');

      return {
        success: true,
        ...finalResponse
      };

    } catch (error) {
      console.error('[CognitiveEngine] Cognitive analysis failed:', error);
      return {
        success: false,
        error: error.message,
        fallback: 'Be authentic and genuine in your approach'
      };
    }
  }

  /**
   * Format the cognitive response in the user's requested format
   */
  formatCognitiveResponse(goldenAnalysis, cognitiveResult, userMessage) {
    if (!cognitiveResult.success) {
      return {
        error: 'Cognitive analysis failed',
        fallback: cognitiveResult.fallbackAdvice
      };
    }

    const analysis = cognitiveResult.analysis;

    // Build the formatted response
    return {
      // === GOLDEN CRUSH MODEL ANALYSIS ===
      goldenCrushAnalysis: {
        verdict: goldenAnalysis.onRightTrack.status,
        message: goldenAnalysis.onRightTrack.message,
        reasoning: goldenAnalysis.onRightTrack.reasoning,
        score: {
          goldenScore: goldenAnalysis.goldenScore,
          percentile: goldenAnalysis.percentile,
          interpretation: goldenAnalysis.interpretation.level
        },
        signals: {
          positive: goldenAnalysis.detectedPatterns.positive.map(p => p.pattern),
          negative: goldenAnalysis.detectedPatterns.negative.map(p => p.pattern),
          summary: goldenAnalysis.interpretation.message
        },
        feedback: goldenAnalysis.feedback,
        nextMilestone: goldenAnalysis.nextMilestone
      },

      // === COGNITIVE ENGINE DIAGNOSIS ===
      cognitiveDiagnosis: {
        targetProfile: {
          type: analysis.diagnosis.targetProfile.label,
          traits: analysis.diagnosis.targetProfile.traits,
          communicationStyle: analysis.diagnosis.targetProfile.communicationStyle,
          confidence: `${analysis.diagnosis.targetProfile.confidence}%`
        },
        currentState: analysis.diagnosis.emotionalState.label,
        replyMode: analysis.diagnosis.communicationMode.label,
        relationshipStage: analysis.diagnosis.relationshipStage.label,
        analysisReasoning: analysis.diagnosis.analysisReasoning,
        signals: {
          positive: analysis.signals.positive,
          negative: analysis.signals.negative,
          overallScore: `${Math.round(analysis.signals.overallScore)}%`,
          interpretation: analysis.signals.interpretation
        }
      },

      // === RED FLAGS WARNING ===
      redFlags: analysis.redFlags.hasRedFlags ? {
        severity: analysis.redFlags.severity,
        warnings: analysis.redFlags.flags,
        recommendation: analysis.redFlags.recommendation
      } : null,

      // === THE ARCHITECT'S STRATEGY ===
      strategy: {
        selectedTactics: analysis.strategy.selectedTactics.map(t => ({
          name: t.name,
          description: t.description,
          whenToUse: t.when_to_use,
          psychology: t.psychology
        })),
        strategicGoal: analysis.strategy.strategicGoal,
        psychologyExplained: analysis.strategy.psychologyBehind
      },

      // === EXECUTION (THE MOVE) ===
      execution: {
        theScript: analysis.execution.messageScript,
        alternatives: analysis.execution.alternatives,
        tone: analysis.execution.tone,
        timing: {
          when: analysis.execution.timing.when,
          duration: analysis.execution.timing.duration
        },
        behavioralGuide: analysis.execution.behavioralInstructions
      },

      // === PREDICTION ===
      prediction: {
        successIndicator: analysis.prediction.successIndicator,
        failState: analysis.prediction.failState,
        nextSteps: analysis.prediction.nextSteps,
        timeframe: analysis.prediction.timeframe
      },

      // === METADATA ===
      metadata: {
        confidenceLevel: `${analysis.metadata.confidenceLevel}%`,
        rulesVersion: analysis.metadata.rulesVersion,
        timestamp: analysis.metadata.timestamp
      }
    };
  }

  /**
   * Synthesize final recommendation from all steps
   */
  synthesizeRecommendation(steps) {
    const recommendation = {
      scenario: steps.scenarioClassification?.aiClassification?.scenario_label || 'unknown',
      riskLevel: steps.scenarioClassification?.blueprintMatch?.risk_level || 'medium',
      interestLevel: steps.signalDetection?.overall_assessment?.interpretation || 'unclear',
      confidence: steps.signalDetection?.overall_assessment?.confidence || 0.5,
      nextStep: steps.strategy?.plan_step || 'Gather more information',
      explanation: steps.strategy?.explanation || '',
      warnings: steps.strategy?.risk_notes || '',
      avoid: steps.scenarioClassification?.recommendedActions?.avoid || []
    };

    return recommendation;
  }
}

module.exports = CrushReasoningEngine;
