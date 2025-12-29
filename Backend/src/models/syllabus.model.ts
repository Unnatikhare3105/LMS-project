// Backend/src/models/syllabus.model.ts
import mongoose, { Document } from 'mongoose';

export interface ISyllabus extends Document {
  userId: mongoose.Types.ObjectId;
  topic: string;
  content: any; // या proper type अगर पता हो
}
const syllabusSchema = new mongoose.Schema<ISyllabus>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    topic: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Database Indexes for better query performance
syllabusSchema.index({ userId: 1 }); // Find syllabus by user
syllabusSchema.index({ topic: 1 }); // Find by topic
syllabusSchema.index({ userId: 1, topic: 1 }); // Compound index
syllabusSchema.index({ topic: 'text' }); // Text search on topic
syllabusSchema.index({ createdAt: -1 }); // Sort by newest

const SyllabusModel = mongoose.model<ISyllabus>('Syllabus', syllabusSchema);

export default SyllabusModel;