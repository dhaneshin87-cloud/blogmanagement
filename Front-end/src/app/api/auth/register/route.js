// Mock registration API route - replace with your actual backend integration
export async function POST(request) {
  try {
    const { firstName, lastName, email, password } = await request.json();

    // Mock validation - replace with your actual registration logic
    if (!firstName || !lastName || !email || !password) {
      return Response.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return Response.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Mock successful registration
    const mockResponse = {
      accessToken: 'mock_access_token_' + Date.now(),
      refreshToken: 'mock_refresh_token_' + Date.now(),
      user: {
        id: Date.now().toString(),
        firstName,
        lastName,
        email
      }
    };

    return Response.json(mockResponse, { status: 201 });
  } catch (error) {
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
