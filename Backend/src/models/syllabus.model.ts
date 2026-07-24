// Backend/src/models/syllabus.model.ts
import mongoose, { Document, Model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ContentType } from '../types';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface IVideoLink {
  title: string;
  videoId: string;
  url: string;
  thumbnail: string;
}

export interface IReferenceLink {
  title: string;
  url: string;
  source: string;
}

export interface ISyllabus extends Document {
  syllabusId: string;
  userId: string;
  topic: string;
  content: string;
  videoLinks: IVideoLink[];
  referenceLinks: IReferenceLink[];
  contentType: ContentType;
  createdAt: Date;
  updatedAt: Date;
}



export interface ISyllabusModel extends Model<ISyllabus> { }

// ─── Sub-schema ───────────────────────────────────────────────────────────────


const referenceLinkSchema = new Schema<IReferenceLink>(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    source: { type: String, default: '' },
  },
  { _id: false }
);


const videoLinkSchema = new Schema<IVideoLink>(
  {
    title: { type: String, required: true },
    videoId: { type: String, required: true },
    url: { type: String, required: true },
    thumbnail: { type: String, default: '' },
  },
  { _id: false }
);

// ─── Main schema ──────────────────────────────────────────────────────────────

const syllabusSchema = new Schema<ISyllabus, ISyllabusModel>(
  {
    syllabusId: {
      type: String,
      default: () => uuidv4(),
      unique: true,
      index: true,
    },
    userId: { type: String, ref: 'User', required: true },
    topic: { type: String, required: true, trim: true },
    content: { type: String, default: '' },
    videoLinks: { type: [videoLinkSchema], default: [] },
    referenceLinks: { type: [referenceLinkSchema], default: [] },
    contentType: {
      type: String,
      enum: ['text', 'video', 'both'],
      default: 'text',
    },
  },
  { timestamps: true }
);

// syllabus.model.ts
syllabusSchema.virtual('bookmarkedSyllabus', {
  ref: 'Syllabus',
  localField: 'syllabusId',
  foreignField: 'syllabusId',
  justOne: true,
});

// ─── Indexes ──────────────────────────────────────────────────────────────────

syllabusSchema.index({ userId: 1 });
syllabusSchema.index({ userId: 1, topic: 1 });
syllabusSchema.index({ topic: 'text' });
syllabusSchema.index({ createdAt: -1 });

// ─── Export ───────────────────────────────────────────────────────────────────

const SyllabusModel = mongoose.model<ISyllabus, ISyllabusModel>('Syllabus', syllabusSchema);
export default SyllabusModel;

