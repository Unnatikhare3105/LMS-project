import quizModel from "../models/quiz.model.js";
import syllabusModel from "../models/syllabus.model.js";
import userModel from "../models/user.models.js";
import CustomError from "../utils/customError.js";
import * as quizServices from "../services/quiz.services.js";

export const createQuizController = async (req, res, next) => {
  try {
    const { numQuestions } = req.body;
    const { topicId } = req.params;

    if (!topicId) {
      return next(new CustomError("Topic ID is required.", 400));
    }
    if (!numQuestions) {
      return next(new CustomError("Number of questions must be a positive integer.", 400));
    }

    // Fetch topic name from DB using topicId
    const topicDoc = await syllabusModel.findById(topicId);
    if (!topicDoc || !topicDoc.topic) {
      return next(new CustomError("Topic not found for the given ID.", 404));
    }
    const topic = topicDoc.topic;

    if (!req.user || !req.user.email) {
      return next(new CustomError("User information not found in request.", 401));
    }

    const loggedInUser = await userModel.findOne({ email: req.user.email }).select("-password");
    if (!loggedInUser) {
      return next(new CustomError("User not found", 404));
    }

    const questionsData = await quizServices.generateQuestions({
      userId: loggedInUser._id,
      topicId, // Pass ObjectId for topic
      topicName: topic, // Pass topic name if needed
      numQuestions
    });
     
    console.log("questionsData:", questionsData);

    // Handle double-nested questions property
    const questionsArr = questionsData.questions && Array.isArray(questionsData.questions.questions)
      ? questionsData.questions.questions
      : questionsData.questions;

    if (!questionsArr || !Array.isArray(questionsArr) || questionsArr.length === 0) {
      return next(new CustomError("No questions generated for the quiz.", 404));
    }

    res.status(201).json({
      success: true,
      questions: questionsArr
    });
  } catch (error) {
    console.error("Error in createQuizController:", error);
    next(new CustomError(error.message || "Internal Server Error", 500));
  }
};

export const getAllQuizzesController = async (req, res, next) => {
  try {
    const loggedInUser = await userModel.findOne({ email: req.user.email }).select("-password");
    if (!loggedInUser) {
      return next(new CustomError("User not found", 404));
    }
    const quizzes = await quizServices.getAllQuizzesByID({ userId: loggedInUser._id });
    if (!quizzes || quizzes.length === 0) {
      return next(new CustomError("No quizzes found for the user.", 404));
    }

    res.status(200).json({
      success: true,
      quizzes
    });
  } catch (error) {
    console.error("Error in getAllQuizzesController:", error);
    next(new CustomError(error.message || "Internal Server Error", 500));
  }
};

export const getQuizzesByTopicId = async (req, res, next) => {
  const { topicId } = req.params;
  if (!topicId) {
    return next(new CustomError("Topic ID is required.", 400));
  }

  try {
    const loggedInUser = await userModel.findOne({ email: req.user.email }).select("-password");
    if (!loggedInUser) {
      return next(new CustomError("User not found", 404));
    }

    const quizzes = await quizServices.getQuizzesByTopicId({ topicId });
    if (!quizzes || quizzes.length === 0) {
      return next(new CustomError("No quizzes found for the given topic ID.", 404));
    }

    res.status(200).json({
      success: true,
      quizzes
    });
  } catch (error) {
    console.error("Error in getQuizByIdController:", error);
    next(new CustomError(error.message || "Internal Server Error", 500));
  }
};

export const getQuizByIdController = async (req, res, next) => {
  const { quizId } = req.params;
  if (!quizId) {
    return next(new CustomError("Quiz ID is required.", 400));
  }

  try {
    const loggedInUser = await userModel.findOne({ email: req.user.email }).select("-password");
    if (!loggedInUser) {
      return next(new CustomError("User not found", 404));
    }

    const quiz = await quizModel.findById(quizId).populate('userId', '-password');
    if (!quiz) {
      return next(new CustomError("Quiz not found for the given ID.", 404));
    }

    res.status(200).json({
      success: true,
      quiz
    });
  } catch (error) {
    console.error("Error in getQuizByIdController:", error);
    next(new CustomError(error.message || "Internal Server Error", 500));
  }
};

export const deleteQuizController = async (req, res, next) => {
  const { quizId } = req.params;
  if (!quizId) {
    return next(new CustomError("Quiz ID is required.", 400));
  }

  try {
    const loggedInUser = await userModel.findOne({ email: req.user.email }).select("-password");
    if (!loggedInUser) {
      return next(new CustomError("User not found", 404));
    }

    const deletedQuiz = await quizModel.findByIdAndDelete(quizId);
    if (!deletedQuiz) {
      return next(new CustomError("Quiz not found or already deleted.", 404));
    }

    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully."
    });
  } catch (error) {
    console.error("Error in deleteQuizController:", error);
    next(new CustomError(error.message || "Internal Server Error", 500));
  }
};
