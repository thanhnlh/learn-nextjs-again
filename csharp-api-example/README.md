# C# Minimal API Example

This directory contains a complete ASP.NET Core Minimal API example that mirrors the Next.js API functionality.

## Features

- **JWT Bearer Authentication**: Secure endpoints with JWT tokens
- **Input Validation**: Using C# Data Annotations (similar to Zod)
- **CORS Support**: Pre-configured for Next.js frontend
- **Minimal API Pattern**: Modern .NET 7/8 approach

## Project Setup

### Prerequisites
- .NET 7 or .NET 8 SDK installed
- Terminal/Command Prompt

### Create New Project

```bash
# Create a new minimal web API project
dotnet new web -n MessageApi

# Navigate to the project directory
cd MessageApi

# Add JWT Bearer authentication package
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer

# Copy the Program.cs from this example
# Replace the default Program.cs with the provided one
```

### Project Structure

```
MessageApi/
├── Program.cs              # Main application code (API endpoints and config)
├── appsettings.json        # Configuration file
├── appsettings.Development.json
└── MessageApi.csproj       # Project file
```

### Configuration File (appsettings.json)

Create or update `appsettings.json`:

```json
{
  "Jwt": {
    "Secret": "your-secret-key-here-at-least-32-characters-long-for-security",
    "Issuer": "MessageApiIssuer",
    "Audience": "MessageApiAudience"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

## Running the API

```bash
# Run in development mode
dotnet run

# Or with watch mode (auto-restart on changes)
dotnet watch run
```

The API will be available at `http://localhost:5000` (or `https://localhost:5001` for HTTPS).

## API Endpoints

### 1. Login (POST /api/auth/login)

**Request:**
```json
{
  "username": "demo",
  "password": "demo123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "username": "demo"
  }
}
```

### 2. Submit Message (POST /api/messages)

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "This is a test message from the C# API!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message received successfully",
  "data": {
    "id": "msg_1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "messagePreview": "This is a test message from the C# API!",
    "submittedBy": "demo",
    "submittedAt": "2024-01-15T10:30:00Z"
  }
}
```

### 3. Get Messages (GET /api/messages)

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "messages": [
    {
      "id": "msg_1",
      "name": "John Doe",
      "email": "john@example.com",
      "message": "This is a test message",
      "submittedBy": "demo",
      "submittedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 4. Health Check (GET /health)

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Testing with cURL

```bash
# 1. Login to get a token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}'

# 2. Save the token from the response, then submit a message
curl -X POST http://localhost:5000/api/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"name":"John Doe","email":"john@example.com","message":"Hello from C# API!"}'

# 3. Get messages
curl -X GET http://localhost:5000/api/messages \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 4. Health check (no auth required)
curl http://localhost:5000/health
```

## Testing with Next.js Frontend

Update your Next.js API URLs to point to this C# backend:

```typescript
// In your Next.js component
const API_BASE_URL = 'http://localhost:5000';

// Login
const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password }),
});

// Submit message
const response = await fetch(`${API_BASE_URL}/api/messages`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify(formData),
});
```

## Validation

The C# API uses Data Annotations for validation, which is similar to Zod schemas:

**C# Model (Data Annotations):**
```csharp
public class MessageRequest
{
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    [StringLength(1000, MinimumLength = 10)]
    public string Message { get; set; }
}
```

**TypeScript (Zod):**
```typescript
const messageSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(1000),
});
```

Both provide:
- Type safety
- Runtime validation
- Clear error messages
- Schema reusability

## Security Considerations

1. **JWT Secret**: Use a strong, unique secret stored in environment variables or Azure Key Vault
2. **HTTPS**: Always use HTTPS in production
3. **CORS**: Configure CORS policies to only allow trusted origins
4. **Password Hashing**: Use BCrypt or similar for password storage (not shown in this example)
5. **Token Expiration**: Implement token refresh mechanisms
6. **Rate Limiting**: Add rate limiting to prevent abuse

## Production Deployment

### Azure App Service
```bash
# Publish the app
dotnet publish -c Release

# Deploy to Azure (requires Azure CLI)
az webapp up --name your-app-name --resource-group your-rg
```

### Docker
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["MessageApi.csproj", "./"]
RUN dotnet restore
COPY . .
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MessageApi.dll"]
```

## Comparison: Next.js vs C# Minimal API

| Feature | Next.js (TypeScript) | C# Minimal API |
|---------|---------------------|----------------|
| **Validation** | Zod schemas | Data Annotations |
| **Auth** | jsonwebtoken | Microsoft.AspNetCore.Authentication.JwtBearer |
| **Routing** | File-based (`app/api/`) | Explicit (`app.MapPost()`) |
| **Type Safety** | TypeScript | C# |
| **Runtime** | Node.js | .NET |
| **Deployment** | Vercel, Azure, AWS | Azure, AWS, Docker |

## Additional Resources

- [ASP.NET Core Minimal APIs](https://learn.microsoft.com/aspnet/core/fundamentals/minimal-apis)
- [JWT Authentication in .NET](https://learn.microsoft.com/aspnet/core/security/authentication/)
- [Data Annotations](https://learn.microsoft.com/dotnet/api/system.componentmodel.dataannotations)
