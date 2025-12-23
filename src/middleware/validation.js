/**
 * Input validation middleware
 */

const validateAnalyzeRequest = (req, res, next) => {
  const { userId, message } = req.body;

  const errors = [];

  if (!userId) {
    errors.push('userId is required');
  }

  if (!message || typeof message !== 'string') {
    errors.push('message must be a non-empty string');
  }

  if (message && message.length > 5000) {
    errors.push('message must be less than 5000 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

const validateEvaluateRequest = (req, res, next) => {
  const { userId, action, feedback } = req.body;

  const errors = [];

  if (!userId) {
    errors.push('userId is required');
  }

  if (!action || typeof action !== 'string') {
    errors.push('action must be a non-empty string');
  }

  if (!feedback || typeof feedback !== 'string') {
    errors.push('feedback must be a non-empty string');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

const validateCrushId = (req, res, next) => {
  const { crushId } = req.params;

  if (!crushId || crushId.trim() === '') {
    return res.status(400).json({
      error: 'Validation failed',
      details: ['crushId is required']
    });
  }

  next();
};

const sanitizeInput = (req, res, next) => {
  if (req.body.message) {
    // Remove any potentially harmful HTML/script tags
    req.body.message = req.body.message.replace(/<script.*?>.*?<\/script>/gi, '');
    req.body.message = req.body.message.trim();
  }

  if (req.body.feedback) {
    req.body.feedback = req.body.feedback.replace(/<script.*?>.*?<\/script>/gi, '');
    req.body.feedback = req.body.feedback.trim();
  }

  next();
};

const rateLimiter = (() => {
  const requests = new Map();
  const WINDOW_MS = 60 * 1000; // 1 minute
  const MAX_REQUESTS = 30; // 30 requests per minute

  return (req, res, next) => {
    const userId = req.body.userId || req.ip;
    const now = Date.now();

    if (!requests.has(userId)) {
      requests.set(userId, []);
    }

    const userRequests = requests.get(userId);

    // Remove old requests outside the window
    const recentRequests = userRequests.filter(time => now - time < WINDOW_MS);
    requests.set(userId, recentRequests);

    if (recentRequests.length >= MAX_REQUESTS) {
      return res.status(429).json({
        error: 'Too many requests',
        message: 'Please wait before making another request'
      });
    }

    recentRequests.push(now);
    next();
  };
})();

module.exports = {
  validateAnalyzeRequest,
  validateEvaluateRequest,
  validateCrushId,
  sanitizeInput,
  rateLimiter
};
