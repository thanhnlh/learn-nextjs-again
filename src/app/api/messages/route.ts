/**
 * Messages API Route
 * POST /api/messages
 * 
 * This endpoint:
 * 1. Validates the request body using Zod schema (same schema as client-side)
 * 2. Requires JWT Bearer token in Authorization header
 * 3. Returns a JSON response with the submitted message
 * 
 * In production, you would save the message to a database.
 */
import { NextResponse } from 'next/server';
import { messageSchema } from '@/lib/validation';
import { authenticateRequest } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    // Step 1: Authenticate the request (verify JWT token)
    let user;
    try {
      user = authenticateRequest(request);
    } catch (authError) {
      return NextResponse.json(
        { 
          error: 'Unauthorized', 
          message: authError instanceof Error ? authError.message : 'Authentication failed' 
        },
        { status: 401 }
      );
    }
    
    // Step 2: Parse request body
    const body = await request.json();
    
    // Step 3: Validate input using the same Zod schema as the client
    const validationResult = messageSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }
    
    const { name, email, message } = validationResult.data;
    
    // Step 4: Process the message
    // In production, you would:
    // - Save to database
    // - Send email notifications
    // - Queue for processing
    // - etc.
    
    console.log('Message received:', {
      from: user.username,
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
    });
    
    // Step 5: Return success response
    return NextResponse.json({
      success: true,
      message: 'Message received successfully',
      data: {
        id: `msg_${Date.now()}`, // Mock ID
        name,
        email,
        messagePreview: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        submittedBy: user.username,
        submittedAt: new Date().toISOString(),
      },
    });
    
  } catch (error) {
    console.error('Message submission error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'An unexpected error occurred while processing your message'
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to retrieve messages (example)
 * In production, this would fetch from a database
 */
export async function GET(request: Request) {
  try {
    // Authenticate the request
    let user;
    try {
      user = authenticateRequest(request);
    } catch {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Return mock messages
    return NextResponse.json({
      success: true,
      messages: [
        {
          id: 'msg_1',
          name: 'John Doe',
          email: 'john@example.com',
          message: 'This is a test message',
          submittedBy: user.username,
          submittedAt: new Date().toISOString(),
        },
      ],
    });
    
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
