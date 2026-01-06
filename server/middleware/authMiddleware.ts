import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
export interface UserPayload {
  id: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return; // important: return void here
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
   

       if (typeof decoded === 'string') {
      // unexpected, reject token
      res.status(403).json({ message: 'Invalid token payload' });
      return;
    }
     req.user = decoded as UserPayload; 
    next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    res.status(403).json({ message: 'Forbidden: Invalid token' });
    return; // return after sending response
  }
};
