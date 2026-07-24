// client/src/store/slices/syllabusSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SyllabusState, ISyllabus } from '@/src/types';
import {
  generateTextContentThunk,
  generateVideoContentThunk,
  fetchAllTopicsThunk,
  fetchSyllabusByIdThunk,
  updateSyllabusThunk,
  deleteSyllabusThunk,
  generateFullContentThunk,
} from '../thunks/syllabus.thunk';

const initialState: SyllabusState = {
  topics: [],
  currentSyllabus: null,
  loading: false,
  aiLoading: false,
};

const syllabusSlice = createSlice({
  name: 'syllabus',
  initialState,
  reducers: {
    setCurrentSyllabus(state, action: PayloadAction<ISyllabus | null>) {
      state.currentSyllabus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
    // generateFull
      .addCase(generateFullContentThunk.pending, (state: any) => { state.aiLoading = true; })
      .addCase(generateFullContentThunk.fulfilled, (state: any, action: any) => {
        state.aiLoading = false;
        state.currentSyllabus = action.payload.data;
        const idx = state.topics.findIndex((t: ISyllabus) => t.syllabusId === action.payload.data.syllabusId);
        if (idx !== -1) state.topics[idx] = action.payload.data;
        else state.topics.unshift(action.payload.data);
      })
      .addCase(generateFullContentThunk.rejected, (state: any) => { state.aiLoading = false; })
      
      // generateText
      .addCase(generateTextContentThunk.pending, (state: any) => { state.aiLoading = true; })
      .addCase(generateTextContentThunk.fulfilled, (state: any, action: any) => {
        state.aiLoading = false;
        state.currentSyllabus = action.payload.data;
        const exists = state.topics.find((t: ISyllabus) => t.syllabusId === action.payload.data.syllabusId);
        if (!exists) state.topics.unshift(action.payload.data);
      })
      .addCase(generateTextContentThunk.rejected, (state: any) => { state.aiLoading = false; })

      // generateVideo
      .addCase(generateVideoContentThunk.pending, (state: any) => { state.aiLoading = true; })
      .addCase(generateVideoContentThunk.fulfilled, (state: any, action: any) => {
        state.aiLoading = false;
        state.currentSyllabus = action.payload.data;
        const exists = state.topics.find((t: ISyllabus) => t.syllabusId === action.payload.data.syllabusId);
        if (!exists) state.topics.unshift(action.payload.data);
      })
      .addCase(generateVideoContentThunk.rejected, (state: any) => { state.aiLoading = false; })

      // fetchAll
      .addCase(fetchAllTopicsThunk.pending, (state: any) => { state.loading = true; })
      .addCase(fetchAllTopicsThunk.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.topics = action.payload.data;
      })
      .addCase(fetchAllTopicsThunk.rejected, (state: any) => { state.loading = false; })

      // fetchById
      .addCase(fetchSyllabusByIdThunk.pending, (state: any) => { state.loading = true; })
      .addCase(fetchSyllabusByIdThunk.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.currentSyllabus = action.payload.data;
      })
      .addCase(fetchSyllabusByIdThunk.rejected, (state: any) => { state.loading = false; })

      // update
      .addCase(updateSyllabusThunk.pending, (state: any) => { state.loading = true; })
      .addCase(updateSyllabusThunk.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.currentSyllabus = action.payload.data;
        const idx = state.topics.findIndex((t: ISyllabus) => t.syllabusId === action.payload.data.syllabusId);
        if (idx !== -1) state.topics[idx] = action.payload.data;
      })
      .addCase(updateSyllabusThunk.rejected, (state: any) => { state.loading = false; })

      // delete
      .addCase(deleteSyllabusThunk.fulfilled, (state: any, action: any) => {
        state.topics = state.topics.filter((t: ISyllabus) => t.syllabusId !== action.payload);
        if (state.currentSyllabus?.syllabusId === action.payload) {
          state.currentSyllabus = null;
        }
      });
  },
});

export const { setCurrentSyllabus } = syllabusSlice.actions;
export default syllabusSlice.reducer;


