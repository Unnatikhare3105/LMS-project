// client/src/store/thunks/dailyChallenge.thunk.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import { dailyChallengeService } from '@/src/services/dailyChallenge.service';

export const fetchTodayChallenge = createAsyncThunk(
  'dailyChallenge/fetchToday',
  async (_, { rejectWithValue }) => {
    try {
      const res = await dailyChallengeService.getToday();
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch today's challenge."
      );
    }
  }
);

export const fetchRecentChallenges = createAsyncThunk(
  'dailyChallenge/fetchRecent',
  async (limit: number | undefined, { rejectWithValue }) => {
    try {
      const res = await dailyChallengeService.getRecent(limit);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch recent challenges.'
      );
    }
  }
);