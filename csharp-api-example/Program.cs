/**
 * C# Minimal API Example - Program.cs
 * 
 * This demonstrates a .NET 7/8 Minimal API that:
 * 1. Validates input using C# models (similar to Zod schema)
 * 2. Requires JWT Bearer authentication
 * 3. Returns JSON responses
 * 
 * To create a new project:
 * dotnet new web -n MessageApi
 * cd MessageApi
 * dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
 * 
 * To run:
 * dotnet run
 */

using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Configure JWT Authentication
var jwtSecret = builder.Configuration["Jwt:Secret"] ?? "demo-secret-key-change-in-production";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "MessageApiIssuer";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "MessageApiAudience";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
    };
});

builder.Services.AddAuthorization();

// Add CORS for Next.js frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJs", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();
app.UseCors("AllowNextJs");

// ============================================================================
// Models (equivalent to Zod schemas)
// ============================================================================

/// <summary>
/// Message submission model
/// Equivalent to the Zod messageSchema on the client
/// </summary>
public class MessageRequest
{
    [Required]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 100 characters")]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress(ErrorMessage = "Invalid email address")]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(1000, MinimumLength = 10, ErrorMessage = "Message must be between 10 and 1000 characters")]
    public string Message { get; set; } = string.Empty;
}

/// <summary>
/// Login credentials model
/// </summary>
public class LoginRequest
{
    [Required]
    [StringLength(50, MinimumLength = 3)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [StringLength(100, MinimumLength = 6)]
    public string Password { get; set; } = string.Empty;
}

// ============================================================================
// API Endpoints
// ============================================================================

/// <summary>
/// POST /api/auth/login
/// Authenticate user and return JWT token
/// </summary>
app.MapPost("/api/auth/login", (LoginRequest request) =>
{
    // Mock user validation (in production, check against database with hashed passwords)
    if (request.Username == "demo" && request.Password == "demo123")
    {
        var token = GenerateJwtToken(request.Username, "1", jwtSecret, jwtIssuer, jwtAudience);
        
        return Results.Ok(new
        {
            success = true,
            token = token,
            user = new
            {
                id = "1",
                username = request.Username
            }
        });
    }

    return Results.Unauthorized();
})
.WithName("Login")
.WithOpenApi();

/// <summary>
/// POST /api/messages
/// Submit a message (requires authentication)
/// </summary>
app.MapPost("/api/messages", [Authorize] (MessageRequest request, ClaimsPrincipal user) =>
{
    // Validate the request (Data Annotations are automatically validated)
    // If validation fails, ASP.NET returns 400 automatically
    
    var username = user.Identity?.Name ?? "unknown";
    var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "unknown";
    
    // Process the message (in production: save to database, send notifications, etc.)
    var messageId = $"msg_{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}";
    
    Console.WriteLine($"Message received from user {username} (ID: {userId}):");
    Console.WriteLine($"  Name: {request.Name}");
    Console.WriteLine($"  Email: {request.Email}");
    Console.WriteLine($"  Message: {request.Message}");
    
    // Return success response
    return Results.Ok(new
    {
        success = true,
        message = "Message received successfully",
        data = new
        {
            id = messageId,
            name = request.Name,
            email = request.Email,
            messagePreview = request.Message.Length > 50 
                ? request.Message.Substring(0, 50) + "..." 
                : request.Message,
            submittedBy = username,
            submittedAt = DateTime.UtcNow
        }
    });
})
.RequireAuthorization()
.WithName("SubmitMessage")
.WithOpenApi();

/// <summary>
/// GET /api/messages
/// Retrieve messages (requires authentication)
/// </summary>
app.MapGet("/api/messages", [Authorize] (ClaimsPrincipal user) =>
{
    var username = user.Identity?.Name ?? "unknown";
    
    // Mock messages (in production, fetch from database)
    var messages = new[]
    {
        new
        {
            id = "msg_1",
            name = "John Doe",
            email = "john@example.com",
            message = "This is a test message",
            submittedBy = username,
            submittedAt = DateTime.UtcNow
        }
    };
    
    return Results.Ok(new
    {
        success = true,
        messages = messages
    });
})
.RequireAuthorization()
.WithName("GetMessages")
.WithOpenApi();

// Health check endpoint (no auth required)
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }))
   .WithName("HealthCheck")
   .WithOpenApi();

app.Run();

// ============================================================================
// Helper Methods
// ============================================================================

/// <summary>
/// Generate a JWT token for the authenticated user
/// </summary>
static string GenerateJwtToken(string username, string userId, string secret, string issuer, string audience)
{
    var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
    var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

    var claims = new[]
    {
        new Claim(ClaimTypes.Name, username),
        new Claim(ClaimTypes.NameIdentifier, userId),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

    var token = new JwtSecurityToken(
        issuer: issuer,
        audience: audience,
        claims: claims,
        expires: DateTime.UtcNow.AddHours(1),
        signingCredentials: credentials
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}

/**
 * CONFIGURATION (appsettings.json):
 * 
 * {
 *   "Jwt": {
 *     "Secret": "your-secret-key-here-at-least-32-characters-long",
 *     "Issuer": "MessageApiIssuer",
 *     "Audience": "MessageApiAudience"
 *   },
 *   "Logging": {
 *     "LogLevel": {
 *       "Default": "Information",
 *       "Microsoft.AspNetCore": "Warning"
 *     }
 *   },
 *   "AllowedHosts": "*"
 * }
 * 
 * 
 * PROJECT FILE (MessageApi.csproj):
 * 
 * <Project Sdk="Microsoft.NET.Sdk.Web">
 *   <PropertyGroup>
 *     <TargetFramework>net8.0</TargetFramework>
 *     <Nullable>enable</Nullable>
 *     <ImplicitUsings>enable</ImplicitUsings>
 *   </PropertyGroup>
 *   <ItemGroup>
 *     <PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.0" />
 *   </ItemGroup>
 * </Project>
 * 
 * 
 * TESTING THE API:
 * 
 * 1. Login:
 *    curl -X POST http://localhost:5000/api/auth/login \
 *      -H "Content-Type: application/json" \
 *      -d '{"username":"demo","password":"demo123"}'
 * 
 * 2. Submit message:
 *    curl -X POST http://localhost:5000/api/messages \
 *      -H "Content-Type: application/json" \
 *      -H "Authorization: Bearer YOUR_TOKEN_HERE" \
 *      -d '{"name":"John","email":"john@example.com","message":"Hello from C# API!"}'
 */
