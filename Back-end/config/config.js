import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const config = {
  jwt: {
    secret: process.env.JWT_SECRET || 'default_jwt_secret_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  },
  server: {
    port: process.env.PORT || 5000
  },
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/blogapp'
  }
};

// Validate required configuration
if (!config.jwt.secret || config.jwt.secret === 'default_jwt_secret_change_in_production') {
  console.log('⚠️  Warning: Using default JWT secret. Set JWT_SECRET in .env for production.');
}

export default config;
