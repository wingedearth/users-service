import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createTestApp, createTestUser, createTestUserWithToken, generateUserData, getAuthHeaders } from '../test/helpers';
import UserModel from '../models/User';

const app = createTestApp();

describe('Users Controller', () => {
  describe('GET /api/users', () => {
    it('should return empty array when no users exist', async () => {
      const { token } = await createTestUserWithToken();

      const response = await request(app)
        .get('/api/users')
        .set(getAuthHeaders(token))
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1); // Only the authenticated user
      expect(response.body.count).toBe(1);
    });

    it('should return all users when authenticated', async () => {
      const { token } = await createTestUserWithToken();
      
      // Create additional users
      await createTestUser({ email: 'user2@example.com' });
      await createTestUser({ email: 'user3@example.com' });

      const response = await request(app)
        .get('/api/users')
        .set(getAuthHeaders(token))
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(3);
      expect(response.body.count).toBe(3);
      
      // Verify no passwords are returned
      response.body.data.forEach((user: any) => {
        expect(user.password).toBeUndefined();
      });
    });

    it('should return 401 for missing token', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Access token is required');
    });

    it('should return 401 for invalid token', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid or expired token');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user by ID when authenticated', async () => {
      const { token } = await createTestUserWithToken();
      const targetUser = await createTestUser({ email: 'target@example.com' });

      const response = await request(app)
        .get(`/api/users/${targetUser._id}`)
        .set(getAuthHeaders(token))
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(targetUser.email);
      expect(response.body.data.firstName).toBe(targetUser.firstName);
      expect(response.body.data.lastName).toBe(targetUser.lastName);
      expect(response.body.data.password).toBeUndefined();
    });

    it('should return 404 for non-existent user', async () => {
      const { token } = await createTestUserWithToken();
      const nonExistentId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .get(`/api/users/${nonExistentId}`)
        .set(getAuthHeaders(token))
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('User not found');
    });

    it('should return 400 for invalid user ID format', async () => {
      const { token } = await createTestUserWithToken();

      const response = await request(app)
        .get('/api/users/invalid-id')
        .set(getAuthHeaders(token))
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid user ID');
    });

    it('should return 401 for missing token', async () => {
      const user = await createTestUser({ email: 'unauthorized-get@example.com' });

      const response = await request(app)
        .get(`/api/users/${user._id}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Access token is required');
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user when authenticated', async () => {
      const { token } = await createTestUserWithToken();
      const userData = generateUserData();

      const response = await request(app)
        .post('/api/users')
        .set(getAuthHeaders(token))
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(userData.email);
      expect(response.body.data.firstName).toBe(userData.firstName);
      expect(response.body.data.lastName).toBe(userData.lastName);
      expect(response.body.data.password).toBeUndefined();

      // Verify user was created in database
      const dbUser = await UserModel.findOne({ email: userData.email });
      expect(dbUser).toBeTruthy();
    });

    it('should return 400 for missing required fields', async () => {
      const { token } = await createTestUserWithToken();

      const response = await request(app)
        .post('/api/users')
        .set(getAuthHeaders(token))
        .send({
          email: 'incomplete@example.com'
          // Missing required fields
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('required');
    });

    it('should return 409 for duplicate email', async () => {
      const { token } = await createTestUserWithToken();
      const existingUser = await createTestUser({ email: 'existing@example.com' });

      const response = await request(app)
        .post('/api/users')
        .set(getAuthHeaders(token))
        .send({
          email: existingUser.email,
          firstName: 'Test',
          lastName: 'User',
          password: 'password123'
        })
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('already exists');
    });

    it('should return 401 for missing token', async () => {
      const userData = generateUserData();

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Access token is required');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user when authenticated', async () => {
      const { token } = await createTestUserWithToken();
      const targetUser = await createTestUser({ email: 'update@example.com' });

      const updateData = {
        email: targetUser.email,
        firstName: 'Updated',
        lastName: 'Name',
        phoneNumber: '+9876543210'
      };

      const response = await request(app)
        .put(`/api/users/${targetUser._id}`)
        .set(getAuthHeaders(token))
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.firstName).toBe(updateData.firstName);
      expect(response.body.data.lastName).toBe(updateData.lastName);
      expect(response.body.data.phoneNumber).toBe(updateData.phoneNumber);
      expect(response.body.data.email).toBe(targetUser.email); // Should remain unchanged

      // Verify update in database
      const updatedUser = await UserModel.findById(targetUser._id);
      expect(updatedUser?.firstName).toBe(updateData.firstName);
      expect(updatedUser?.lastName).toBe(updateData.lastName);
    });

    it('should return 404 for non-existent user', async () => {
      const { token } = await createTestUserWithToken();
      const nonExistentId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .put(`/api/users/${nonExistentId}`)
        .set(getAuthHeaders(token))
        .send({
          email: 'nonexistent@example.com',
          firstName: 'Updated',
          lastName: 'Name'
        })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('User not found');
    });

    it('should return 400 for invalid user ID format', async () => {
      const { token } = await createTestUserWithToken();

      const response = await request(app)
        .put('/api/users/invalid-id')
        .set(getAuthHeaders(token))
        .send({
          email: 'invalid@example.com',
          firstName: 'Updated',
          lastName: 'Name'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid user ID');
    });

    it('should return 401 for missing token', async () => {
      const user = await createTestUser({ email: 'unauthorized-put@example.com' });

      const response = await request(app)
        .put(`/api/users/${user._id}`)
        .send({
          email: 'unauthorized@example.com',
          firstName: 'Updated',
          lastName: 'Name'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Access token is required');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user when authenticated', async () => {
      const { token } = await createTestUserWithToken();
      const targetUser = await createTestUser({ email: 'delete@example.com' });

      const response = await request(app)
        .delete(`/api/users/${targetUser._id}`)
        .set(getAuthHeaders(token))
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted successfully');
      expect(response.body.data.email).toBe(targetUser.email);

      // Verify user was deleted from database
      const deletedUser = await UserModel.findById(targetUser._id);
      expect(deletedUser).toBeNull();
    });

    it('should return 404 for non-existent user', async () => {
      const { token } = await createTestUserWithToken();
      const nonExistentId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .delete(`/api/users/${nonExistentId}`)
        .set(getAuthHeaders(token))
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('User not found');
    });

    it('should return 400 for invalid user ID format', async () => {
      const { token } = await createTestUserWithToken();

      const response = await request(app)
        .delete('/api/users/invalid-id')
        .set(getAuthHeaders(token))
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid user ID');
    });

    it('should return 401 for missing token', async () => {
      const user = await createTestUser({ email: 'unauthorized-delete@example.com' });

      const response = await request(app)
        .delete(`/api/users/${user._id}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Access token is required');
    });
  });
});
