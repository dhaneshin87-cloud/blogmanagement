import { NextResponse } from 'next/server';

// Mock data for demonstration - in a real app, this would come from a database
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
    updatedAt: "2024-01-15T10:00:00Z"
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
    updatedAt: "2024-01-14T14:30:00Z"
  }
];

let nextId = 3;

// GET /api/blog/posts - Get all posts (admin only)
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
    // 2. Extract the user ID and role from the token
    // 3. Check if user is admin
    // 4. Query the database for all posts if admin, or return error if not admin
    
    // For now, we'll simulate admin access and return all posts
    // In production, you'd verify the JWT token and check user role
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/blog/posts - Create a new post
export async function POST(request) {
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
    
    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { message: 'Title and content are required' },
        { status: 400 }
      );
    }

    // In a real app, you would:
    // 1. Verify the JWT token
    // 2. Get the user ID from the token
    // 3. Save to database
    // 4. Return the created post

    // For now, we'll simulate extracting user ID from token
    // In production, you'd decode the JWT and extract the user ID
    const userId = 1; // This would come from JWT token verification
    const userFirstName = "Current";
    const userLastName = "User";
    const userEmail = "user@example.com";

    const newPost = {
      id: nextId++,
      title: title.trim(),
      content: content.trim(),
      author: {
        id: userId,
        firstName: userFirstName,
        lastName: userLastName,
        email: userEmail
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "published"
    };

    posts.push(newPost);

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to create post' },
      { status: 500 }
    );
  }
}
