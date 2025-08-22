#!/bin/bash

echo "🚀 Starting Store Rating Application Locally"
echo "============================================="

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "✅ Port $1 is already in use"
        return 0
    else
        echo "❌ Port $1 is not in use"
        return 1
    fi
}

# Check if backend is running
if check_port 3001; then
    echo "Backend is already running on port 3001"
else
    echo "Starting backend server..."
    cd backend
    npm run start:dev &
    BACKEND_PID=$!
    echo "Backend started with PID: $BACKEND_PID"
    cd ..
fi

# Wait a moment for backend to start
sleep 3

# Check if frontend is running
if check_port 5173; then
    echo "Frontend is already running on port 5173"
else
    echo "Starting frontend server..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    echo "Frontend started with PID: $FRONTEND_PID"
    cd ..
fi

# Wait a moment for frontend to start
sleep 3

echo ""
echo "🎉 Application is starting up!"
echo "=============================="
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:3001"
echo ""
echo "🧪 Test Accounts:"
echo "   Admin: admin@store-rating.com / Admin123!"
echo "   Store Owner: john.smith@electronics.com / Owner123!"
echo "   User: alice.brown@email.com / User123!"
echo ""
echo "📋 Available endpoints:"
echo "   - GET /auth/profile - Get user profile"
echo "   - GET /users - Get all users (Admin only)"
echo "   - GET /stores - Get all stores"
echo "   - GET /ratings - Get ratings"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Keep the script running
wait 