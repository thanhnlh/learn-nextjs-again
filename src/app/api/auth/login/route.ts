/**
 * Mock Login API Route
 * POST /api/auth/login
 * 
 * This is a simplified authentication example for demonstration.
 * In production, you would:
 * - Verify credentials against a database
 * - Hash passwords using bcrypt
 * - Implement rate limiting
 * - Use HTTP-only cookies instead of sending tokens in response
 * - Add CSRF protection
 */
import { NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validation';
import { signToken } from '@/lib/jwt';

// Mock user database (in production, use a real database)
const MOCK_USERS = [
  { id: '1', username: 'demo', password: 'demo123' }, // Never store plain-text passwords!
  { id: '2', username: 'testuser', password: 'test123' },
];

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate input using Zod schema
    const validationResult = loginSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }
    
    const { username, password } = validationResult.data;
    
    // Find user (in production, query database and compare hashed passwords)
    const user = MOCK_USERS.find(
      u => u.username === username && u.password === password
    );
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Generate JWT token
    const token = signToken({
      userId: user.id,
      username: user.username,
    });
    
    // Return token and user info
    // NOTE: For better security, set the token in an HTTP-only cookie instead
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * SECURITY NOTES:
 * 
 * Token Storage Options:
 * 
 * 1. HTTP-Only Cookie (RECOMMENDED for production):
 *    - Most secure option
 *    - Not accessible via JavaScript (prevents XSS attacks)
 *    - Automatically sent with requests
 *    - Example: response.cookies.set('token', token, { httpOnly: true, secure: true, sameSite: 'strict' })
 * 
 * 2. Memory Storage (Current example):
 *    - Simple for demos and SPA apps
 *    - Lost on page refresh
 *    - Vulnerable to XSS if not careful
 *    - Need to manually add to Authorization header
 * 
 * 3. LocalStorage (NOT RECOMMENDED):
 *    - Persists across page refreshes
 *    - Vulnerable to XSS attacks
 *    - Accessible via JavaScript
 * 
 * For this tutorial, we're using the Authorization header approach to demonstrate
 * explicit token handling, but HTTP-only cookies are preferred for production.
 */
