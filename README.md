# Users Service

A REST API service for managing users, built with Node.js, Express, and TypeScript.

## Features

- ✅ Full CRUD operations for users
- ✅ Extended user profiles with phone number and address
- ✅ TypeScript for type safety
- ✅ Express.js web framework
- ✅ MongoDB Atlas cloud database with Mongoose ODM
- ✅ JWT-based authentication and authorization
- ✅ Role-based access control (User/Admin roles)
- ✅ Secure password hashing with bcrypt
- ✅ Input validation and data modeling
- ✅ Comprehensive error handling
- ✅ Health check endpoint
- ✅ CORS enabled
- ✅ Security headers with Helmet
- ✅ Request logging with Morgan
- ✅ Comprehensive structured logging with Winston
- ✅ Request correlation with unique request IDs
- ✅ Performance monitoring and request duration tracking
- ✅ File-based logging with rotation support
- ✅ Docker Compose for development
- ✅ MongoDB Express admin interface
- ✅ Comprehensive test suite with Vitest
- ✅ Unit tests for models, controllers, and utilities
- ✅ Integration tests for API endpoints
- ✅ Rate limiting for API endpoints and authentication

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm
- MongoDB Atlas account (free tier available)
- Docker and Docker Compose (optional, for local development)

### Installation

```bash
# Clone the repository
git clone https://github.com/wingedearth/users-service.git
cd users-service

# Install dependencies
npm install

# Configure your MongoDB Atlas connection (see Environment Variables below)
# Edit .env file with your Atlas connection string

# Run in development mode
npm run dev

# Or build and run in production mode
npm run build
npm start
```

### Environment Variables

Create a `.env` file in the root directory:

```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb+srv://username:password@your-cluster.xxxxx.mongodb.net/users-service?retryWrites=true&w=majority
DB_NAME=users-service
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=1d
LOG_LEVEL=info
LOG_DIR=logs
```

#### MongoDB Atlas Configuration

To get your MongoDB Atlas connection string:

1. **Log into MongoDB Atlas** at https://cloud.mongodb.com/
2. **Navigate to your cluster** and click "Connect"
3. **Choose "Connect your application"**
4. **Select Node.js** as the driver
5. **Copy the connection string** and replace:
   - `<username>` with your database username
   - `<password>` with your database password
   - `<database>` with `users-service` (or your preferred database name)

**Example Atlas connection string:**
```
mongodb+srv://myuser:mypassword@users-service.abc123.mongodb.net/users-service?retryWrites=true&w=majority
```

**For local development** (alternative), you can still use Docker:
```
MONGODB_URI=mongodb://app-user:app-password@localhost:27017/users-service
```

## Database

### MongoDB Atlas (Recommended)

This service is configured to use **MongoDB Atlas**, MongoDB's cloud database service:

**Benefits:**
- ✅ **Cloud-hosted** - No local setup required
- ✅ **Automatic backups** - Built-in data protection
- ✅ **High availability** - 99.995% uptime SLA
- ✅ **Global clusters** - Deploy close to your users
- ✅ **Free tier** - Perfect for development and small projects
- ✅ **Easy scaling** - Upgrade as your service grows
- ✅ **Built-in security** - Network isolation and encryption

**Atlas Features Used:**
- Connection pooling with optimized settings
- Automatic failover and replica sets
- Network-level security
- Database user authentication
- Performance monitoring and alerts

### Local Development Alternative

If you prefer local development, Docker Compose is still available:

```bash
# Start local MongoDB with Docker
npm run db:up

# Update your .env file to use local connection:
MONGODB_URI=mongodb://app-user:app-password@localhost:27017/users-service
```

## API Documentation

### Base URL
```
http://localhost:3000
```

### Health Check
```
GET /health
```

Returns service health status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-07-24T03:30:00.000Z",
  "service": "users-service"
}
```

### Authentication API

#### Register User
```
POST /api/auth/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zipCode": "12345",
    "country": "USA"
  }
}
```

*Note: `phoneNumber` and `address` fields are optional. The `address` object can include any combination of `street`, `city`, `state`, `zipCode`, and `country` fields.*

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "phoneNumber": "+1234567890",
      "address": {
        "street": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "zipCode": "12345",
        "country": "USA"
      },
      "createdAt": "2024-07-24T03:30:00.000Z",
      "updatedAt": "2024-07-24T03:30:00.000Z"
    }
  }
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "phoneNumber": "+1234567890",
      "address": {
        "street": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "zipCode": "12345",
        "country": "USA"
      },
      "createdAt": "2024-07-24T03:30:00.000Z",
      "updatedAt": "2024-07-24T03:30:00.000Z"
    }
  }
}
```

#### Get Current User (Protected)
```
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "phoneNumber": "+1234567890",
    "address": {
      "street": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "zipCode": "12345",
      "country": "USA"
    },
    "createdAt": "2024-07-24T03:30:00.000Z",
    "updatedAt": "2024-07-24T03:30:00.000Z"
  }
}
```

### Users API

*Note: All user endpoints require authentication. Include the JWT token in the Authorization header: `Authorization: Bearer <token>`*

#### Get All Users
```
GET /api/users
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "createdAt": "2024-07-24T03:30:00.000Z",
      "updatedAt": "2024-07-24T03:30:00.000Z"
    }
  ],
  "count": 1
}
```

#### Get User by ID
```
GET /api/users/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2024-07-24T03:30:00.000Z",
    "updatedAt": "2024-07-24T03:30:00.000Z"
  }
}
```

#### Create User
```
POST /api/users
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "jane.smith@example.com",
  "password": "securePassword123",
  "firstName": "Jane",
  "lastName": "Smith",
  "phoneNumber": "+1987654321",
  "address": {
    "street": "456 Oak Ave",
    "city": "Another City",
    "state": "NY",
    "zipCode": "67890",
    "country": "USA"
  }
}
```

*Note: `password` is required. `phoneNumber` and `address` fields are optional.*

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "email": "jane.smith@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "phoneNumber": "+1987654321",
    "address": {
      "street": "456 Oak Ave",
      "city": "Another City",
      "state": "NY",
      "zipCode": "67890",
      "country": "USA"
    },
    "createdAt": "2024-07-24T03:30:00.000Z",
    "updatedAt": "2024-07-24T03:30:00.000Z"
  }
}
```

#### Update User
```
PUT /api/users/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "jane.doe@example.com",
  "firstName": "Jane",
  "lastName": "Doe",
  "phoneNumber": "+1555666777",
  "address": {
    "street": "789 Updated St",
    "city": "Updated City",
    "state": "TX",
    "zipCode": "54321",
    "country": "USA"
  }
}
```

*Note: `phoneNumber` and `address` fields are optional.*

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "email": "jane.doe@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "phoneNumber": "+1555666777",
    "address": {
      "street": "789 Updated St",
      "city": "Updated City",
      "state": "TX",
      "zipCode": "54321",
      "country": "USA"
    },
    "createdAt": "2024-07-24T03:30:00.000Z",
    "updatedAt": "2024-07-24T03:32:00.000Z"
  }
}
```

#### Delete User
```
DELETE /api/users/:id
```

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {
    "id": 2,
    "email": "jane.doe@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "createdAt": "2024-07-24T03:30:00.000Z",
    "updatedAt": "2024-07-24T03:32:00.000Z"
  }
}
```

### Admin API

*Note: All admin endpoints require authentication with admin role. Include the JWT token in the Authorization header: `Authorization: Bearer <token>`*

#### Promote User to Admin
```
PATCH /api/admin/:id/promote
Authorization: Bearer <admin-token>
```

Promotes a regular user to administrator role.

**Parameters:**
- `id` - User ID to promote

**Response:**
```json
{
  "success": true,
  "message": "User promoted to administrator successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "admin",
    "createdAt": "2024-07-24T03:30:00.000Z",
    "updatedAt": "2024-07-24T03:35:00.000Z"
  }
}
```

**Error Responses:**
- `400` - User is already an administrator
- `404` - User not found
- `403` - Permission denied (not admin)

#### Demote Admin to User
```
PATCH /api/admin/:id/demote
Authorization: Bearer <admin-token>
```

Demotes an administrator to regular user role.

**Parameters:**
- `id` - Admin user ID to demote

**Response:**
```json
{
  "success": true,
  "message": "Administrator demoted to user successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@example.com",
    "firstName": "Jane",
    "lastName": "Admin",
    "role": "user",
    "createdAt": "2024-07-24T03:30:00.000Z",
    "updatedAt": "2024-07-24T03:40:00.000Z"
  }
}
```

**Error Responses:**
- `400` - User is already a regular user or cannot demote yourself
- `404` - User not found
- `403` - Permission denied (not admin)

#### Get Admin Statistics
```
GET /api/admin/stats
Authorization: Bearer <admin-token>
```

Returns comprehensive statistics about the user base.

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalUsers": 150,
      "totalAdmins": 3,
      "regularUsers": 147
    },
    "recentUsers": [
      {
        "id": "507f1f77bcf86cd799439015",
        "email": "newest@example.com",
        "firstName": "New",
        "lastName": "User",
        "role": "user",
        "createdAt": "2024-07-24T10:30:00.000Z",
        "updatedAt": "2024-07-24T10:30:00.000Z"
      }
    ]
  }
}
```

**Error Responses:**
- `403` - Permission denied (not admin)

### Role-Based Access Control

The service implements a two-tier role system:

#### User Roles

**Regular User (`user`):**
- Default role for new registrations
- Can access own profile and standard user endpoints
- Cannot access admin endpoints
- Cannot modify other users' data

**Administrator (`admin`):**
- Full access to all endpoints
- Can promote users to admin
- Can demote other admins (except themselves)
- Can view system statistics
- Has audit logging for all admin actions

#### Admin Features

**Role Management:**
- Promote users to administrators
- Demote administrators to regular users
- Self-demotion protection (admins cannot demote themselves)

**System Monitoring:**
- View total user counts by role
- Access recent user registrations
- Comprehensive admin audit logging

**Security Features:**
- All admin actions are logged with admin identity
- Role-based middleware protection
- JWT tokens include role information
- 403 Forbidden responses for unauthorized access attempts

### Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

Common HTTP status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid or missing token)
- `404` - Not Found (user doesn't exist)
- `409` - Conflict (email already exists)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

#### Rate Limiting Responses

When rate limits are exceeded, the API returns a `429` status with additional information:

```json
{
  "error": "Too many authentication attempts from this IP, please try again after 15 minutes.",
  "retryAfter": 900000
}
```

The `retryAfter` field indicates the time in milliseconds until the limit resets.

## Development

### Available Scripts

**Development:**
- `npm run dev` - Run in development mode with ts-node
- `npm run dev:watch` - Run in development mode with auto-restart
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run the compiled JavaScript

**Database (Local Docker - Optional):**
- `npm run db:up` - Start local MongoDB with Docker Compose
- `npm run db:down` - Stop and remove local MongoDB containers
- `npm run db:logs` - View local MongoDB logs
- `npm run db:admin` - Start MongoDB Express web interface (http://localhost:8081)

*Note: These scripts are only needed if using local Docker instead of MongoDB Atlas*

**Testing:**
- `npm test` - Run comprehensive test suite with Vitest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:api` - Run API endpoint tests with curl
- `npm run test:auth` - Run authentication endpoint tests

**Releases & Commits:**
- `npm run commit` - Interactive commit with conventional commit format
- `npm run release` - Generate new release with automated changelog
- `npm run release:dry-run` - Preview what would be released

### Project Structure

```
src/
├── server.ts              # Main server file
├── config/
│   ├── database.ts        # MongoDB connection configuration
│   └── logger.ts          # Winston logger configuration
├── models/
│   ├── User.ts            # Mongoose User model with auth methods
│   └── User.test.ts       # Unit tests for User model
├── controllers/
│   ├── index.ts           # Controller exports
│   ├── authController.ts  # Authentication controller logic
│   ├── authController.test.ts # Tests for auth controller
│   ├── usersController.ts # Users controller logic
│   ├── usersController.test.ts # Tests for users controller
│   └── adminController.ts # Admin role management controller
├── routes/
│   ├── users.ts           # User API routes (all protected)
│   ├── auth.ts            # Authentication routes
│   └── admin.ts           # Admin-only routes for role management
├── middleware/
│   ├── auth.ts            # JWT authentication middleware
│   ├── requireAdmin.ts    # Admin role authorization middleware
│   ├── requestId.ts       # Request ID generation middleware
│   ├── performance.ts     # Performance monitoring middleware
│   └── rateLimiter.ts     # Rate limiting middleware configurations
├── utils/
│   ├── jwt.ts             # JWT token utilities
│   ├── jwt.test.ts        # Tests for JWT utilities
│   └── logging.ts         # Structured logging utility functions
├── test/
│   ├── setup.ts           # Test environment configuration
│   ├── helpers.ts         # Test helper functions
│   └── health.test.ts     # Health endpoint tests
└── types/
    └── user.ts            # TypeScript type definitions
```

## Logging

The service includes comprehensive structured logging with Winston:

### Log Files
- `logs/combined.log` - All log messages in JSON format
- `logs/error.log` - Error-level messages only
- `logs/exceptions.log` - Uncaught exceptions
- `logs/rejections.log` - Unhandled promise rejections
- `logs/debug.log` - Debug messages (development only)

### Log Features
- **Structured JSON logging** for easy parsing and aggregation
- **Request correlation** with unique request IDs
- **Performance monitoring** with request duration tracking
- **Authentication event logging** with detailed context
- **Database operation logging** with connection status
- **Error tracking** with stack traces and request context
- **Multiple transports** (console, file, error-specific files)

### Environment Configuration
- `LOG_LEVEL` - Set logging level (error, warn, info, debug)
- `LOG_DIR` - Directory for log files (default: logs)
- `NODE_ENV` - Environment affects console logging behavior

## Testing

The service includes a comprehensive test suite built with Vitest:

### Test Coverage
- **Unit Tests** - Model methods, JWT utilities, validation logic
- **Integration Tests** - API endpoints with authentication
- **Controller Tests** - Request/response handling and error cases
- **Authentication Tests** - Registration, login, token validation
- **Database Tests** - Model validation and data persistence

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode during development
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Environment
Tests use an in-memory MongoDB instance for isolation and speed. Each test suite runs in a clean environment with automatic database cleanup.

## Rate Limiting

The service implements comprehensive rate limiting to prevent abuse and ensure service availability:

### Rate Limit Configuration

| Endpoint Category | Limit | Window | Description |
|------------------|-------|--------|--------------|
| Authentication | 5 requests | 15 minutes | Registration, login attempts |
| User Creation | 3 requests | 1 hour | Creating new users via `/api/users` |
| API Users | 100 requests | 15 minutes | All `/api/users/*` endpoints |
| General | 1000 requests | 15 minutes | Global rate limit for all requests |

### Rate Limiting Behavior

- **Per-IP Tracking**: Rate limits are applied per client IP address
- **Request Counting**: All requests count toward limits, including failed ones
- **Sliding Window**: Limits reset after the specified time window
- **Automatic Headers**: Response includes rate limit headers when available
- **Logging**: Rate limit violations are logged with client IP and endpoint

### Rate Limit Headers

When rate limits are enforced, responses may include:

- `X-RateLimit-Limit`: The rate limit ceiling for the endpoint
- `X-RateLimit-Remaining`: Number of requests remaining in the window  
- `X-RateLimit-Reset`: Time when the rate limit window resets
- `Retry-After`: Seconds until the client can retry (on 429 responses)

### Testing Rate Limits

Use the included test script to verify rate limiting:

```bash
# Test authentication rate limiting (5 requests per 15 minutes)
./test_auth_rate_limit.sh
```

The script makes 6 rapid registration requests. The first 5 should succeed (or fail with validation), and the 6th should return a 429 status code.

## Next Steps

1. **Enhanced Validation** - Add request validation with libraries like Joi or Zod
2. **Pagination** - Add pagination for user lists
3. **Search & Filtering** - Add user search and filtering capabilities
4. **Log Aggregation** - Set up ELK Stack or similar for log analysis
5. **Docker** - Add Docker support for the application itself
6. **CI/CD** - Set up GitHub Actions for automated testing and deployment

## Contributing

This project follows conventional commit standards and uses automated changelog generation. See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on:

- Commit message format
- Development workflow  
- Release process
- Code standards

## License

This project is currently unlicensed. All rights reserved.
