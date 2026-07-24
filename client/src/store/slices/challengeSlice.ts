// client/src/store/slices/challengeSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DailyChallengeState, IDailyChallenge, IRecentChallenge } from '@/src/types';
import { fetchTodayChallenge, fetchRecentChallenges } from '../thunks/dailyChallenge.thunk';

const initialState: DailyChallengeState = {
  today: null,
  recent: [],
  loading: false,
  recentLoading: false,
};

const dailyChallengeSlice = createSlice({
  name: 'dailyChallenge',
  initialState,
  reducers: {
    clearTodayChallenge(state) {
      state.today = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // today's challenge
      .addCase(fetchTodayChallenge.pending, (state: any) => { state.loading = true; })
      .addCase(fetchTodayChallenge.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.today = action.payload.data as IDailyChallenge;
      })
      .addCase(fetchTodayChallenge.rejected, (state: any) => { state.loading = false; })

      // recent challenges
      .addCase(fetchRecentChallenges.pending, (state: any) => { state.recentLoading = true; })
      .addCase(fetchRecentChallenges.fulfilled, (state: any, action: any) => {
        state.recentLoading = false;
        state.recent = action.payload.data as IRecentChallenge[];
      })
      .addCase(fetchRecentChallenges.rejected, (state: any) => { state.recentLoading = false; });
  },
});

export const { clearTodayChallenge } = dailyChallengeSlice.actions;
export default dailyChallengeSlice.reducer;


