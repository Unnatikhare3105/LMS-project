//Backend/src/repositories/syllabus.repository.ts

import mongoose from 'mongoose';
import SyllabusModel, { ISyllabus, IVideoLink, IReferenceLink } from '../models/syllabus.model';

// ─── Reads ────────────────────────────────────────────────────────────────────

export const findSyllabusBySyllabusId = async (syllabusId: string): Promise<ISyllabus | null> => {
  return SyllabusModel.findOne({ syllabusId }).exec();
};

export const findSyllabusByObjectId = async (
  id: string | mongoose.Types.ObjectId
): Promise<ISyllabus | null> => {
  return SyllabusModel.findById(id).exec();
};

export const findSyllabusByUserId = async (
  userId: string
): Promise<ISyllabus[]> => {
  return SyllabusModel.find({ userId })
    .select('syllabusId topic contentType createdAt')
    .sort({ createdAt: -1 })
    .exec();
};

export const findSyllabusByUserAndTopic = async (
  userId: string,
  topic: string
): Promise<ISyllabus | null> => {
  return SyllabusModel.findOne({ userId, topic }).exec();
};

export const searchSyllabusByTopic = async (
  userId: string,
  searchTerm: string
): Promise<ISyllabus[]> => {
  return SyllabusModel.find({
    userId,
    $text: { $search: searchTerm },
  })
    .select('syllabusId topic contentType createdAt')
    .sort({ createdAt: -1 })
    .exec();
};

export const getObjectIdBySyllabusId = async (
  syllabusId: string
): Promise<mongoose.Types.ObjectId | null> => {
  const doc = await SyllabusModel.findOne({ syllabusId }).select('_id').lean().exec();
  return doc ? (doc as any)._id : null;
};

// ─── Writes ───────────────────────────────────────────────────────────────────

export const createTextSyllabus = async (data: {
  userId: string;
  topic: string;
  content: string;
}): Promise<ISyllabus> => {
  return SyllabusModel.create({ ...data, contentType: 'text' });
};

export const createVideoSyllabus = async (data: {
  userId: string;
  topic: string;
  videoLinks: IVideoLink[];
  referenceLinks: IReferenceLink[];
}): Promise<ISyllabus> => {
  return SyllabusModel.create({
    userId: data.userId,
    topic: data.topic,
    content: '',
    videoLinks: data.videoLinks,
    referenceLinks: data.referenceLinks,
    contentType: 'video',
  });
};


export const updateSyllabusContent = async (
  syllabusId: string,
  content: string
): Promise<ISyllabus | null> => {
  return SyllabusModel.findOneAndUpdate(
    { syllabusId },
    { $set: { content } },
    { new: true }
  ).exec();
};

export const deleteSyllabusBySyllabusId = async (syllabusId: string): Promise<boolean> => {
  const result = await SyllabusModel.findOneAndDelete({ syllabusId }).exec();
  return !!result;
};

export const updateSyllabusContentAndType = async (
  syllabusId: string,
  content: string,
  contentType: 'text' | 'both'
): Promise<ISyllabus | null> => {
  return SyllabusModel.findOneAndUpdate(
    { syllabusId },
    { $set: { content, contentType } },
    { new: true }
  ).exec();
};

export const updateSyllabusVideos = async (
  syllabusId: string,
  videoLinks: IVideoLink[],
  referenceLinks: IReferenceLink[],
  contentType: 'video' | 'both'
): Promise<ISyllabus | null> => {
  return SyllabusModel.findOneAndUpdate(
    { syllabusId },
    { $set: { videoLinks, referenceLinks, contentType } },
    { new: true }
  ).exec();
};

export const upsertFullSyllabus = async (data: {
  userId: string;
  topic: string;
  content: string;
  videoLinks: IVideoLink[];
  referenceLinks: IReferenceLink[];
}): Promise<ISyllabus> => {
  return SyllabusModel.findOneAndUpdate(
    { userId: data.userId, topic: data.topic },
    { $set: { content: data.content, videoLinks: data.videoLinks, referenceLinks: data.referenceLinks, contentType: 'both' } },
    { new: true, upsert: true }
  ).exec();
};