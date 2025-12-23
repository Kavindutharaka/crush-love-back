#!/bin/bash

echo "🚀 Starting MALSARA69 Test..."
echo ""

# Start server
echo "Starting server..."
npm run dev > test-server.log 2>&1 &
SERVER_PID=$!

# Wait for startup
echo "Waiting for server to start..."
sleep 8

# Test health
echo ""
echo "Testing /api/health..."
curl -s http://localhost:3001/api/health | jq '.' 2>/dev/null || echo "Install jq for pretty output: sudo apt-get install jq"

echo ""
echo "Testing /api/scenarios..."
curl -s http://localhost:3001/api/scenarios | head -c 200
echo "..."

echo ""
echo ""
echo "✅ Basic tests complete!"
echo "Server is running at: http://localhost:3001"
echo ""
echo "Try this:"
echo 'curl -X POST http://localhost:3001/api/analyze \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"userId":"test","message":"She smiled at me today"}'"'"
echo ""
echo "To stop server: kill $SERVER_PID"
echo "Or press Ctrl+C and run: pkill -f 'node.*server.js'"

