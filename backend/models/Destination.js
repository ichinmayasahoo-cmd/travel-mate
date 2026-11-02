import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    region: String,
    country: { type: String, required: true },
    description: String,
    image: String,
    category: { type: String, enum: ['Beach', 'Mountain', 'Adventure', 'Historical', 'Religious', 'Nature'] },
    tags: [String],
    budget: Number,
    rating: Number,
    popularity: Number
  },
  { strict: false, timestamps: true }
);

export default mongoose.model('Destination', destinationSchema);
