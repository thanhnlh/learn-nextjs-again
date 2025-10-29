# Next.js + TypeScript + Zod Validation Tutorial

A complete guide to building type-safe forms with client and server validation, JWT authentication, and React hooks state management.

## 📚 Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Key Concepts](#key-concepts)
4. [Implementation Guide](#implementation-guide)
5. [Running the Examples](#running-the-examples)
6. [Testing](#testing)
7. [C# Backend Alternative](#c-backend-alternative)
8. [Security Best Practices](#security-best-practices)

---

## Overview

This tutorial demonstrates:

- ✅ **Next.js 16** with TypeScript and App Router
- ✅ **Zod** for schema validation (shared between client and server)
- ✅ **Raw React Hooks** (`useReducer`) for state management - NO libraries like react-hook-form or Zustand
- ✅ **JWT Authentication** with Bearer tokens
- ✅ **Controlled Components** for forms
- ✅ **API Routes** with validation and authentication
- ✅ **C# Minimal API** example for backend developers

### What You'll Build

A contact form with:
1. Login flow that returns a JWT token
2. Form with client-side validation (Zod)
3. API endpoint with server-side validation (same Zod schema)
4. JWT authentication requirement
5. Inline error messages
6. Type safety throughout

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── login/
│   │   │       └── route.ts          # Login endpoint
│   │   └── messages/
│   │       └── route.ts              # Messages endpoint (protected)
│   └── tutorial/
│       └── page.tsx                  # Contact form component
├── lib/
│   ├── validation.ts                 # Shared Zod schemas
│   └── jwt.ts                        # JWT utilities
└── ...

csharp-api-example/                   # C# Minimal API alternative
├── Program.cs
└── README.md
```

---

## Key Concepts

### 1. Shared Validation with Zod

**Why Zod?**
- Type-safe schema validation
- Same schema used on client AND server
- Excellent TypeScript integration
- Clear, readable error messages

**Example Schema:**

```typescript
// src/lib/validation.ts
import { z } from 'zod';

export const messageSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Infer TypeScript type from schema
export type MessageFormData = z.infer<typeof messageSchema>;
```

### 2. Raw React Hooks (useReducer)

**Why useReducer instead of libraries?**
- No external dependencies
- Full control over state logic
- Educational value
- Perfect for form state management

**Example Reducer:**

```typescript
interface FormState {
  name: string;
  email: string;
  message: string;
  errors: Partial<Record<keyof MessageFormData, string>>;
  isSubmitting: boolean;
}

type FormAction =
  | { type: 'SET_FIELD'; field: keyof MessageFormData; value: string }
  | { type: 'SET_ERRORS'; errors: Partial<Record<keyof MessageFormData, string>> }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value,
        errors: { ...state.errors, [action.field]: undefined },
      };
    // ... other cases
  }
}
```

### 3. JWT Authentication

**Flow:**
1. User logs in → Server signs JWT token
2. Client stores token (in memory for this demo)
3. Client sends token in `Authorization: Bearer <token>` header
4. Server verifies token before processing request

**Token Structure:**

```typescript
interface JWTPayload {
  userId: string;
  username: string;
  iat?: number;  // issued at
  exp?: number;  // expiration
}
```

### 4. Controlled Components

All form inputs are controlled by React state:

```typescript
<input
  type="text"
  value={state.name}
  onChange={(e) => dispatch({ 
    type: 'SET_FIELD', 
    field: 'name', 
    value: e.target.value 
  })}
/>
```

---

## Implementation Guide

### Step 1: Install Dependencies

```bash
npm install zod jsonwebtoken
npm install --save-dev @types/jsonwebtoken
```

### Step 2: Create Shared Validation Schema

Create `src/lib/validation.ts`:

```typescript
import { z } from 'zod';

export const messageSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message is too long'),
});

export type MessageFormData = z.infer<typeof messageSchema>;

export const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

### Step 3: Create JWT Utilities

Create `src/lib/jwt.ts`:

```typescript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'demo-secret-key-change-in-production';

export interface JWTPayload {
  userId: string;
  username: string;
}

export function signToken(payload: JWTPayload, expiresIn = '1h'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}

export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

export function authenticateRequest(request: Request): JWTPayload {
  const authHeader = request.headers.get('Authorization');
  const token = extractBearerToken(authHeader);
  
  if (!token) {
    throw new Error('No token provided');
  }
  
  return verifyToken(token);
}
```

### Step 4: Create Login API Route

Create `src/app/api/auth/login/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validation';
import { signToken } from '@/lib/jwt';

const MOCK_USERS = [
  { id: '1', username: 'demo', password: 'demo123' },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validationResult = loginSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    
    const { username, password } = validationResult.data;
    const user = MOCK_USERS.find(u => u.username === username && u.password === password);
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    const token = signToken({ userId: user.id, username: user.username });
    
    return NextResponse.json({
      success: true,
      token,
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Step 5: Create Messages API Route

Create `src/app/api/messages/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { messageSchema } from '@/lib/validation';
import { authenticateRequest } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    // Authenticate
    let user;
    try {
      user = authenticateRequest(request);
    } catch (authError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse and validate
    const body = await request.json();
    const validationResult = messageSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    
    const { name, email, message } = validationResult.data;
    
    // Process message (save to DB in production)
    console.log('Message received:', { from: user.username, name, email, message });
    
    return NextResponse.json({
      success: true,
      message: 'Message received successfully',
      data: {
        id: `msg_${Date.now()}`,
        name,
        email,
        submittedBy: user.username,
        submittedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Step 6: Create Client Form Component

Create `src/app/tutorial/page.tsx` - see the actual file for the complete implementation with:
- useReducer for state management
- Controlled form inputs
- Client-side Zod validation
- JWT authentication
- Inline error display

---

## Running the Examples

### Next.js Application

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit: http://localhost:3000/tutorial

### Test Flow

1. **Login:**
   - Username: `demo`
   - Password: `demo123`
   - Click "Login" to receive JWT token

2. **Submit Message:**
   - Fill out the form
   - Click "Submit Message"
   - Token is sent in Authorization header
   - Server validates and responds

---

## Testing

### Manual Testing with cURL

```bash
# 1. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}'

# Copy the token from response

# 2. Submit message
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"name":"John Doe","email":"john@example.com","message":"This is a test message from cURL!"}'

# 3. Test without token (should fail)
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","message":"This should fail"}'
```

### Validation Testing

```bash
# Invalid email
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"name":"John","email":"not-an-email","message":"Test message"}'

# Message too short
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"name":"John","email":"john@example.com","message":"Short"}'
```

---

## C# Backend Alternative

For teams using .NET, see the complete C# Minimal API example in `csharp-api-example/`:

- Same validation approach (Data Annotations vs Zod)
- JWT Bearer authentication
- CORS configuration for Next.js
- Complete working example

[View C# Example →](./csharp-api-example/README.md)

---

## Security Best Practices

### ⚠️ This is a Tutorial - Production Considerations

**Authentication:**
- ✅ Use HTTP-only cookies instead of sending tokens in response
- ✅ Implement refresh tokens
- ✅ Add CSRF protection
- ✅ Use secure, environment-based secrets
- ✅ Implement rate limiting
- ✅ Hash passwords with bcrypt/argon2

**Token Storage:**

| Method | Security | Pros | Cons |
|--------|----------|------|------|
| **HTTP-only Cookie** | ⭐⭐⭐⭐⭐ | Not accessible to JS, auto-sent | Requires CSRF protection |
| **Memory (useState)** | ⭐⭐⭐ | Simple, lost on refresh | Lost on page reload |
| **LocalStorage** | ⭐ | Persists | Vulnerable to XSS |

**Recommended Production Setup:**

```typescript
// Set token in HTTP-only cookie (server-side)
const response = NextResponse.json({ success: true });
response.cookies.set('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 3600, // 1 hour
});

// Read token from cookie (server-side)
const token = cookies().get('token')?.value;
```

**Input Validation:**
- ✅ Validate on both client AND server
- ✅ Use the same schema for consistency
- ✅ Sanitize user input before storing
- ✅ Never trust client-side validation alone

**Environment Variables:**

```bash
# .env.local (never commit to git)
JWT_SECRET=your-super-secure-secret-at-least-32-characters-long
DATABASE_URL=postgresql://...
```

---

## Learning Objectives

After completing this tutorial, you will understand:

- ✅ How to create type-safe forms with TypeScript
- ✅ Sharing validation schemas between client and server
- ✅ Using React hooks for state management without libraries
- ✅ Implementing JWT authentication
- ✅ Building secure API routes
- ✅ Handling errors gracefully
- ✅ The differences between Next.js and C# backends

---

## Next Steps

1. **Add Database:** Integrate Prisma or Drizzle ORM
2. **Email Notifications:** Send emails on message submission
3. **File Uploads:** Add file attachment support
4. **Real Auth:** Integrate NextAuth.js or Clerk
5. **Testing:** Add unit and integration tests
6. **Deployment:** Deploy to Vercel or Azure

---

## Additional Resources

- [Zod Documentation](https://zod.dev/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [JWT.io](https://jwt.io/) - Decode and verify JWTs
- [React useReducer](https://react.dev/reference/react/useReducer)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## License

MIT License - Feel free to use this for learning and production projects.
