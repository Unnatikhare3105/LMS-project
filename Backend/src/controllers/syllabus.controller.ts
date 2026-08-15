//Backend/src/controllers/syllabus.controller.ts

import { Request, Response, NextFunction } from 'express';
import CustomError from '../utils/customError';
import * as syllabusService from '../services/syllabus.service';

export const generateFullController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { topic } = req.body;
    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return next(new CustomError('Topic is required.', 400));
    }

    const syllabus = await syllabusService.generateFullContent({
      topic: topic.trim(),
      userId: req.user.userId,
    });

    res.status(200).json({
      success: true,
      message: 'Content generated successfully.',
      data: {
        syllabusId: syllabus.syllabusId,
        topic: syllabus.topic,
        content: syllabus.content,
        videoLinks: syllabus.videoLinks,
        referenceLinks: syllabus.referenceLinks,
        contentType: syllabus.contentType,
        createdAt: syllabus.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const generateTextController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { topic } = req.body;
    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return next(new CustomError('Topic is required.', 400));
    }

    const syllabus = await syllabusService.generateContentAsText({
      topic: topic.trim(),
      userId: req.user.userId,
    });

    res.status(200).json({
      success: true,
      message: 'Content generated successfully.',
      data: {
        syllabusId: syllabus.syllabusId,
        topic: syllabus.topic,
        content: syllabus.content,
        videoLinks: syllabus.videoLinks,
        referenceLinks: syllabus.referenceLinks,
        contentType: syllabus.contentType,
        createdAt: syllabus.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const generateVideoController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { topic } = req.body;
    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return next(new CustomError('Topic is required.', 400));
    }

    const syllabus = await syllabusService.generateContentAsVideo({
      topic: topic.trim(),
      userId: req.user.userId,
    });

    res.status(200).json({
      success: true,
      message: 'Content generated successfully.',
      data: {
        syllabusId: syllabus.syllabusId,
        topic: syllabus.topic,
        content: syllabus.content,
        videoLinks: syllabus.videoLinks,
        referenceLinks: syllabus.referenceLinks,
        contentType: syllabus.contentType,
        createdAt: syllabus.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTopicsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const topics = await syllabusService.getAllTopics(req.user._id.toString());
    res.status(200).json({ success: true, data: topics });
  } catch (error) {
    next(error);
  }
};

export const getSyllabusByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { syllabusId } = req.params;
    if (!syllabusId) return next(new CustomError('Syllabus ID is required.', 400));

    const syllabus = await syllabusService.getSyllabusByPublicId(syllabusId, req.user.userId);
    res.status(200).json({ success: true, data: syllabus });
  } catch (error) {
    next(error);
  }
};

export const updateSyllabusController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { syllabusId } = req.params;
    const { content } = req.body;

    if (!syllabusId) return next(new CustomError('Syllabus ID is required.', 400));
    if (!content) return next(new CustomError('Content is required.', 400));

    const updated = await syllabusService.updateSyllabusContent(syllabusId, content, req.user.userId);
    res.status(200).json({ success: true, message: 'Syllabus updated.', data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteSyllabusController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { syllabusId } = req.params;
    if (!syllabusId) return next(new CustomError('Syllabus ID is required.', 400));

    await syllabusService.deleteSyllabus(syllabusId, req.user.userId);
    res.status(200).json({ success: true, message: 'Syllabus deleted.' });
  } catch (error) {
    next(error);
  }
};