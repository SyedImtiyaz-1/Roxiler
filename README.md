# Store Rating Web Application

A full-stack web application that allows users to submit ratings for stores registered on the platform. Built with modern technologies and best practices.

## 🚀 Features

### System Administrator
- **Dashboard**: View total users, stores, and ratings statistics
- **User Management**: Create, read, update, delete users with role-based access
- **Store Management**: Manage stores and assign owners
- **Advanced Filtering**: Search and filter users/stores by name, email, address, and role
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality

### Normal User
- **Authentication**: Sign up and login with form validation
- **Store Browsing**: View all registered stores with search functionality
- **Rating System**: Submit and modify ratings (1-5 stars) for stores
- **Real-time Updates**: Instant feedback and success messages

### Store Owner
- **Dashboard**: View store analytics and user feedback
- **Rating Analytics**: See average ratings and rating distribution
- **User Feedback**: View list of users who rated their stores

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with role-based access control
- **Validation**: Class-validator with custom decorators
- **Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Custom CSS with modern design system
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Database
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Migrations**: Automatic schema management

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/SyedImtiyaz-1/Roxiler.git
cd Roxiler
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Database Setup
```bash
# Create a PostgreSQL database
# Update the DATABASE_URL in backend/.env

# Run Prisma migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Seed the database (optional)
npx prisma db seed
```

### 4. Frontend Setup
```bash
cd frontend
npm install
```

### 5. Environment Configuration

#### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/store_rating_db"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3001
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
```

## 🏃‍♂️ Running the Application

### Development Mode

#### Backend
```bash
cd backend
npm run start:dev
```

#### Frontend
```bash
cd frontend
npm run dev
```

### Production Mode

#### Backend
```bash
cd backend
npm run build
npm run start:prod
```

#### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 🧪 Test Accounts

The application comes with pre-configured test accounts:

- **Admin**: `admin@store-rating.com` / `Admin123!`
- **Store Owner**: `john.smith@electronics.com` / `Owner123!`
- **Normal User**: `alice.brown@email.com` / `User123!`

## 📁 Project Structure

```
Roxiler/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   ├── common/         # Shared utilities
│   │   └── main.ts         # Application entry point
│   ├── prisma/             # Database schema and migrations
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript types
│   └── package.json
├── .gitignore              # Git ignore rules
└── README.md               # Project documentation
```

## 🔐 Authentication & Authorization

The application uses JWT-based authentication with role-based access control:

- **ADMIN**: Full system access
- **STORE_OWNER**: Store management and analytics
- **NORMAL_USER**: Store browsing and rating

## 📊 API Documentation

Once the backend is running, you can access the Swagger documentation at:
```
http://localhost:3001/api
```

## 🎨 UI/UX Features

- **Modern Design**: Professional dark slate color scheme
- **Responsive Layout**: Works on all screen sizes
- **Interactive Elements**: Hover effects and smooth transitions
- **Form Validation**: Real-time validation with visual feedback
- **Loading States**: User-friendly loading indicators
- **Error Handling**: Comprehensive error messages

## 🔧 Form Validations

- **Name**: 20-60 characters
- **Address**: Maximum 400 characters
- **Password**: 8-16 characters with uppercase and special character
- **Email**: Standard email format validation

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables
2. Run database migrations
3. Build the application: `npm run build`
4. Start the production server: `npm run start:prod`

### Frontend Deployment
1. Update API URL in environment variables
2. Build the application: `npm run build`
3. Deploy the `dist` folder to your hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Syed Imtiyaz Ali**
- GitHub: [@SyedImtiyaz-1](https://github.com/SyedImtiyaz-1)

## 🙏 Acknowledgments

- NestJS team for the excellent backend framework
- React team for the frontend library
- Prisma team for the database ORM
- All contributors and testers

---

**Happy Coding! 🎉** 