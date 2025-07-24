# Users Service

A REST API service for managing users, built with Node.js, Express, and TypeScript.

## Features

- ✅ Full CRUD operations for users
- ✅ TypeScript for type safety
- ✅ Express.js web framework
- ✅ MongoDB database with Mongoose ODM
- ✅ Input validation and data modeling
- ✅ Comprehensive error handling
- ✅ Health check endpoint
- ✅ CORS enabled
- ✅ Security headers with Helmet
- ✅ Request logging with Morgan
- ✅ Docker Compose for development
- ✅ MongoDB Express admin interface

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm
- Docker and Docker Compose

### Installation

```bash
# Clone the repository
git clone https://github.com/wingedearth/users-service.git
cd users-service

# Install dependencies
npm install

# Start MongoDB database
npm run db:up

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
MONGODB_URI=mongodb://app-user:app-password@localhost:27017/users-service
DB_NAME=users-service
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

### Users API

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
  "firstName": "Jane",
  "lastName": "Smith"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "email": "jane.smith@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
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
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
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
- `404` - Not Found (user doesn't exist)
- `409` - Conflict (email already exists)
- `500` - Internal Server Error

## Development

### Available Scripts

**Development:**
- `npm run dev` - Run in development mode with ts-node
- `npm run dev:watch` - Run in development mode with auto-restart
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run the compiled JavaScript

**Database:**
- `npm run db:up` - Start MongoDB with Docker Compose
- `npm run db:down` - Stop and remove MongoDB containers
- `npm run db:logs` - View MongoDB logs
- `npm run db:admin` - Start MongoDB Express web interface (http://localhost:8081)

**Testing:**
- `npm test` - Run tests (not implemented yet)
- `npm run test:api` - Run API endpoint tests with curl

### Project Structure

```
src/
├── server.ts          # Main server file
├── config/
│   └── database.ts    # MongoDB connection configuration
├── models/
│   └── User.ts        # Mongoose User model
├── routes/
│   └── users.ts       # User API routes
└── types/
    └── user.ts        # TypeScript type definitions
```

## Next Steps

1. **Authentication** - Add JWT-based authentication
2. **Enhanced Validation** - Add request validation with libraries like Joi or Zod
3. **Testing** - Add unit and integration tests
4. **Logging** - Enhanced logging with Winston or similar
5. **Rate Limiting** - Add API rate limiting
6. **Pagination** - Add pagination for user lists
7. **Search & Filtering** - Add user search and filtering capabilities
8. **Docker** - Add Docker support for the application itself
9. **CI/CD** - Set up GitHub Actions for automated testing and deployment

## License

This project is currently unlicensed. All rights reserved.
