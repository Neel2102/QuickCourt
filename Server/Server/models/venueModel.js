import mongoose from 'mongoose';

const venueSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
    },
    sportTypes: [{ type: String, required: true }],
    amenities: [{ type: String }],
    photos: [{ type: String }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    isApproved: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    numberOfReviews: { type: Number, default: 0 },
}, { timestamps: true });

const venueModel = mongoose.models.venue || mongoose.model('venue', venueSchema);
export default venueModel; 
