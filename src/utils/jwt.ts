import jwt, { SignOptions } from 'jsonwebtoken';

interface JWTPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const payload = { userId };
  const options: any = { 
    expiresIn: expiresIn 
  };
  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string): JWTPayload => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.verify(token, secret) as JWTPayload;
};
