# Blog Application

A modern, full-featured blog application built with Next.js 15, featuring user authentication, blog management, and a responsive design.

## Features

### Blog Management
- **Create, Read, Update, Delete (CRUD)** blog posts
- Blog posts include:
  - Title
  - Content (rich text support)
  - Author (linked to user)
  - Created/Updated dates
- Public blog listing page (viewable without login)
- Individual blog detail pages
- Edit and delete functionality for post authors

### User Management
- User registration and authentication
- User profile management:
  - View and edit profile information (name, email)
  - Change password functionality
- Users can view their own posts
- Secure JWT-based authentication

### User Interface
- Modern, responsive design using Tailwind CSS
- Navigation with authentication-aware menu items
- Beautiful blog post cards and layouts
- Form validation and error handling
- Loading states and user feedback

## Tech Stack

- **Frontend**: Next.js 15, React 19
- **Styling**: Tailwind CSS 4
- **Authentication**: JWT tokens
- **API**: Next.js API routes
- **Development**: ESLint, Turbopack

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-next-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── blog/              # Blog post endpoints
│   │   └── user/              # User management endpoints
│   ├── auth/                  # Authentication pages
│   ├── blog/                  # Blog pages
│   │   ├── [id]/             # Individual blog post
│   │   ├── create/            # Create new post
│   │   └── edit/[id]/         # Edit existing post
│   ├── profile/               # User profile page
│   ├── globals.css            # Global styles
│   ├── layout.js              # Root layout
│   └── page.js                # Home page
├── components/                 # Reusable components
│   ├── Navigation.js          # Main navigation
│   └── ProtectedRoute.js      # Route protection
└── utils/                      # Utility functions
    └── auth.js                # Authentication helpers
```

## API Endpoints

### Blog Posts
- `GET /api/blog/posts` - Get all blog posts
- `POST /api/blog/posts` - Create a new blog post
- `GET /api/blog/posts/[id]` - Get a specific blog post
- `PUT /api/blog/posts/[id]` - Update a blog post
- `DELETE /api/blog/posts/[id]` - Delete a blog post
- `GET /api/blog/posts/my-posts` - Get current user's posts

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/change-password` - Change user password

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token

## Usage

### For Visitors
1. Browse blog posts on the main blog page
2. Read individual blog posts
3. Register for an account to start writing

### For Authors
1. Create new blog posts
2. Edit your existing posts
3. Delete your posts
4. Manage your profile and password

### For Developers
The application uses mock data for demonstration purposes. To integrate with a real backend:

1. Replace mock data in API routes with database queries
2. Implement proper JWT validation
3. Add database models and connections
4. Set up proper error handling and logging

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style
- Follow Next.js 15 conventions
- Use functional components with hooks
- Implement proper error handling
- Add loading states for better UX

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Future Enhancements

- Rich text editor for blog posts
- Image upload support
- Comment system
- User roles and permissions
- Search functionality
- Categories and tags
- Social media sharing
- Email notifications
- Analytics dashboard
