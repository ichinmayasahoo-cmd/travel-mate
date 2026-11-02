import jwt from 'jsonwebtoken';
import crypto from 'crypto';

let fallbackSecret;
export function getSecret() {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (!fallbackSecret) {
    fallbackSecret = crypto.randomBytes(32).toString('hex');
    console.warn('⚠️  JWT_SECRET not set. Using a temporary secret (logins reset on restart). Copy .env.example to .env.');
  }
  return fallbackSecret;
}

export function protect(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Please log in to continue.' });
  try {
    req.userId = jwt.verify(token, getSecret()).id;
    next();
  } catch {
    res.status(401).json({ message: 'Your session has expired. Please log in again.' });
  }
}
