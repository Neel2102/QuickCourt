import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    venue: { type: mongoose.Schema.Types.ObjectId, ref: 'venue', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, trim: true, maxlength: 500 },
}, { timestamps: true });

const reviewModel = mongoose.models.review || mongoose.model('review', reviewSchema);
export default reviewModel; 
