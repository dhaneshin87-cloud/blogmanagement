# Blog Application Backend

A Node.js backend application for a blog system with user authentication and post management.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
# JWT Configuration (REQUIRED for authentication)
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

# Server Configuration (optional)
PORT=5000

# Database Configuration (optional)
MONGODB_URI=mongodb://localhost:27017/blogapp
```

**Important:** The `JWT_SECRET` is required for user authentication. Without it, login will fail with "secretOrPrivateKey must have a value" error.

### 3. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000` by default.

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users` - Get users (protected)
- `GET /api/posts` - Get posts (protected)

## Security Notes

- **Never commit your `.env` file to version control**
- **Change the default JWT secret in production**
- The application will use a default JWT secret if none is provided, but this is not secure for production use
