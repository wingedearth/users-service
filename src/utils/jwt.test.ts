import { describe, it, expect, beforeEach, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import { generateToken, verifyToken } from './jwt';

describe('JWT Utils', () => {
  beforeEach(() => {
    // Environment variables are already set in setup.ts
    // Just ensure they're available for this test
    if (!process.env.JWT_SECRET) {
      process.env.JWT_SECRET = 'test-secret-key';
    }
    if (!process.env.JWT_EXPIRES_IN) {
      process.env.JWT_EXPIRES_IN = '1h';
    }
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateToken(userId);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      
      // Verify the token can be decoded
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      expect(decoded.userId).toBe(userId);
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeDefined();
    });

    it('should generate different tokens for different user IDs', () => {
      const userId1 = '507f1f77bcf86cd799439011';
      const userId2 = '507f1f77bcf86cd799439012';
      
      const token1 = generateToken(userId1);
      const token2 = generateToken(userId2);

      expect(token1).not.toBe(token2);
    });

    it('should include expiration in token', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateToken(userId);
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      expect(decoded.exp).toBeGreaterThan(decoded.iat);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateToken(userId);
      
      const decoded = verifyToken(token);
      
      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(userId);
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';
      
      expect(() => verifyToken(invalidToken)).toThrow();
    });

    it('should throw error for malformed token', () => {
      const malformedToken = 'not-a-token';
      
      expect(() => verifyToken(malformedToken)).toThrow();
    });

    it('should throw error for token with wrong secret', () => {
      // Generate token with different secret
      const userId = '507f1f77bcf86cd799439011';
      const tokenWithWrongSecret = jwt.sign(
        { userId },
        'wrong-secret',
        { expiresIn: '1h' }
      );
      
      expect(() => verifyToken(tokenWithWrongSecret)).toThrow();
    });

    it('should throw error for expired token', () => {
      const userId = '507f1f77bcf86cd799439011';
      const expiredToken = jwt.sign(
        { userId },
        process.env.JWT_SECRET!,
        { expiresIn: '-1h' } // Expired 1 hour ago
      );
      
      expect(() => verifyToken(expiredToken)).toThrow();
    });
  });
});
