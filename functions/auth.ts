import { VercelRequest, VercelResponse, VercelApiHandler } from '@vercel/node';
import * as jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY || ''

export const authenticateToken = async (req: VercelRequest, res: VercelResponse) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'token_missing' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return (decoded as any).userId;
  } catch (error) {
    return res.status(403).json({ error: 'invalid_token' });
  }
};
