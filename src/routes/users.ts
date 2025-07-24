import express, { Request, Response } from 'express';
import { User, CreateUserRequest, UpdateUserRequest, ApiResponse } from '../types/user';

const router = express.Router();

// In-memory storage for now (replace with database later)
let users: User[] = [
  {
    id: 1,
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    email: 'jane.smith@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let nextId = 3;

// GET /api/users - Get all users
router.get('/', (req: Request, res: Response<ApiResponse<User[]>>) => {
  res.json({
    success: true,
    data: users,
    count: users.length
  });
});

// GET /api/users/:id - Get user by ID
router.get('/:id', (req: Request, res: Response<ApiResponse<User>>) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  return res.json({
    success: true,
    data: user
  });
});

// POST /api/users - Create new user
router.post('/', (req: Request<{}, ApiResponse<User>, CreateUserRequest>, res: Response<ApiResponse<User>>) => {
  const { email, firstName, lastName } = req.body;
  
  // Basic validation
  if (!email || !firstName || !lastName) {
    return res.status(400).json({
      success: false,
      error: 'Email, firstName, and lastName are required'
    });
  }
  
  // Check if email already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({
      success: false,
      error: 'User with this email already exists'
    });
  }
  
  const newUser: User = {
    id: nextId++,
    email,
    firstName,
    lastName,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  users.push(newUser);
  
  return res.status(201).json({
    success: true,
    data: newUser
  });
});

// PUT /api/users/:id - Update user
router.put('/:id', (req: Request<{ id: string }, ApiResponse<User>, UpdateUserRequest>, res: Response<ApiResponse<User>>) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  const { email, firstName, lastName } = req.body;
  
  // Basic validation
  if (!email || !firstName || !lastName) {
    return res.status(400).json({
      success: false,
      error: 'Email, firstName, and lastName are required'
    });
  }
  
  // Check if email already exists (but not for the current user)
  const existingUser = users.find(u => u.email === email && u.id !== id);
  if (existingUser) {
    return res.status(409).json({
      success: false,
      error: 'User with this email already exists'
    });
  }
  
  users[userIndex] = {
    ...users[userIndex],
    email,
    firstName,
    lastName,
    updatedAt: new Date().toISOString()
  };
  
  return res.json({
    success: true,
    data: users[userIndex]
  });
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', (req: Request, res: Response<ApiResponse<User>>) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  const deletedUser = users.splice(userIndex, 1)[0];
  
  return res.json({
    success: true,
    message: 'User deleted successfully',
    data: deletedUser
  });
});

export default router;
