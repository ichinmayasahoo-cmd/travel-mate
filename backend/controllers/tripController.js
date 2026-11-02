import Trip from '../models/Trip.js';
import { generateItinerary } from '../data/itinerary.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const generate = asyncHandler(async (req, res) => {
  const b = req.body || {};
  if (!String(b.destination || '').trim()) return res.status(400).json({ message: 'Please enter a destination.' });
  if (!b.startDate || !b.endDate) return res.status(400).json({ message: 'Please choose travel dates.' });
  if (new Date(b.endDate) < new Date(b.startDate)) return res.status(400).json({ message: 'End date must be after the start date.' });
  res.json({ itinerary: generateItinerary(b) });
});

export const createTrip = asyncHandler(async (req, res) => {
  const { startingLocation, destination, startDate, endDate, travelers, budget, preference, itinerary } = req.body;
  const trip = await Trip.create({
    user: req.userId, startingLocation, destination, startDate, endDate, travelers, budget, preference, itinerary
  });
  res.status(201).json({ trip });
});

export const listTrips = asyncHandler(async (req, res) => {
  res.json({ trips: await Trip.find({ user: req.userId }).sort('-createdAt') });
});

export const deleteTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!trip) return res.status(404).json({ message: 'Trip not found.' });
  res.json({ message: 'Trip deleted.' });
});
