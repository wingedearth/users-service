import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createTestApp } from './helpers';

const app = createTestApp();

describe('Health Check', () => {
  it('should return health status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body.status).toBe('OK');
    expect(response.body.service).toBe('users-service');
    expect(response.body.timestamp).toBeDefined();
    expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
  });
});
