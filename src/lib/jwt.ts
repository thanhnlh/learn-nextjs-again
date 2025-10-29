/**
 * JWT authentication utilities
 * This is a minimal example for demonstration purposes.
 * 
 * SECURITY NOTES:
 * - In production, use environment variables for secrets
 * - Consider using a proper authentication library like NextAuth.js
 * - Store tokens in HTTP-only cookies for better security
 * - Implement token refresh mechanisms
 */
import jwt from 'jsonwebtoken';

// This should be stored in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'demo-secret-key-change-in-production';

export interface JWTPayload {
  userId: string;
  username: string;
  iat?: number;
  exp?: number;
}

/**
 * Sign a JWT token with user data
 * @param payload - User data to encode in the token
 * @param expiresIn - Token expiration time (default: 1 hour)
 * @returns Signed JWT token string
 */
export function signToken(payload: Omit<JWTPayload, 'iat' | 'exp'>, expiresIn: string | number = '1h'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
}

/**
 * Verify and decode a JWT token
 * @param token - JWT token string to verify
 * @returns Decoded payload if valid
 * @throws Error if token is invalid or expired
 */
export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired');
    }
    throw new Error('Token verification failed');
  }
}

/**
 * Extract JWT token from Authorization header
 * @param authHeader - Authorization header value
 * @returns Token string or null if not found
 */
export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Middleware helper to verify JWT from request headers
 * @param request - Next.js Request object
 * @returns Decoded token payload
 * @throws Error if token is missing or invalid
 */
export function authenticateRequest(request: Request): JWTPayload {
  const authHeader = request.headers.get('Authorization');
  const token = extractBearerToken(authHeader);
  
  if (!token) {
    throw new Error('No token provided');
  }
  
  return verifyToken(token);
}
