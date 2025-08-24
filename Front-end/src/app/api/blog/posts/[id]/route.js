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

// GET /api/blog/posts/[id] - Get a single post
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const post = posts.find(p => p.id === parseInt(id));

    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT /api/blog/posts/[id] - Update a post
export async function PUT(request, { params }) {
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
    const { id } = params;
    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { message: 'Title and content are required' },
        { status: 400 }
      );
    }

    const postIndex = posts.findIndex(p => p.id === parseInt(id));
    if (postIndex === -1) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    // In a real app, you would:
    // 1. Verify the JWT token
    // 2. Extract user ID from token
    // 3. Check if the user is the author of the post
    // 4. Update in database

    // For now, we'll simulate user ID 1 (John Doe)
    const userId = 1; // This would come from JWT token verification
    
    if (posts[postIndex].author.id !== userId) {
      return NextResponse.json(
        { message: 'You can only edit your own posts' },
        { status: 403 }
      );
    }

    posts[postIndex] = {
      ...posts[postIndex],
      title: title.trim(),
      content: content.trim(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(posts[postIndex]);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/posts/[id] - Delete a post
export async function DELETE(request, { params }) {
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
    const { id } = params;
    const postIndex = posts.findIndex(p => p.id === parseInt(id));

    if (postIndex === -1) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    // In a real app, you would:
    // 1. Verify the JWT token
    // 2. Extract user ID from token
    // 3. Check if the user is the author of the post
    // 4. Delete from database

    // For now, we'll simulate user ID 1 (John Doe)
    const userId = 1; // This would come from JWT token verification
    
    if (posts[postIndex].author.id !== userId) {
      return NextResponse.json(
        { message: 'You can only delete your own posts' },
        { status: 403 }
      );
    }

    posts.splice(postIndex, 1);

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
