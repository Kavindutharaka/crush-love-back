const express = require('express');
const router = express.Router();
const CrushReasoningEngine = require('../engine/crushReasoningEngine');
const memory_agent = require('../controllers/agentController');
const { getCrushContext } = require('../controllers/kgController');
const {
  createUser,
  getUser,
  updateUser,
  createCrush,
  getCrushProfile,
  getUserCrushes,
  updateCrush,
  deleteCrush
} = require('../controllers/userController');
const {
  validateAnalyzeRequest,
  validateEvaluateRequest,
  validateCrushId,
  sanitizeInput,
  rateLimiter
} = require('../middleware/validation');

// Apply rate limiting and input sanitization to all routes
router.use(rateLimiter);
router.use(sanitizeInput);

/**
 * ======================
 * USER MANAGEMENT ROUTES
 * ======================
 */

/**
 * POST /api/users
 * Create a new user
 */
router.post('/users', createUser);

/**
 * GET /api/users/:userId
 * Get user by userId
 */
router.get('/users/:userId', getUser);

/**
 * PUT /api/users/:userId
 * Update user profile
 */
router.put('/users/:userId', updateUser);

/**
 * =======================
 * CRUSH MANAGEMENT ROUTES
 * =======================
 */

/**
 * POST /api/crushes
 * Create a new crush profile
 */
router.post('/crushes', createCrush);

/**
 * GET /api/crushes/:crushId
 * Get crush profile by crushId
 */
router.get('/crushes/:crushId', getCrushProfile);

/**
 * GET /api/users/:userId/crushes
 * Get all crushes for a user
 */
router.get('/users/:userId/crushes', getUserCrushes);

/**
 * PUT /api/crushes/:crushId
 * Update crush profile
 */
router.put('/crushes/:crushId', updateCrush);

/**
 * DELETE /api/crushes/:crushId
 * Delete crush profile
 */
router.delete('/crushes/:crushId', deleteCrush);

/**
 * ========================
 * AI ANALYSIS ROUTES
 * ========================
 */

/**
 * POST /api/analyze
 * Main endpoint - Analyze a crush situation and get recommendations
 */
router.post('/analyze', validateAnalyzeRequest, async (req, res) => {
  try {
    const { userId, crushId, message, previousAction, feedback } = req.body;

    if (!userId || !message) {
      return res.status(400).json({
        error: 'Missing required fields: userId, message'
      });
    }

    // Initialize reasoning engine
    const engine = new CrushReasoningEngine(userId, crushId);
    await engine.initialize();

    // Run reasoning
    const result = await engine.reason(message, {
      previousAction,
      userFeedback: feedback,
      mode: 'full'
    });

    // Save to memory system
    if (result.status === 'complete') {
      await memory_agent(message);
    }

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('❌ API Error:', error);
    res.status(500).json({
      error: 'Analysis failed',
      message: error.message
    });
  }
});

/**
 * POST /api/quick-advice
 * Quick advice without full analysis pipeline
 */
router.post('/quick-advice', async (req, res) => {
  try {
    const { userId, crushId, message } = req.body;

    const engine = new CrushReasoningEngine(userId, crushId);
    await engine.initialize();

    const result = await engine.reason(message, { mode: 'quick' });

    res.json({
      success: true,
      advice: result.result?.finalRecommendation
    });
  } catch (error) {
    res.status(500).json({
      error: 'Quick advice failed',
      message: error.message
    });
  }
});

/**
 * POST /api/cognitive-analysis
 * COGNITIVE ENGINE - The Brain of MALSARA69
 * Provides complete analysis using Golden Crush Model + Cognitive Engine
 *
 * This is the primary endpoint for getting formatted cognitive analysis
 * Returns: Golden Crush verdict + Cognitive diagnosis + Strategy + Execution script
 */
router.post('/cognitive-analysis', async (req, res) => {
  try {
    const { userId, crushId, message, conversationHistory } = req.body;

    if (!userId || !message) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['userId', 'message'],
        optional: ['crushId', 'conversationHistory']
      });
    }

    // Initialize reasoning engine with cognitive capabilities
    const engine = new CrushReasoningEngine(userId, crushId);
    await engine.initialize();

    // Run cognitive analysis (Golden Crush Model + Cognitive Engine)
    const result = await engine.cognitiveAnalysis(
      message,
      conversationHistory || []
    );

    // Save to memory system if successful
    if (result.success) {
      await memory_agent(message);
    }

    res.json(result);

  } catch (error) {
    console.error('❌ Cognitive Analysis Error:', error);
    res.status(500).json({
      success: false,
      error: 'Cognitive analysis failed',
      message: error.message,
      fallback: 'Be authentic and genuine in your communication'
    });
  }
});

/**
 * GET /api/crush/:crushId
 * Get comprehensive information about a crush
 */
router.get('/crush/:crushId', validateCrushId, async (req, res) => {
  try {
    const { crushId } = req.params;
    const { userId } = req.query;

    const context = await getCrushContext(crushId, userId);

    res.json({
      success: true,
      crush: context
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve crush info',
      message: error.message
    });
  }
});

/**
 * POST /api/evaluate
 * Evaluate how a previous action went
 */
router.post('/evaluate', validateEvaluateRequest, async (req, res) => {
  try {
    const { userId, crushId, action, feedback } = req.body;

    if (!userId || !action || !feedback) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }

    const engine = new CrushReasoningEngine(userId, crushId);
    await engine.initialize();

    const evaluation = await engine.evaluatePreviousAction(action, feedback);

    res.json({
      success: true,
      evaluation
    });
  } catch (error) {
    res.status(500).json({
      error: 'Evaluation failed',
      message: error.message
    });
  }
});

/**
 * POST /api/detect-signals
 * Detect interest signals from crush behavior
 */
router.post('/detect-signals', async (req, res) => {
  try {
    const { userId, crushId, behaviors } = req.body;

    const engine = new CrushReasoningEngine(userId, crushId);
    await engine.initialize();

    const signals = await engine.detectSignals(behaviors);

    res.json({
      success: true,
      signals
    });
  } catch (error) {
    res.status(500).json({
      error: 'Signal detection failed',
      message: error.message
    });
  }
});

/**
 * GET /api/scenarios
 * Get all available scenario blueprints
 */
router.get('/scenarios', (req, res) => {
  const { SCENARIOS } = require('../blueprints');
  res.json({
    success: true,
    scenarios: SCENARIOS
  });
});

/**
 * GET /api/personalities
 * Get all personality type blueprints
 */
router.get('/personalities', (req, res) => {
  const { PERSONALITY_TYPES } = require('../blueprints');
  res.json({
    success: true,
    personalities: PERSONALITY_TYPES
  });
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'malsara69',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
