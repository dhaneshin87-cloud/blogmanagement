import { NextResponse } from 'next/server';

// Mock data - in a real app, this would come from a database
let posts = [
  {
    id: 1,
    title: "Getting Started with Next.js",
    content: "Next.js is a powerful React framework that makes building full-stack web applications simple and efficient. In this post, we'll explore the basics of Next.js and how to get started with your first project.",
    author: {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com"
    },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    status: "published"
  },
  {
    id: 2,
    title: "The Power of Tailwind CSS",
    content: "Tailwind CSS is a utility-first CSS framework that allows you to build custom designs without leaving your HTML. Learn how to use Tailwind CSS to create beautiful, responsive designs quickly.",
    author: {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com"
    },
    createdAt: "2024-01-14T14:30:00Z",
    updatedAt: "2024-01-14T14:30:00Z",
    status: "published"
  },
  {
    id: 3,
    title: "My Personal Blog Post",
    content: "This is a personal blog post that should only be visible to the author.",
    author: {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com"
    },
    createdAt: "2024-01-16T09:00:00Z",
    updatedAt: "2024-01-16T09:00:00Z",
    status: "draft"
  }
];

// GET /api/blog/posts/my-posts - Get posts by the authenticated user
export async function GET(request) {
  try {
    // Check if user is authenticated
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // In a real app, you would:
    // 1. Verify the JWT token
    // 2. Extract the user ID from the token
    // 3. Query the database for posts by that user ID
    // 4. Return the filtered posts

    // For now, we'll simulate extracting user ID from token
    // In production, you'd decode the JWT and extract the user ID
    // For demo purposes, we'll use user ID 1 (John Doe)
    const userId = 1; // This would come from JWT token verification
    const userPosts = posts.filter(post => post.author.id === userId);
    
    return NextResponse.json(userPosts);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch user posts' },
      { status: 500 }
    );
  }
}
