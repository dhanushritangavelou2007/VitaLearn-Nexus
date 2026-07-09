#!/bin/bash

echo "🚀 Starting VitaLearn Nexus..."

# Function to handle cleanup on exit
cleanup() {
    echo "🛑 Shutting down servers..."
    kill $(jobs -p) 2>/dev/null
    exit
}

# Register the cleanup function for when the script is terminated
trap cleanup SIGINT SIGTERM

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed. Please install Node.js."
    exit 1
fi

echo "📦 Installing backend dependencies..."
cd backend
npm install
echo "✅ Backend dependencies installed."

echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install
echo "✅ Frontend dependencies installed."

cd ..

echo "🟢 Starting backend server on port 5000..."
cd backend
npm run dev &
BACKEND_PID=$!

echo "🟢 Starting frontend server on port 5173..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "✨ VitaLearn Nexus is now running!"
echo "👉 Frontend: http://localhost:5173"
echo "👉 Backend: http://localhost:5000"
echo "Press Ctrl+C to stop both servers."

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
