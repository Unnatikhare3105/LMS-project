// client/src/store/thunks/syllabus.thunk.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import { syllabusService } from '@/src/services/syllabus.service';

export const generateFullContentThunk = createAsyncThunk(
  'syllabus/generateFull',
  async (topic: string, { rejectWithValue }) => {
    try {
      const res = await syllabusService.generateFull(topic);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to generate content.');
    }
  }
);

export const generateTextContentThunk = createAsyncThunk(
  'syllabus/generateText',
  async (topic: string, { rejectWithValue }) => {
    try {
      const res = await syllabusService.generateText(topic);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to generate content.');
    }
  }
);

export const generateVideoContentThunk = createAsyncThunk(
  'syllabus/generateVideo',
  async (topic: string, { rejectWithValue }) => {
    try {
      const res = await syllabusService.generateVideo(topic);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch videos.');
    }
  }
);

export const fetchAllTopicsThunk = createAsyncThunk(
  'syllabus/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await syllabusService.getAllTopics();
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch topics.');
    }
  }
);

export const fetchSyllabusByIdThunk = createAsyncThunk(
  'syllabus/fetchById',
  async (syllabusId: string, { rejectWithValue }) => {
    try {
      const res = await syllabusService.getById(syllabusId);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch topic.');
    }
  }
);

export const updateSyllabusThunk = createAsyncThunk(
  'syllabus/update',
  async (data: { syllabusId: string; content: string }, { rejectWithValue }) => {
    try {
      const res = await syllabusService.update(data.syllabusId, data.content);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update topic.');
    }
  }
);

export const deleteSyllabusThunk = createAsyncThunk(
  'syllabus/delete',
  async (syllabusId: string, { rejectWithValue }) => {
    try {
      await syllabusService.delete(syllabusId);
      return syllabusId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete.');
    }
  }
);

