import mongoose from 'mongoose';

const courtSchema = new mongoose.Schema({
    name: { type: String, required: true },
    venue: { type: mongoose.Schema.Types.ObjectId, ref: 'venue', required: true },
    sportType: { type: String, required: true },
    pricePerHour: { type: Number, required: true },
    operatingHours: {
        start: { type: String, required: true }, // e.g., "08:00"
        end: { type: String, required: true }, // e.g., "22:00"
    },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'booking' }],
    // Add time slot management fields if needed, or handle in a separate model as suggested by the PDF 
}, { timestamps: true });

const courtModel = mongoose.models.court || mongoose.model('court', courtSchema);
export default courtModel; 
