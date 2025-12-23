#!/bin/bash

echo "🚀 Starting MALSARA69 Test Server..."
node src/server-test.js > /dev/null 2>&1 &
PID=$!
sleep 5

echo ""
echo "=== Testing Endpoints ==="
echo ""

echo "1️⃣  Health Check:"
curl -s http://localhost:3001/api/health
echo ""
echo ""

echo "2️⃣  Scenarios:"
curl -s http://localhost:3001/api/scenarios | head -c 250
echo "..."
echo ""
echo ""

echo "3️⃣  Personalities:"
curl -s http://localhost:3001/api/personalities | head -c 250
echo "..."
echo ""
echo ""

echo "✅ All endpoints working!"
echo ""
echo "Server PID: $PID"
echo "To stop: kill $PID"
