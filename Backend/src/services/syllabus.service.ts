//Backend/src/services/syllabus.service.ts

import CustomError from '../utils/customError';
import * as syllabusRepo from '../repositories/syllabus.repository';
import * as userRepo from '../repositories/user.repository';
import * as aiService from './ai.service';
import { ISyllabus } from '../models/syllabus.model';

// ─── Generate full content (text + video) ───────────────────────────────────────

export const generateFullContent = async ({ topic, userId }: { topic: string; userId: string }): Promise<ISyllabus> => {
  const existing = await syllabusRepo.findSyllabusByUserAndTopic(userId, topic);
  if (existing && existing.content && existing.videoLinks?.length) return existing;

  const [content, videos, references] = await Promise.all([
    aiService.getDetailedExplanation(topic),
    aiService.getVideoLinks(topic),
    aiService.getReferenceLinks(topic),
  ]);
  if (!content) throw new CustomError('AI returned no content.', 500);
  if (!videos || videos.length === 0) throw new CustomError('No videos found for this topic.', 404);

  const syllabus = await syllabusRepo.upsertFullSyllabus({ userId, topic, content, videoLinks: videos, referenceLinks: references });

  userRepo.recordActivity(userId).catch(() => {});
  userRepo.incrementTopicCount(userId).catch(() => {});
  return syllabus;
};
// ─── Generate text content ────────────────────────────────────────────────────

export const generateContentAsText = async ({ topic, userId }: { topic: string; userId: string }): Promise<ISyllabus> => {
  const existing = await syllabusRepo.findSyllabusByUserAndTopic(userId, topic);
  if (existing && existing.content) return existing;

  const content = await aiService.getDetailedExplanation(topic);
  if (!content) throw new CustomError('AI returned no content.', 500);

  let syllabus: ISyllabus;
  if (existing) {
    const newType = existing.videoLinks?.length ? 'both' : 'text';
    const updated = await syllabusRepo.updateSyllabusContentAndType(existing.syllabusId, content, newType);
    if (!updated) throw new CustomError('Failed to update syllabus.', 500);
    syllabus = updated;
  } else {
    syllabus = await syllabusRepo.createTextSyllabus({ userId, topic, content });
  }

  userRepo.recordActivity(userId).catch(() => {});
  userRepo.incrementTopicCount(userId).catch(() => {});
  return syllabus;
};

// ─── Generate video content ───────────────────────────────────────────────────

export const generateContentAsVideo = async ({ topic, userId }: { topic: string; userId: string }): Promise<ISyllabus> => {
  const existing = await syllabusRepo.findSyllabusByUserAndTopic(userId, topic);
  if (existing && existing.videoLinks?.length) return existing;

  const [videos, references] = await Promise.all([
    aiService.getVideoLinks(topic),
    aiService.getReferenceLinks(topic),
  ]);
  if (!videos || videos.length === 0) throw new CustomError('No videos found for this topic.', 404);

  let syllabus: ISyllabus;
  if (existing) {
    const newType = existing.content ? 'both' : 'video';
    const updated = await syllabusRepo.updateSyllabusVideos(existing.syllabusId, videos, references, newType);
    if (!updated) throw new CustomError('Failed to update syllabus.', 500);
    syllabus = updated;
  } else {
    syllabus = await syllabusRepo.createVideoSyllabus({ userId, topic, videoLinks: videos, referenceLinks: references });
  }

  userRepo.recordActivity(userId).catch(() => {});
  userRepo.incrementTopicCount(userId).catch(() => {});
  return syllabus;
};

// ─── Reads ────────────────────────────────────────────────────────────────────

export const getAllTopics = async (userId: string): Promise<ISyllabus[]> => {
  const topics = await syllabusRepo.findSyllabusByUserId(userId);
  if (!topics.length) throw new CustomError('No topics found.', 404);
  return topics;
};

export const getSyllabusByPublicId = async (publicId: string, userId: string): Promise<ISyllabus> => {
  const syllabus = await syllabusRepo.findSyllabusBySyllabusId(publicId);
  if (!syllabus) throw new CustomError('Syllabus not found.', 404);
  if (syllabus.userId.toString() !== userId) throw new CustomError('Forbidden.', 403);
  return syllabus;
};

// ─── Mutations ────────────────────────────────────────────────────────────────

export const updateSyllabusContent = async (
  publicId: string,
  content: string,
  userId: string
): Promise<ISyllabus> => {
  const existing = await syllabusRepo.findSyllabusBySyllabusId(publicId);
  if (!existing) throw new CustomError('Syllabus not found.', 404);
  if (existing.userId.toString() !== userId) throw new CustomError('Forbidden.', 403);

  const updated = await syllabusRepo.updateSyllabusContent(publicId, content);
  if (!updated) throw new CustomError('Syllabus not found or update failed.', 404);
  return updated;
};

export const deleteSyllabus = async (publicId: string, userId: string): Promise<void> => {
  const existing = await syllabusRepo.findSyllabusBySyllabusId(publicId);
  if (!existing) throw new CustomError('Syllabus not found.', 404);
  if (existing.userId.toString() !== userId) throw new CustomError('Forbidden.', 403);

  const deleted = await syllabusRepo.deleteSyllabusBySyllabusId(publicId);
  if (!deleted) throw new CustomError('Syllabus not found.', 404);
};