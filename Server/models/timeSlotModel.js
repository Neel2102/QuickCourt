import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema({
    court: { type: mongoose.Schema.Types.ObjectId, ref: 'court', required: true },
    date: { type: Date, required: true },
    slots: [{
        startTime: { type: String, required: true }, // e.g., "08:00"
        endTime: { type: String, required: true }, // e.g., "09:00"
        isBooked: { type: Boolean, default: false },
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'booking', default: null }
    }],
}, { timestamps: true });

const timeSlotModel = mongoose.models.timeSlot || mongoose.model('timeSlot', timeSlotSchema);
export default timeSlotModel; 
