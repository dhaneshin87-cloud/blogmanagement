import { NextResponse } from 'next/server';

// PUT /api/user/change-password - Change user password
export async function PUT(request) {
  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: 'New password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // In a real app, you would:
    // 1. Verify the JWT token from the Authorization header
    // 2. Extract the user ID from the token
    // 3. Verify the current password against the stored hash
    // 4. Hash the new password and update in database
    // 5. Return success response

    // For now, we'll just return a success response
    // In reality, you'd validate the current password and update the new one
    
    return NextResponse.json({ 
      message: 'Password changed successfully' 
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to change password' },
      { status: 500 }
    );
  }
}
