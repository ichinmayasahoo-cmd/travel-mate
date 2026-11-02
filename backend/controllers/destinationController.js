import Destination from '../models/Destination.js';
import { destinations } from '../data/destinations.js';
import { isDbReady } from '../config/db.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const clean = ({ _id, __v, slug, createdAt, updatedAt, ...rest }) => ({ id: slug, ...rest });

async function load() {
  if (isDbReady()) {
    const docs = await Destination.find().lean();
    if (docs.length) return docs.map(clean);
  }
  return destinations;
}

export const listDestinations = asyncHandler(async (req, res) => {
  res.json({ destinations: await load() });
});

export const getDestination = asyncHandler(async (req, res) => {
  const found = (await load()).find((d) => d.id === req.params.id);
  if (!found) return res.status(404).json({ message: 'Destination not found.' });
  res.json({ destination: found });
});
