//backend/src/controllers/bookmark.controller.ts

import { Request, Response, NextFunction } from 'express';
import CustomError from '../utils/customError';
import * as bookmarkService from '../services/bookmark.service';

export const addBookmarkController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { syllabusId } = req.params; // UUID
    const { note } = req.body;

    if (!syllabusId) return next(new CustomError('Syllabus ID is required.', 400));

    const bookmark = await bookmarkService.addBookmark(
      req.user.userId,
      syllabusId,
      note
    );

    res.status(201).json({
      success: true,
      message: 'Bookmarked successfully.',
      data: {
        bookmarkId: bookmark.bookmarkId,
        topic: bookmark.topic,
        note: bookmark.note,
        createdAt: bookmark.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getBookmarksController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const bookmarks = await bookmarkService.getBookmarks(req.user.userId);
    res.status(200).json({ success: true, data: bookmarks });
  } catch (error) {
    next(error);
  }
};

export const updateBookmarkNoteController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { bookmarkId } = req.params; // UUID
    const { note } = req.body;

    if (!bookmarkId) return next(new CustomError('Bookmark ID is required.', 400));
    if (note === undefined) return next(new CustomError('Note is required.', 400));

    const updated = await bookmarkService.updateNote(
      bookmarkId,
      req.user.userId,
      note
    );

    res.status(200).json({ success: true, message: 'Note updated.', data: updated });
  } catch (error) {
    next(error);
  }
};

export const removeBookmarkController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { bookmarkId } = req.params; // UUID
    if (!bookmarkId) return next(new CustomError('Bookmark ID is required.', 400));

    await bookmarkService.removeBookmark(bookmarkId, req.user.userId);
    res.status(200).json({ success: true, message: 'Bookmark removed.' });
  } catch (error) {
    next(error);
  }
};