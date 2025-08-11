import mongoose from 'mongoose';
const syllabusSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    topic: {
      type: String,
      required: true
    },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }},
  {
    timestamps: true
});

const syllabusModel = mongoose.model('Syllabus', syllabusSchema);
export default syllabusModel;