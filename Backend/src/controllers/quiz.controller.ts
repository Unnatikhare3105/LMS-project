// Backend/src/controllers/quiz.controller.ts
import { Request, Response, NextFunction } from 'express';
import quizModel from '@models/quiz.model';
import syllabusModel from '@models/syllabus.model';
import userModel from '@models/user.models';
import CustomError from '@utils/customError';
import {
  generateQuestions,
  getAllQuizzesByID
} from '@services/quiz.services';

export const createQuizController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { numQuestions } = req.body;
    const { topicId } = req.params;

    if (!topicId) {
      return next(new CustomError('Topic ID is required.', 400));
    }
    if (!numQuestions) {
      return next(
        new CustomError('Number of questions must be a positive integer.', 400)
      );
    }

    const topicDoc = await syllabusModel.findById(topicId);
    if (!topicDoc || !topicDoc.topic) {
      return next(new CustomError('Topic not found for the given ID.', 404));
    }
    const topic = topicDoc.topic;

    if (!req.user || !req.user.email) {
      return next(
        new CustomError('User information not found in request.', 401)
      );
    }

    const loggedInUser = await userModel
      .findOne({ email: req.user.email })
      .select('-password');
    if (!loggedInUser) {
      return next(new CustomError('User not found', 404));
    }

    const questionsData: any = await generateQuestions({
      userId: loggedInUser._id.toString(),
      topicId,
      topicName: topic,
      numQuestions,
    });

    console.log('questionsData:', questionsData);

    // Safe way to extract questions – no more TypeScript errors!
    let questionsArr: any[] = [];

    if (questionsData) {
      // Case 1: questionsData.questions is direct array
      if (Array.isArray(questionsData.questions)) {
        questionsArr = questionsData.questions;
      }
      // Case 2: questionsData.questions.questions is the array (nested)
      else if (
        questionsData.questions &&
        Array.isArray(questionsData.questions.questions)
      ) {
        questionsArr = questionsData.questions.questions;
      }
      // Case 3: questionsData itself is the array
      else if (Array.isArray(questionsData)) {
        questionsArr = questionsData;
      }
    }

    if (questionsArr.length === 0) {
      return next(new CustomError('Failed to generate questions. Please try again.', 500));
    }

    res.status(201).json({
      success: true,
      questions: questionsArr,
    });

  } catch (error: any) {
    console.error('Error in createQuizController:', error);
    next(new CustomError(error.message || 'Internal Server Error', 500));
  }
};

export const getAllQuizzesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const loggedInUser = await userModel
      .findOne({ email: req.user.email })
      .select('-password');
    if (!loggedInUser) {
      return next(new CustomError('User not found', 404));
    }

    const quizzes = await getAllQuizzesByID({
      userId: loggedInUser._id.toString(),
    });
    if (!quizzes || quizzes.length === 0) {
      return next(new CustomError('No quizzes found for the user.', 404));
    }

    res.status(200).json({
      success: true,
      quizzes,
    });
  } catch (error: any) {
    console.error('Error in getAllQuizzesController:', error);
    next(new CustomError(error.message || 'Internal Server Error', 500));
  }
};

export const getQuizzesByTopicId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { topicId } = req.params;

  if (!topicId) {
    return next(new CustomError('Topic ID is required.', 400));
  }

  try {
    const loggedInUser = await userModel
      .findOne({ email: req.user?.email })
      .select('-password');

    if (!loggedInUser) {
      return next(new CustomError('User not found', 404));
    }

    // Direct query: topicId से syllabus ढूंढो, फिर उसका topic use करके quizzes
    const syllabus = await syllabusModel.findById(topicId);
    if (!syllabus) {
      return next(new CustomError('Topic not found', 404));
    }

    const quizzes = await quizModel.find({
      userId: loggedInUser._id,
      topic: syllabus.topic  // या जो field match करता हो
    });

    if (!quizzes || quizzes.length === 0) {
      return next(new CustomError('No quizzes found for this topic.', 404));
    }

    res.status(200).json({
      success: true,
      quizzes,
    });

  } catch (error: any) {
    next(new CustomError(error.message || 'Internal Server Error', 500));
  }
};

export const getQuizByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { quizId } = req.params;
  if (!quizId) {
    return next(new CustomError('Quiz ID is required.', 400));
  }

  try {
    const loggedInUser = await userModel
      .findOne({ email: req.user.email })
      .select('-password');
    if (!loggedInUser) {
      return next(new CustomError('User not found', 404));
    }

    const quiz = await quizModel.findById(quizId).populate('userId', '-password');
    if (!quiz) {
      return next(new CustomError('Quiz not found for the given ID.', 404));
    }

    res.status(200).json({
      success: true,
      quiz,
    });
  } catch (error: any) {
    console.error('Error in getQuizByIdController:', error);
    next(new CustomError(error.message || 'Internal Server Error', 500));
  }
};

export const deleteQuizController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { quizId } = req.params;
  if (!quizId) {
    return next(new CustomError('Quiz ID is required.', 400));
  }

  try {
    const loggedInUser = await userModel
      .findOne({ email: req.user.email })
      .select('-password');
    if (!loggedInUser) {
      return next(new CustomError('User not found', 404));
    }

    const deletedQuiz = await quizModel.findByIdAndDelete(quizId);
    if (!deletedQuiz) {
      return next(new CustomError('Quiz not found or already deleted.', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully.',
    });
  } catch (error: any) {
    console.error('Error in deleteQuizController:', error);
    next(new CustomError(error.message || 'Internal Server Error', 500));
  }
};