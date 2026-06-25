import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'cet4-learning-secret-key-change-in-production';

export interface AuthRequest extends Request {
  userId?: string;
  body: Record<string, unknown>;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = (req.headers as Record<string, string>)?.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    req.userId = 'demo-user';
    return next();
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch {
    req.userId = 'demo-user';
    next();
  }
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
};

export { JWT_SECRET };
