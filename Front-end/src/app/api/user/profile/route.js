import { NextResponse } from 'next/server';

// Mock user data - in a real app, this would come from a database
let mockUser = {
  id: '1',
  firstName: 'Demo',
  lastName: 'User',
  email: 'demo@example.com',
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString()
};

// GET /api/user/profile - Get user profile
export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'No authorization token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    // Mock token validation - replace with your actual JWT validation
    if (!token || !token.startsWith('mock_access_token_')) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    return NextResponse.json(mockUser, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/user/profile - Update user profile
export async function PUT(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'No authorization token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    // Mock token validation - replace with your actual JWT validation
    if (!token || !token.startsWith('mock_access_token_')) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { firstName, lastName, email } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { message: 'First name, last name, and email are required' },
        { status: 400 }
      );
    }

    // In a real app, you would:
    // 1. Validate the email format
    // 2. Check if email is already taken by another user
    // 3. Update the user record in the database
    // 4. Return the updated user data

    // For now, we'll update the mock data
    mockUser = {
      ...mockUser,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim()
    };

    return NextResponse.json(mockUser, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
