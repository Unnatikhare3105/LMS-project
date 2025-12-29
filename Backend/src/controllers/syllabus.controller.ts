// Backend/src/controllers/syllabus.controller.ts
import { Request, Response, NextFunction } from 'express';
import CustomError from '@utils/customError';
import userModel from '@models/user.models';
import {
  deleteSyllabus,
  generateContentAsText,
  generateContentAsVideo,
  getall,
  getSyllabusById,
  updateSyllabus,
} from '@services/syllabus.services';

export const generateContentAsTextController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { topic } = req.body;
  try {
    if (!topic) {
      return next(new CustomError('Topic is required', 400));
    }

    const loggedInUser = await userModel
      .findOne({ email: req.user.email })
      .select('-password');
    if (!loggedInUser) {
      return next(new CustomError('User not found', 404));
    }

    const content = await generateContentAsText({
      topic,
      userId: loggedInUser._id.toString(),
    });

    if (!content) {
      return next(new CustomError('No content generated', 404));
    }

    return res.status(200).json({
      success: true,
      message: 'Content generated successfully',
      data: content,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error',
      statusCode: 500,
    });
  }
};

export const generateContentAsVideoController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { topic } = req.body;
  try {
    if (!topic) {
      return next(new CustomError('Topic is required', 400));
    }

    const loggedInUser = await userModel
      .findOne({ email: req.user.email })
      .select('-password');
    if (!loggedInUser) {
      return next(new CustomError('User not found', 404));
    }

    const content = await generateContentAsVideo({
      topic,
      userId: loggedInUser._id.toString(),
    });

    if (!content) {
      return next(new CustomError('No content generated', 404));
    }

    return res.status(200).json({
      success: true,
      message: 'Content generated successfully',
      data: content,
    });
  } catch (error: any) {
    console.error('Error generating video content:', error);
    return next(
      new CustomError(error.message || 'Internal Server Error', 500)
    );
  }
};

export const getAllTopicsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const loggedInUser = await userModel
    .findOne({ email: req.user.email })
    .select('-password');
  if (!loggedInUser) {
    return next(new CustomError('User not found', 404));
  }

  try {
    const topics = await getall({ userId: loggedInUser._id.toString() });
    if (!topics) {
      return next(new CustomError('No topics found', 404));
    }

    return res.status(200).json({
      success: true,
      message: 'Topics retrieved successfully',
      data: topics,
    });
  } catch (err: any) {
    return next(new CustomError(err.message, 500));
  }
};

export const getSyllabusByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { syllabusId } = req.params;
  try {
    if (!syllabusId) {
      return next(new CustomError('Syllabus ID is required', 400));
    }

    const syllabus = await getSyllabusById({ syllabusId });
    if (!syllabus) {
      return next(new CustomError('Syllabus not found', 404));
    }

    return res.status(200).json({
      success: true,
      message: 'Syllabus retrieved successfully',
      data: syllabus,
    });
  } catch (error: any) {
    return next(
      new CustomError(error.message || 'Internal Server Error', 500)
    );
  }
};

export const updateSyllabusController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { syllabusId } = req.params;
  const { content } = req.body;

  try {
    if (!syllabusId) {
      return next(new CustomError('Syllabus ID is required', 400));
    }

    const updatedSyllabus = await updateSyllabus({ syllabusId, content });
    if (!updatedSyllabus) {
      return next(new CustomError('Syllabus not found or update failed', 404));
    }

    return res.status(200).json({
      success: true,
      message: 'Syllabus updated successfully',
      data: updatedSyllabus,
    });
  } catch (error: any) {
    return next(
      new CustomError(error.message || 'Internal Server Error', 500)
    );
  }
};

export const deleteSyllabusController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { syllabusId } = req.params;

  try {
    if (!syllabusId) {
      return next(new CustomError('Syllabus ID is required', 400));
    }

    const deleted = await deleteSyllabus({ syllabusId });
    if (!deleted) {
      return next(new CustomError('Syllabus not found or delete failed', 404));
    }

    return res.status(200).json({
      success: true,
      message: 'Syllabus deleted successfully',
    });
  } catch (error: any) {
    return next(
      new CustomError(error.message || 'Internal Server Error', 500)
    );
  }
};