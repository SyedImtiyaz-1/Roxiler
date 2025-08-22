#!/bin/bash

echo "🚀 Starting Vercel Deployment for Store Rating App"
echo "=================================================="

# Check if Vercel is logged in
if ! npx vercel whoami > /dev/null 2>&1; then
    echo "❌ Please login to Vercel first:"
    echo "npx vercel login"
    exit 1
fi

echo "✅ Vercel CLI is ready"

# Deploy Backend
echo ""
echo "📦 Deploying Backend API..."
cd backend

# Set environment variables for backend
export DATABASE_URL="postgresql://postgres:imtiyaz@db.yirifsjvjcxwgfnqfblk.supabase.co:5432/postgres"
export JWT_SECRET="your-super-secret-jwt-key-for-production-2024"
export NODE_ENV="production"

echo "🔧 Backend Environment Variables:"
echo "   DATABASE_URL: $DATABASE_URL"
echo "   JWT_SECRET: [HIDDEN]"
echo "   NODE_ENV: $NODE_ENV"

# Deploy backend
npx vercel --prod --yes

# Get the backend URL
BACKEND_URL=$(npx vercel ls | grep "roxiler-backend" | head -1 | awk '{print $2}')
echo "✅ Backend deployed at: $BACKEND_URL"

cd ..

# Deploy Frontend
echo ""
echo "📦 Deploying Frontend..."
cd frontend

# Set environment variables for frontend
export VITE_API_URL="$BACKEND_URL"

echo "🔧 Frontend Environment Variables:"
echo "   VITE_API_URL: $VITE_API_URL"

# Deploy frontend
npx vercel --prod --yes

# Get the frontend URL
FRONTEND_URL=$(npx vercel ls | grep "roxiler-frontend" | head -1 | awk '{print $2}')
echo "✅ Frontend deployed at: $FRONTEND_URL"

cd ..

echo ""
echo "🎉 Deployment Complete!"
echo "======================"
echo "Backend API: $BACKEND_URL"
echo "Frontend App: $FRONTEND_URL"
echo ""
echo "🔗 Test your application:"
echo "   Frontend: $FRONTEND_URL"
echo "   API Health: $BACKEND_URL/api/health"
echo ""
echo "🧪 Test Accounts:"
echo "   Admin: admin@store-rating.com / Admin123!"
echo "   Store Owner: john.smith@electronics.com / Owner123!"
echo "   User: alice.brown@email.com / User123!" 