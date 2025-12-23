#!/bin/bash

echo "=============================================="
echo "   MALSARA69 QUICK TEST SCRIPT"
echo "=============================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo "1. Checking Node.js version..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js installed: $NODE_VERSION${NC}"
else
    echo -e "${RED}✗ Node.js not found!${NC}"
    echo "  Install from: https://nodejs.org/"
    exit 1
fi
echo ""

# Check npm packages
echo "2. Checking dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠ Dependencies not installed${NC}"
    echo "  Run: npm install"
    exit 1
fi
echo ""

# Check .env file
echo "3. Checking environment configuration..."
if [ -f ".env" ]; then
    echo -e "${GREEN}✓ .env file exists${NC}"
    
    # Check critical variables
    if grep -q "GEMINI_KEY=" .env && ! grep -q "GEMINI_KEY=$" .env && ! grep -q "GEMINI_KEY=your_" .env; then
        echo -e "${GREEN}  ✓ GEMINI_KEY configured${NC}"
    else
        echo -e "${RED}  ✗ GEMINI_KEY not set or using default${NC}"
        echo "    Get your key from: https://aistudio.google.com/app/apikey"
    fi
    
    if grep -q "MONGO_URI=" .env; then
        echo -e "${GREEN}  ✓ MONGO_URI configured${NC}"
    else
        echo -e "${RED}  ✗ MONGO_URI not set${NC}"
    fi
    
    if grep -q "NEO4J_URI=" .env; then
        echo -e "${GREEN}  ✓ NEO4J_URI configured${NC}"
    else
        echo -e "${RED}  ✗ NEO4J_URI not set${NC}"
    fi
else
    echo -e "${RED}✗ .env file not found!${NC}"
    echo "  Run: cp .env.example .env"
    echo "  Then edit .env with your credentials"
    exit 1
fi
echo ""

# Test server start (if not already running)
echo "4. Testing server startup..."
echo "   Starting server in background..."
npm run dev > server.log 2>&1 &
SERVER_PID=$!

# Wait for server to start
sleep 5

# Test health endpoint
echo "5. Testing API health..."
HEALTH_RESPONSE=$(curl -s http://localhost:3001/api/health)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Server is responding!${NC}"
    echo "  Response: $HEALTH_RESPONSE"
else
    echo -e "${RED}✗ Server not responding${NC}"
    echo "  Check server.log for errors"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi
echo ""

# Test scenarios endpoint
echo "6. Testing scenarios endpoint..."
SCENARIOS=$(curl -s http://localhost:3001/api/scenarios | grep -c "WARM_SIGNALS")
if [ "$SCENARIOS" -gt 0 ]; then
    echo -e "${GREEN}✓ Scenarios loaded successfully${NC}"
else
    echo -e "${YELLOW}⚠ Scenarios endpoint returned unexpected data${NC}"
fi
echo ""

# Cleanup
echo "7. Cleaning up..."
kill $SERVER_PID 2>/dev/null
echo -e "${GREEN}✓ Test server stopped${NC}"
echo ""

echo "=============================================="
echo "   QUICK TEST COMPLETE!"
echo "=============================================="
echo ""
echo "Next steps:"
echo "1. Review TESTING.md for comprehensive testing guide"
echo "2. Start server: npm run dev"
echo "3. Test with: curl http://localhost:3001/api/health"
echo ""
echo "For full system test, see TESTING.md Step 4-5"
