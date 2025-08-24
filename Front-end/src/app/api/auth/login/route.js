// Mock login API route - replace with your actual backend integration
export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Mock validation - replace with your actual authentication logic
    if (email === 'demo@example.com' && password === 'password123') {
      // Mock successful login
      const mockResponse = {
        accessToken: 'mock_access_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
        user: {
          id: '1',
          firstName: 'Demo',
          lastName: 'User',
          email: email
        }
      };

      return Response.json(mockResponse, { status: 200 });
    } else {
      // Mock failed login
      return Response.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
