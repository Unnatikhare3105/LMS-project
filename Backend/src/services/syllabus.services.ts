import syllabusModel from '@models/syllabus.model';
import CustomError from '@utils/customError';
import * as AIService from './openAI.services';

export const generateContentAsText = async ({
  topic,
  userId,
}: {
  topic: string;
  userId: string;
}) => {
  try {
    const response = await AIService.getDetailedExplanation(topic);
    if (!response) {
      throw new CustomError('No content generated', 404);
    }
    const newSyllabus = new syllabusModel({
      userId,
      topic,
      content: response,
    });
    await newSyllabus.save();
    return response;
  } catch (error: any) {
    console.error('Error generating text content:', error);
    throw new CustomError('Failed to generate text content', 500);
  }
};

export const generateContentAsVideo = async ({
  topic,
  userId,
}: {
  topic: string;
  userId: string;
}) => {
  if (!topic) {
    throw new CustomError('Topic is required', 400);
  }
  if (!userId) {
    throw new CustomError('User ID is required', 400);
  }
  try {
    const response = await AIService.getVideoLinks(topic);
    if (!response || response.length === 0) {
      throw new CustomError('No video content generated', 404);
    }
    const newSyllabus = new syllabusModel({
      userId,
      topic,
      content: response,
    });
    await newSyllabus.save();
    return response;
  } catch (error: any) {
    console.error('Error generating video content:', error);
    throw new CustomError('Failed to generate video content', 500);
  }
};

export const getall = async ({ userId }: { userId: string }) => {
  try {
    const topics = await syllabusModel
      .find({ userId })
      .select('topic content -_id');
    if (!topics || topics.length === 0) {
      throw new CustomError('No topics found for the given user ID', 404);
    }
    return topics;
  } catch (error: any) {
    console.error('Error fetching topics:', error);
    throw new CustomError('Failed to fetch topics', 500);
  }
};

export const getSyllabusById = async ({ syllabusId }: { syllabusId: string }) => {
  if (!syllabusId) {
    throw new CustomError('Syllabus ID is required', 400);
  }
  try {
    const syllabus = await syllabusModel.findById(syllabusId);
    if (!syllabus) {
      throw new CustomError('Syllabus not found', 404);
    }
    return syllabus;
  } catch (error: any) {
    console.error('Error fetching syllabus by ID:', error);
    throw new CustomError('Failed to fetch syllabus', 500);
  }
};

export const updateSyllabus = async ({
  syllabusId,
  content,
}: {
  syllabusId: string;
  content: any;
}) => {
  if (!syllabusId) {
    throw new CustomError('Syllabus ID is required', 400);
  }
  if (!content) {
    throw new CustomError('Content is required', 400);
  }
  try {
    const updatedSyllabus = await syllabusModel.findByIdAndUpdate(
      syllabusId,
      { $set: { content } },
      { new: true }
    );
    if (!updatedSyllabus) {
      throw new CustomError('Syllabus not found or update failed', 404);
    }
    return updatedSyllabus;
  } catch (error: any) {
    console.error('Error updating syllabus:', error);
    throw new CustomError('Failed to update syllabus', 500);
  }
};

export const deleteSyllabus = async ({ syllabusId }: { syllabusId: string }) => {
  if (!syllabusId) {
    throw new CustomError('Syllabus ID is required', 400);
  }
  try {
    const deletedSyllabus = await syllabusModel.findByIdAndDelete(syllabusId);
    if (!deletedSyllabus) {
      throw new CustomError('Syllabus not found or delete failed', 404);
    }
    return true;
  } catch (error: any) {
    console.error('Error deleting syllabus:', error);
    throw new CustomError('Failed to delete syllabus', 500);
  }
};