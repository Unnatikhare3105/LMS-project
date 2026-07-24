// client/src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import syllabusReducer from './slices/syllabusSlice';
import quizReducer from './slices/quizSlice';
import bookmarkReducer from './slices/bookmarkSlice';
import dailyChallengeReducer from './slices/challengeSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    syllabus: syllabusReducer,
    quiz: quizReducer,
    bookmark: bookmarkReducer,
    dailyChallenge: dailyChallengeReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;