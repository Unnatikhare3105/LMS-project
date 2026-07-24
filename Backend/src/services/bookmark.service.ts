//backend/src/services/bookmark.service.ts


import CustomError from '../utils/customError';
import * as bookmarkRepo from '../repositories/bookmark.repository';
import * as syllabusRepo from '../repositories/syllabus.repository';
import { IBookmark } from '../models/bookmark.model';

export const addBookmark = async (
  userId: string,
  syllabusPublicId: string,
  note?: string
): Promise<IBookmark> => {
  const syllabus = await syllabusRepo.findSyllabusBySyllabusId(syllabusPublicId);
  if (!syllabus) throw new CustomError('Topic not found.', 404);

  const existing = await bookmarkRepo.findBookmark(userId, syllabusPublicId);
  if (existing) throw new CustomError('Already bookmarked.', 409);

  return bookmarkRepo.createBookmark({
    userId,
    syllabusId: syllabusPublicId,
    topic: syllabus.topic,
    note,
  });
};

export const getBookmarks = async (userId: string): Promise<IBookmark[]> => {
  return bookmarkRepo.findBookmarksByUserId(userId);
};

export const removeBookmark = async (publicId: string, userId: string): Promise<void> => {
  const deleted = await bookmarkRepo.deleteBookmarkByBookmarkId(publicId, userId);
  if (!deleted) throw new CustomError('Bookmark not found.', 404);
};

export const updateNote = async (
  publicId: string,
  userId: string,
  note: string
): Promise<IBookmark> => {
  const updated = await bookmarkRepo.updateBookmarkNote(publicId, userId, note);
  if (!updated) throw new CustomError('Bookmark not found.', 404);
  return updated;
};