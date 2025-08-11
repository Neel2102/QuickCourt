import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    targetType: { type: String, enum: ['user', 'venue', 'booking'], required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    reason: { type: String, trim: true },
    status: { type: String, enum: ['open', 'in_review', 'resolved'], default: 'open' },
    actionNote: { type: String, trim: true },
  },
  { timestamps: true }
);

const reportModel = mongoose.models.report || mongoose.model('report', reportSchema);
export default reportModel;


