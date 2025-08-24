// Mock token refresh API route - replace with your actual backend integration
export async function POST(request) {
  try {
    const { refreshToken } = await request.json();

    // Mock validation - replace with your actual refresh token validation
    if (!refreshToken || !refreshToken.startsWith('mock_refresh_token_')) {
      return Response.json(
        { message: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    // Mock successful token refresh
    const mockResponse = {
      accessToken: 'mock_access_token_' + Date.now(),
      refreshToken: 'mock_refresh_token_' + Date.now(), // Optionally provide new refresh token
    };

    return Response.json(mockResponse, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
