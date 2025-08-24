# Authentication System & Role-Based Access Control

This document describes the authentication system and role-based access control (RBAC) implementation for the Blog Application.

## Overview

The application implements a comprehensive authentication system with role-based access control that allows different user types to perform different actions based on their permissions.

## User Roles

### 1. Admin Users
- **Can manage all posts** (create, edit, delete any post)
- **Can manage all users** (view, edit, delete, change roles)
- **Access to admin panel** (`/admin`)
- **Full platform control**

### 2. Regular Users
- **Can create, edit, delete only their own posts**
- **Can view their own posts in the blog listing**
- **Access to profile management**
- **Cannot access admin features**

### 3. Unauthenticated Users
- **Can view public blog posts (if any)**
- **Cannot create, edit, or delete posts**
- **Must register/login to access features**

## Authentication Flow

### Login Process
1. User enters email and password
2. Backend validates credentials
3. Returns access token and refresh token
4. Access token stored in localStorage
5. Refresh token stored in httpOnly cookie
6. User data stored in AuthContext
7. Redirected to home page

### Registration Process
1. User fills registration form
2. Backend creates new user account
3. Returns access token and refresh token
4. User automatically logged in
5. Redirected to home page

### Token Management
- **Access Token**: Stored in localStorage, used for API requests
- **Refresh Token**: Stored in httpOnly cookie, used to refresh expired access tokens
- **Automatic Refresh**: When access token expires, system automatically refreshes it
- **Logout**: Clears both tokens and redirects to home

## Protected Routes

### Route Protection Levels
- **`requireAuth={true}`**: User must be logged in
- **`requireAdmin={true}`**: User must have admin role
- **`requireUser={true}`**: User must have regular user role

### Protected Pages
- `/blog/create` - Requires authentication
- `/blog/edit/[id]` - Requires authentication + post ownership or admin role
- `/profile` - Requires authentication
- `/admin` - Requires admin role

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh access token

### Blog Posts
- `GET /api/blog/post/list` - Get all posts (admin) or public posts (unauthenticated)
- `GET /api/blog/posts/my-posts` - Get user's own posts
- `POST /api/blog/post/create` - Create new post (authenticated users)
- `PUT /api/blog/post/[id]` - Update post (owner or admin)
- `DELETE /api/blog/post/[id]` - Delete post (owner or admin)

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/admin/users` - Get all users (admin only)
- `DELETE /api/admin/users/[id]` - Delete user (admin only)
- `PATCH /api/admin/users/[id]/role` - Change user role (admin only)

## Components

### Core Components
- **`AuthContext`**: Global authentication state management
- **`ProtectedRoute`**: Route protection wrapper
- **`Navigation`**: Dynamic navigation based on auth status
- **`LoginPage`**: User authentication
- **`RegisterPage`**: User registration
- **`ProfilePage`**: User profile management
- **`AdminPanel`**: Admin-only management interface

### Key Features
- **Automatic token refresh**
- **Role-based UI rendering**
- **Protected route handling**
- **Global auth state**
- **Responsive navigation**

## Security Features

### Token Security
- Access tokens stored in localStorage (for API calls)
- Refresh tokens stored in httpOnly cookies (XSS protection)
- Automatic token expiration handling
- Secure token refresh mechanism

### Route Protection
- Client-side route protection
- Server-side API protection (backend required)
- Role-based access control
- Automatic redirects for unauthorized access

### Data Protection
- Users can only see/manage their own posts
- Admins can manage all content
- API endpoints protected with JWT tokens
- Secure password handling

## Usage Examples

### Checking Authentication Status
```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { isAuthenticated, user, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      Welcome, {user.firstName}!
      {isAdmin() && <AdminPanel />}
    </div>
  );
}
```

### Protecting Routes
```javascript
import ProtectedRoute from '../components/ProtectedRoute';

function AdminPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div>Admin content here</div>
    </ProtectedRoute>
  );
}
```

### Checking Post Permissions
```javascript
import { useAuth } from '../contexts/AuthContext';

function PostActions({ post }) {
  const { canManagePost } = useAuth();
  
  if (canManagePost(post.author.id)) {
    return (
      <div>
        <button>Edit</button>
        <button>Delete</button>
      </div>
    );
  }
  
  return null;
}
```

## Backend Requirements

The frontend expects the backend to:

1. **Implement JWT-based authentication**
2. **Return user role information** in login/register responses
3. **Protect API endpoints** with JWT validation
4. **Implement role-based authorization** on the server side
5. **Handle token refresh** endpoints
6. **Return proper error messages** for unauthorized access

## Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Testing the System

1. **Register a new user** - Should get 'user' role by default
2. **Login with user account** - Should see only their posts
3. **Try to access admin panel** - Should be denied access
4. **Create/edit/delete posts** - Should work for own posts only
5. **Login as admin** - Should see all posts and users
6. **Access admin panel** - Should work for admin users
7. **Manage other users** - Should work for admin users

## Troubleshooting

### Common Issues
- **Token not stored**: Check localStorage and cookie settings
- **Route protection not working**: Verify ProtectedRoute usage
- **Admin access denied**: Check user role in database
- **Posts not loading**: Verify API endpoints and authentication headers

### Debug Steps
1. Check browser console for errors
2. Verify localStorage has accessToken
3. Check network tab for API calls
4. Verify user role in AuthContext
5. Check backend API responses
