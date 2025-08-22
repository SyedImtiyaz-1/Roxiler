#!/bin/bash

echo "🚀 Store Rating Web Application Setup"
echo "====================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Start PostgreSQL database
echo "🐘 Starting PostgreSQL database..."
docker-compose up -d postgres

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Setup backend
echo "🔧 Setting up backend..."
cd backend

# Install dependencies
echo "📦 Installing backend dependencies..."
npm install

# Generate Prisma client
echo "🔌 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate dev --name init

# Seed the database
echo "🌱 Seeding database with sample data..."
npm run seed

# Start backend in background
echo "🚀 Starting backend server..."
npm run start:dev &
BACKEND_PID=$!

cd ..

# Setup frontend
echo "🎨 Setting up frontend..."
cd frontend

# Install dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Start frontend in background
echo "🚀 Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Application URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:3001"
echo "   API Documentation: http://localhost:3001/api"
echo ""
echo "🔑 Sample Login Credentials:"
echo "   Admin: admin@store-rating.com / Admin123!"
echo "   Store Owner: john.smith@electronics.com / Owner123!"
echo "   User: alice.brown@email.com / User123!"
echo ""
echo "🛑 To stop the application, press Ctrl+C"

# Wait for user to stop
trap "echo '🛑 Stopping application...'; kill $BACKEND_PID $FRONTEND_PID; docker-compose down; exit" INT
wait 