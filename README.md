# Users Service

A REST API service for managing users, built with Node.js, Express, and TypeScript.

## Features

- ✅ Full CRUD operations for users
- ✅ TypeScript for type safety
- ✅ Express.js web framework
- ✅ Input validation
- ✅ Error handling
- ✅ Health check endpoint
- ✅ CORS enabled
- ✅ Security headers with Helmet
- ✅ Request logging with Morgan

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/wingedearth/users-service.git
cd users-service

# Install dependencies
npm install

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

- `npm run dev` - Run in development mode with ts-node
- `npm run dev:watch` - Run in development mode with auto-restart
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run the compiled JavaScript
- `npm test` - Run tests (not implemented yet)

### Project Structure

```
src/
├── server.ts          # Main server file
├── routes/
│   └── users.ts       # User routes
└── types/
    └── user.ts        # TypeScript type definitions
```

## Next Steps

1. **Database Integration** - Replace in-memory storage with a real database (PostgreSQL, MongoDB, etc.)
2. **Authentication** - Add JWT-based authentication
3. **Validation** - Add proper request validation with libraries like Joi or Zod
4. **Testing** - Add unit and integration tests
5. **Docker** - Add Docker support for containerization
6. **CI/CD** - Set up GitHub Actions for automated testing and deployment

## License

This project is currently unlicensed. All rights reserved.
