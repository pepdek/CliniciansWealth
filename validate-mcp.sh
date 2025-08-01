#!/bin/bash

echo "🧪 Quick MCP Validation Test"
echo "============================"

# Start server in background
echo "🚀 Starting server..."
cd ~/Documents/"Clinicians Wealth"/"web app"/clinician-loan-optimizer/server
node src/index.js &
SERVER_PID=$!
sleep 3

echo ""
echo "1️⃣ Health Check:"
curl -s http://localhost:4545/api/health

echo ""
echo ""
echo "2️⃣ MCP Services Test:"
curl -s http://localhost:4545/api/mcp/test

echo ""
echo ""
echo "3️⃣ Fallback Salary Data:"
curl -s -X POST http://localhost:4545/api/mcp/search/salary \
  -H "Content-Type: application/json" \
  -d '{"specialty": "anesthesiology"}'

echo ""
echo ""
echo "✅ All tests completed!"
echo "💡 For enhanced features, add API keys to server/.env"

# Clean up
kill $SERVER_PID 2>/dev/null
echo ""
echo "Server stopped."