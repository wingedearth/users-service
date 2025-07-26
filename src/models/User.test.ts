import { describe, it, expect, beforeEach } from 'vitest';
import UserModel from './User';

describe('User Model', () => {
  describe('User Creation', () => {
    it('should create a user with required fields', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };

      const user = new UserModel(userData);
      await user.save();

      expect(user.email).toBe(userData.email);
      expect(user.firstName).toBe(userData.firstName);
      expect(user.lastName).toBe(userData.lastName);
      expect(user.password).not.toBe(userData.password); // Should be hashed
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it('should create a user with optional phone and address fields', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+1234567890',
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345',
          country: 'USA'
        }
      };

      const user = new UserModel(userData);
      await user.save();

      expect(user.phoneNumber).toBe(userData.phoneNumber);
      expect(user.address?.street).toBe(userData.address.street);
      expect(user.address?.city).toBe(userData.address.city);
      expect(user.address?.state).toBe(userData.address.state);
      expect(user.address?.zipCode).toBe(userData.address.zipCode);
      expect(user.address?.country).toBe(userData.address.country);
    });
  });

  describe('User Validation', () => {
    it('should require email field', async () => {
      const userData = {
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };

      const user = new UserModel(userData);
      
      await expect(user.save()).rejects.toThrow();
    });

    it('should require password field', async () => {
      const userData = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe'
      };

      const user = new UserModel(userData);
      
      await expect(user.save()).rejects.toThrow();
    });

    it('should require firstName field', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        lastName: 'Doe'
      };

      const user = new UserModel(userData);
      
      await expect(user.save()).rejects.toThrow();
    });

    it('should require lastName field', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John'
      };

      const user = new UserModel(userData);
      
      await expect(user.save()).rejects.toThrow();
    });

    it('should validate email format', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };

      const user = new UserModel(userData);
      
      await expect(user.save()).rejects.toThrow();
    });

    it('should enforce unique email constraint', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };

      // Create first user
      const user1 = new UserModel(userData);
      await user1.save();

      // Try to create second user with same email
      const user2 = new UserModel(userData);
      
      await expect(user2.save()).rejects.toThrow();
    });

    it('should validate password minimum length', async () => {
      const userData = {
        email: 'test@example.com',
        password: '123', // Too short
        firstName: 'John',
        lastName: 'Doe'
      };

      const user = new UserModel(userData);
      
      await expect(user.save()).rejects.toThrow();
    });
  });

  describe('Password Hashing', () => {
    it('should hash password before saving', async () => {
      const plainPassword = 'password123';
      const userData = {
        email: 'test@example.com',
        password: plainPassword,
        firstName: 'John',
        lastName: 'Doe'
      };

      const user = new UserModel(userData);
      await user.save();

      expect(user.password).not.toBe(plainPassword);
      expect(user.password).toMatch(/^\$2[ayb]\$.{56}$/); // bcrypt hash pattern
    });

    it('should not rehash password on update if not changed', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };

      const user = new UserModel(userData);
      await user.save();
      
      const originalHash = user.password;
      
      // Update other field
      user.firstName = 'Jane';
      await user.save();

      expect(user.password).toBe(originalHash);
    });

    it('should rehash password if changed', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };

      const user = new UserModel(userData);
      await user.save();
      
      const originalHash = user.password;
      
      // Change password
      user.password = 'newpassword123';
      await user.save();

      expect(user.password).not.toBe(originalHash);
    });
  });

  describe('User Methods', () => {
    it('should compare password correctly', async () => {
      const plainPassword = 'password123';
      const userData = {
        email: 'test@example.com',
        password: plainPassword,
        firstName: 'John',
        lastName: 'Doe'
      };

      const user = new UserModel(userData);
      await user.save();

      const isMatch = await user.comparePassword(plainPassword);
      expect(isMatch).toBe(true);

      const isWrongMatch = await user.comparePassword('wrongpassword');
      expect(isWrongMatch).toBe(false);
    });

    it('should convert to JSON without password', () => {
      const user = new UserModel({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      });

      const json = user.toJSON();
      
      expect(json.password).toBeUndefined();
      expect(json.email).toBe('test@example.com');
      expect(json.firstName).toBe('John');
      expect(json.lastName).toBe('Doe');
    });
  });
});
