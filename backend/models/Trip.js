import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    startingLocation: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    travelers: { type: Number, required: true, min: 1 },
    budget: { type: Number, required: true, min: 0 },
    preference: { type: String, default: 'Standard' },
    itinerary: { type: mongoose.Schema.Types.Mixed, required: true }
  },
  { timestamps: true }
);
tripSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Trip', tripSchema);
