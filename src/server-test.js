require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const apiRoutes = require('./route/api');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

console.log('⚠️  RUNNING IN TEST MODE - Database connections disabled');
console.log('   To run with databases, use: npm run dev');

// Routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'MALSARA69',
    description: 'AI-powered crush coaching and decision-support system',
    version: '1.0.0',
    mode: 'TEST MODE - Databases disabled',
    endpoints: {
      analyze: 'POST /api/analyze',
      quickAdvice: 'POST /api/quick-advice',
      evaluate: 'POST /api/evaluate',
      detectSignals: 'POST /api/detect-signals',
      getCrush: 'GET /api/crush/:crushId',
      scenarios: 'GET /api/scenarios',
      personalities: 'GET /api/personalities',
      health: 'GET /api/health'
    },
    documentation: 'https://github.com/yourusername/malsara69'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(port, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║                                           ║
║         MALSARA69 SERVER RUNNING          ║
║              (TEST MODE)                  ║
║                                           ║
║   AI Crush Coaching System                ║
║   Port: ${port}                           ║
║   Environment: ${process.env.NODE_ENV || 'development'}              ║
║   ⚠️  Databases: DISABLED                 ║
║                                           ║
╚═══════════════════════════════════════════╝
  `);
  console.log('✅ Server ready! Test endpoints that don\'t need databases:');
  console.log('   curl http://localhost:3001/api/health');
  console.log('   curl http://localhost:3001/api/scenarios');
  console.log('   curl http://localhost:3001/api/personalities');
});

module.exports = app;
