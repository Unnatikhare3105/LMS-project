import CustomError from "../utils/customError.js";
import userModel from "../models/user.models.js";
import * as syllabusServices from "../services/syllabus.services.js";

export const generateContentAsTextController = async (req, res, next) => {
  const { topic } = req.body;
  try {
    if (!topic) {
      return next(new CustomError("Topic is required", 400));
    }
    
    const loggedInUser = await userModel.findOne({email: req.user.email}).select("-password");
    if (!loggedInUser) {
      return next(new CustomError("User not found", 404));
    }
    const content = await syllabusServices.generateContentAsText({ topic, userId: loggedInUser._id });

    if (!content) {
      return next(new CustomError("No content generated", 404));
    }
    
    return res.status(200).json({
      success: true,
      message: "Content generated successfully",
      data: content,
    });
    
  } catch (error) {
    return next(new CustomError({
      success: false,
      message: error.message || "Internal Server Error",
      statusCode: 500
    }));
  }
};

export const generateContentAsVideoController = async (req, res, next) => {
  const { topic } = req.body;
  try {
    if (!topic) {
      return next(new CustomError("Topic is required", 400));
    }
    
    const loggedInUser = await userModel.findOne({email: req.user.email}).select("-password");
    if (!loggedInUser) {
      return next(new CustomError("User not found", 404));
    }
    const content = await syllabusServices.generateContentAsVideo({ topic, userId: loggedInUser._id });

    if (!content) {
      return next(new CustomError("No content generated", 404));
    }
    
    return res.status(200).json({
      success: true,
      message: "Content generated successfully",
      data: content,
    });
    
  } catch (error) {
    console.error("Error generating video content:", error);
    return next(new CustomError({
      success: false,
      message: error.message || "Internal Server Error",
      statusCode: 500
    }))
  }
};

export const getAllTopicsController = async (req, res, next) => {
  const loggedInUser = await userModel.findOne({email: req.user.email}).select("-password");
  if (!loggedInUser) {
    return next(new CustomError("User not found", 404));
  }
  try {
    const topics = await syllabusServices.getall({userId: loggedInUser._id});
    if (!topics) {
      return next(new CustomError("No topics found", 404));
    }
    return res.status(200).json({
      success: true,
      message: "Topics retrieved successfully",
      data: topics,
    });
  } catch (err) {

    return next(new CustomError({
      success: false,
      message: err.message,
      statusCode: 500
    }));
  }
};

export const getSyllabusByIdController = async (req, res, next) => {
  const { syllabusId } = req.params;
  try {
    if (!syllabusId) {
      return next(new CustomError("Syllabus ID is required", 400));
    }

    const syllabus = await syllabusServices.getSyllabusById({syllabusId});
    if (!syllabus) {
      return next(new CustomError("Syllabus not found", 404));
    }
    
    return res.status(200).json({
      success: true,
      message: "Syllabus retrieved successfully",
      data: syllabus,
    });
    
  } catch (error) {
    return next(new CustomError({
      success: false,
      message: error.message || "Internal Server Error",
      statusCode: 500
    }));
  }
}

export const updateSyllabusController = async (req, res, next) => {
  const { syllabusId } = req.params;
  const { topic, content } = req.body;

  try {
    if (!syllabusId) {
      return next(new CustomError("Syllabus ID is required", 400));
    }

    const updatedSyllabus = await syllabusServices.updateSyllabus({ syllabusId, topic, content });
    if (!updatedSyllabus) {
      return next(new CustomError("Syllabus not found or update failed", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Syllabus updated successfully",
      data: updatedSyllabus,
    });
    
  } catch (error) {
    return next(new CustomError({
      success: false,
      message: error.message || "Internal Server Error",
      statusCode: 500
    }));
  }
};

export const deleteSyllabusController = async (req, res, next) => {
  const { syllabusId } = req.params;

  try {
    if (!syllabusId) {
      return next(new CustomError("Syllabus ID is required", 400));
    }

    const deleted = await syllabusServices.deleteSyllabus({ syllabusId });
    if (!deleted) {
      return next(new CustomError("Syllabus not found or delete failed", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Syllabus deleted successfully",
    });
    
  } catch (error) {
    return next(new CustomError({
      success: false,
      message: error.message || "Internal Server Error",
      statusCode: 500
    }));
  }
}