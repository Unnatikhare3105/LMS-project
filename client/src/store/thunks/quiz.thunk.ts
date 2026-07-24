// client/src/store/thunks/quiz.thunk.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import { quizService } from '@/src/services/quiz.service';

export const generateQuiz = createAsyncThunk(
  'quiz/generate',
  async (
    data: { syllabusId: string; numQuestions: number; difficulty: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await quizService.generate(data.syllabusId, data.numQuestions, data.difficulty);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to generate quiz.');
    }
  }
);

export const fetchAllQuizzes = createAsyncThunk(
  'quiz/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await quizService.getAll();
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch quizzes.');
    }
  }
);

export const fetchQuizzesByTopic = createAsyncThunk(
  'quiz/fetchByTopic',
  async (syllabusId: string, { rejectWithValue }) => {
    try {
      const res = await quizService.getByTopic(syllabusId);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch quizzes for topic.');
    }
  }
);

export const fetchQuizById = createAsyncThunk(
  'quiz/fetchById',
  async (quizId: string, { rejectWithValue }) => {
    try {
      const res = await quizService.getById(quizId);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch quiz.');
    }
  }
);

export const submitQuiz = createAsyncThunk(
  'quiz/submit',
  async (
    data: { quizId: string; score: number; timeTakenSeconds: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await quizService.submit(data.quizId, data.score, data.timeTakenSeconds);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to submit quiz.');
    }
  }
);

export const deleteQuiz = createAsyncThunk(
  'quiz/delete',
  async (quizId: string, { rejectWithValue }) => {
    try {
      await quizService.delete(quizId);
      return quizId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete quiz.');
    }
  }
);

export const fetchLeaderboard = createAsyncThunk(
  'quiz/fetchLeaderboard',
  async (limit: number | undefined, { rejectWithValue }) => {
    try {
      const res = await quizService.getLeaderboard(limit);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch leaderboard.');
    }
  }
);