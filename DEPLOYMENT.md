# 🚀 Vercel Deployment Guide

This guide will help you deploy the Store Rating Web Application on Vercel.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **Database**: Set up a PostgreSQL database (recommended: [Supabase](https://supabase.com) or [Railway](https://railway.app))

## 🗄️ Database Setup

### Option 1: Supabase (Recommended)
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings > Database to get your connection string
4. Copy the connection string for later use

### Option 2: Railway
1. Go to [railway.app](https://railway.app) and create an account
2. Create a new PostgreSQL database
3. Copy the connection string

## 🔧 Environment Variables Setup

### Backend Environment Variables
In your Vercel project settings, add these environment variables:

```env
DATABASE_URL="postgresql://username:password@host:port/database"
JWT_SECRET="your-super-secret-jwt-key-here"
NODE_ENV="production"
```

### Frontend Environment Variables
```env
VITE_API_URL="https://your-backend-domain.vercel.app"
```

## 🚀 Deployment Steps

### Step 1: Deploy Backend API

1. **Fork/Clone the Repository**
   ```bash
   git clone https://github.com/SyedImtiyaz-1/Roxiler.git
   cd Roxiler
   ```

2. **Deploy Backend to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy backend
   cd backend
   vercel
   ```

3. **Configure Backend Settings**
   - Set the root directory to `backend`
   - Set the build command to: `npm run build`
   - Set the output directory to: `dist`
   - Add environment variables in Vercel dashboard

4. **Run Database Migrations**
   ```bash
   # In Vercel dashboard, go to Functions tab
   # Add a new function to run migrations
   npx prisma migrate deploy
   npx prisma generate
   ```

### Step 2: Deploy Frontend

1. **Deploy Frontend to Vercel**
   ```bash
   cd frontend
   vercel
   ```

2. **Configure Frontend Settings**
   - Set the root directory to `frontend`
   - Set the build command to: `npm run build`
   - Set the output directory to: `dist`
   - Add environment variables

### Step 3: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to your project settings
2. Add your custom domain
3. Configure DNS settings as instructed

## 🔗 API Routes Configuration

The backend API will be available at:
```
https://your-backend-domain.vercel.app/api
```

The frontend will be available at:
```
https://your-frontend-domain.vercel.app
```

## 🧪 Testing the Deployment

1. **Test Backend API**
   ```bash
   curl https://your-backend-domain.vercel.app/api/health
   ```

2. **Test Frontend**
   - Visit your frontend URL
   - Try logging in with test accounts
   - Test all functionality

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check DATABASE_URL format
   - Ensure database is accessible from Vercel
   - Run migrations manually if needed

2. **Build Errors**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in package.json
   - Verify TypeScript configuration

3. **CORS Issues**
   - Backend is configured to allow all origins in production
   - Check if frontend URL is correct

4. **Environment Variables**
   - Ensure all required variables are set
   - Check variable names and values
   - Redeploy after adding new variables

### Debug Commands

```bash
# Check Vercel logs
vercel logs

# Redeploy with debug info
vercel --debug

# Check environment variables
vercel env ls
```

## 📊 Monitoring

1. **Vercel Analytics**: Enable in project settings
2. **Error Tracking**: Check Functions tab for errors
3. **Performance**: Monitor in Vercel dashboard

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to your main branch:
1. Push changes to GitHub
2. Vercel automatically builds and deploys
3. Check deployment status in Vercel dashboard

## 🛡️ Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **JWT Secret**: Use a strong, unique secret
3. **Database**: Use connection pooling for production
4. **CORS**: Configure properly for production domains

## 📞 Support

If you encounter issues:
1. Check Vercel documentation
2. Review deployment logs
3. Verify environment variables
4. Test locally first

---

**Happy Deploying! 🚀** 