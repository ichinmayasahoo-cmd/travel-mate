import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);
  res.json({ favorites: user?.favorites || [] });
});

export const addFavorite = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.userId, { $addToSet: { favorites: req.params.id } }, { new: true });
  res.json({ favorites: user?.favorites || [] });
});

export const removeFavorite = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.userId, { $pull: { favorites: req.params.id } }, { new: true });
  res.json({ favorites: user?.favorites || [] });
});
