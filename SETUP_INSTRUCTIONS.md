# Store Rating Web Application - Setup Instructions

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Docker and Docker Compose
- Git

### Option 1: Automated Setup (Recommended)
```bash
# Make the setup script executable and run it
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

#### 1. Start Database
```bash
# Start PostgreSQL using Docker
docker-compose up -d postgres

# Wait for database to be ready (about 10 seconds)
```

#### 2. Setup Backend
```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed database with sample data
npm run seed

# Start backend server
npm run start:dev
```

#### 3. Setup Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start frontend server
npm run dev
```

## 📋 Application URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api

## 🔑 Sample Login Credentials

### Admin User
- **Email**: admin@store-rating.com
- **Password**: Admin123!
- **Role**: System Administrator
- **Capabilities**: Full system access, user management, store management

### Store Owner
- **Email**: john.smith@electronics.com
- **Password**: Owner123!
- **Role**: Store Owner
- **Capabilities**: Manage own stores, view ratings

### Normal User
- **Email**: alice.brown@email.com
- **Password**: User123!
- **Role**: Normal User
- **Capabilities**: Browse stores, submit ratings

## 🏗️ Project Structure

```
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/       # Authentication module
│   │   │   ├── users/      # User management
│   │   │   ├── stores/     # Store management
│   │   │   └── ratings/    # Rating management
│   │   ├── common/         # Shared utilities
│   │   └── config/         # Configuration
│   ├── prisma/             # Database schema and migrations
│   └── package.json
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── pages/         # Application pages
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript types
│   └── package.json
├── docker-compose.yml     # Docker configuration
└── setup.sh              # Automated setup script
```

## 🎯 Features Implemented

### ✅ Backend Features
- **Authentication**: JWT-based login/signup with role-based access
- **User Management**: CRUD operations for users (Admin only)
- **Store Management**: CRUD operations for stores with owner relationships
- **Rating System**: Submit, update, and view ratings
- **Validation**: Comprehensive input validation with class-validator
- **Database**: PostgreSQL with Prisma ORM
- **API Documentation**: Swagger/OpenAPI documentation

### ✅ Frontend Features
- **Authentication**: Login/signup forms with validation
- **Role-Based Routing**: Protected routes based on user roles
- **Responsive Design**: Modern UI with Tailwind CSS and shadcn/ui
- **State Management**: React Context for authentication
- **API Integration**: Axios-based API service layer

### ✅ User Roles & Permissions

#### System Administrator
- Create and manage users (Admin, Store Owner, Normal User)
- Create and manage stores
- View dashboard with system statistics
- Access to all system features

#### Store Owner
- View and manage own stores
- View ratings for own stores
- Update password

#### Normal User
- Browse all stores
- Submit and modify ratings (1-5 scale)
- Update password

## 🛠️ Development Commands

### Backend
```bash
cd backend

# Development
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Database
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
npm run seed
```

### Frontend
```bash
cd frontend

# Development
npm run dev

# Build
npm run build

# Preview build
npm run preview
```

## 🐳 Docker Deployment

### Full Stack Deployment
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Individual Services
```bash
# Start only database
docker-compose up -d postgres

# Start only backend
docker-compose up -d backend

# Start only frontend
docker-compose up -d frontend
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/store_rating_app"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="24h"
PORT=3001
NODE_ENV=development
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
```

## 📊 Database Schema

### Users Table
- `id`: Unique identifier
- `name`: Full name (20-60 characters)
- `email`: Unique email address
- `address`: Address (max 400 characters)
- `passwordHash`: Hashed password
- `role`: User role (ADMIN, NORMAL_USER, STORE_OWNER)
- `createdAt`, `updatedAt`: Timestamps

### Stores Table
- `id`: Unique identifier
- `name`: Store name (max 255 characters)
- `address`: Store address (max 400 characters)
- `ownerId`: Reference to user who owns the store
- `createdAt`, `updatedAt`: Timestamps

### Ratings Table
- `id`: Unique identifier
- `ratingValue`: Rating (1-5)
- `userId`: Reference to user who submitted rating
- `storeId`: Reference to store being rated
- `createdAt`, `updatedAt`: Timestamps
- Unique constraint on (userId, storeId)

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL container is running: `docker-compose ps`
   - Check database URL in backend .env file
   - Restart database: `docker-compose restart postgres`

2. **Prisma Migration Issues**
   - Reset database: `npx prisma migrate reset`
   - Regenerate client: `npx prisma generate`

3. **Frontend Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check Node.js version: `node --version`

4. **CORS Issues**
   - Ensure backend CORS configuration includes frontend URL
   - Check API URL in frontend environment variables

### Logs
```bash
# Backend logs
cd backend && npm run start:dev

# Frontend logs
cd frontend && npm run dev

# Database logs
docker-compose logs postgres
```

## 📝 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration
- `POST /auth/change-password` - Change password
- `GET /auth/profile` - Get user profile

### Users (Admin Only)
- `GET /users` - Get all users with filtering
- `POST /users` - Create user
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /users/dashboard-stats` - Get dashboard statistics

### Stores
- `GET /stores` - Get all stores with filtering
- `POST /stores` - Create store (Admin only)
- `GET /stores/:id` - Get store by ID
- `PATCH /stores/:id` - Update store (Admin only)
- `DELETE /stores/:id` - Delete store (Admin only)
- `GET /stores/my-stores` - Get user's stores (Store Owner only)

### Ratings
- `GET /ratings` - Get all ratings (Admin only)
- `POST /ratings` - Submit rating
- `GET /ratings/my-ratings` - Get user's ratings
- `GET /ratings/store/:storeId` - Get ratings for store
- `GET /ratings/user-rating/:storeId` - Get user's rating for store
- `PATCH /ratings/:id` - Update rating
- `DELETE /ratings/:id` - Delete rating

## 🎉 Next Steps

The application is now ready for use! You can:

1. **Explore the API**: Visit http://localhost:3001/api for interactive documentation
2. **Test User Roles**: Use the provided sample credentials to test different user roles
3. **Customize**: Modify the code to add new features or change the UI
4. **Deploy**: Use Docker Compose for production deployment

For questions or issues, please refer to the troubleshooting section above. 