import { isDbReady } from '../config/db.js';

export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export const requireDb = (req, res, next) => {
  if (!isDbReady()) return res.status(503).json({ message: 'Database not connected. Running in demo mode.', demo: true });
  next();
};

export const notFound = (req, res) => res.status(404).json({ message: `Route not found: ${req.originalUrl}` });

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(', ') });
  }
  res.status(err.status || 500).json({ message: err.message || 'Something went wrong on the server.' });
};
