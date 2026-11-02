import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getSecret } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const sign = (id) => jwt.sign({ id }, getSecret(), { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, favorites: u.favorites || [] });
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const register = asyncHandler(async (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  if (name.length < 2) return res.status(400).json({ message: 'Name must be at least 2 characters.' });
  if (!emailRe.test(email)) return res.status(400).json({ message: 'Please enter a valid email address.' });
  if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  if (await User.findOne({ email })) return res.status(409).json({ message: 'An account with this email already exists.' });
  const user = await User.create({ name, email, password });
  res.status(201).json({ token: sign(user._id), user: publicUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  if (!emailRe.test(email) || !password) return res.status(400).json({ message: 'Email and password are required.' });
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }
  res.json({ token: sign(user._id), user: publicUser(user) });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(401).json({ message: 'Account not found. Please log in again.' });
  res.json({ user: publicUser(user) });
});
