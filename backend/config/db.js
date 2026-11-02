import mongoose from 'mongoose';
import Destination from '../models/Destination.js';
import User from '../models/User.js';
import { destinations } from '../data/destinations.js';

export const isDbReady = () => mongoose.connection.readyState === 1;

async function seed() {
  if ((await Destination.countDocuments()) === 0) {
    await Destination.insertMany(destinations.map(({ id, ...rest }) => ({ ...rest, slug: id })));
    console.log('🌱 Seeded destinations');
  }
  if (!(await User.findOne({ email: 'demo@travelmate.com' }))) {
    await User.create({ name: 'Demo Traveler', email: 'demo@travelmate.com', password: 'Demo@123' });
    console.log('🌱 Created demo user (demo@travelmate.com / Demo@123)');
  }
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/travelmate';
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
    console.log('✅ MongoDB connected');
    await seed();
  } catch (err) {
    console.warn(
      `⚠️  MongoDB not available (${err.message}).\n   Running in DEMO MODE: the website still works with built-in data and localStorage.`
    );
  }
}
