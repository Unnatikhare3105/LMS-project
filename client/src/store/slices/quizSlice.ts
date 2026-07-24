// client/src/store/slices/quizSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QuizState, IQuiz, ILeaderboardEntry } from '@/src/types';
import {
  generateQuiz,
  fetchAllQuizzes,
  fetchQuizzesByTopic,
  fetchQuizById,
  submitQuiz,
  deleteQuiz,
  fetchLeaderboard,
} from '../thunks/quiz.thunk';



const initialState: QuizState = {
  quizzes: [],
  currentQuiz: null,
  leaderboard: [],
  loading: false,
  aiLoading: false,
  currentQuestionIndex: 0,
  selectedAnswers: {},
  submitted: false
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setCurrentQuiz(state, action: PayloadAction<IQuiz>) {
      state.currentQuiz = action.payload;
      state.currentQuestionIndex = 0;
      state.selectedAnswers = {};
      state.submitted = false;
    },
    selectAnswer(state, action: PayloadAction<{ index: number; answer: string }>) {
      state.selectedAnswers[action.payload.index] = action.payload.answer;
    },
    nextQuestion(state) {
      if (state.currentQuestionIndex < state.currentQuiz!.questions.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    prevQuestion(state) {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    markSubmitted(state) {
      state.submitted = true;
    },
    clearCurrentQuiz(state) {
      state.currentQuiz = null;
      state.currentQuestionIndex = 0;
      state.selectedAnswers = {};
      state.submitted = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // generate
      .addCase(generateQuiz.pending, (state: any) => { state.aiLoading = true; })
      .addCase(generateQuiz.fulfilled, (state: any, action: any) => {
        state.aiLoading = false;
        state.currentQuiz = action.payload.data;
        state.currentQuestionIndex = 0;
        state.selectedAnswers = {};
        state.submitted = false;
        state.quizzes.unshift(action.payload.data);
      })
      .addCase(generateQuiz.rejected, (state: any) => { state.aiLoading = false; })

      // fetchAll
      .addCase(fetchAllQuizzes.pending, (state: any) => { state.loading = true; })
      .addCase(fetchAllQuizzes.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.quizzes = action.payload.data;
      })
      .addCase(fetchAllQuizzes.rejected, (state: any) => { state.loading = false; })

      // fetchByTopic
      .addCase(fetchQuizzesByTopic.pending, (state: any) => { state.loading = true; })
      .addCase(fetchQuizzesByTopic.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.quizzes = action.payload.data;
      })
      .addCase(fetchQuizzesByTopic.rejected, (state: any) => { state.loading = false; })

      // fetchById
      .addCase(fetchQuizById.pending, (state: any) => { state.loading = true; })
      .addCase(fetchQuizById.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.currentQuiz = action.payload.data;
        state.currentQuestionIndex = 0;
        state.selectedAnswers = {};
        state.submitted = false;
      })
      .addCase(fetchQuizById.rejected, (state: any) => { state.loading = false; })

      // submit
      .addCase(submitQuiz.pending, (state: any) => { state.loading = true; })
      .addCase(submitQuiz.fulfilled, (state: any, action: any) => {
        state.loading = false;
        if (state.currentQuiz) {
          state.currentQuiz = {
            ...state.currentQuiz,
            ...action.payload.data,
          };
        } else {
          state.currentQuiz = action.payload.data;
        }
        const idx = state.quizzes.findIndex((q: IQuiz) => q.quizId === action.payload.data.quizId);
        if (idx !== -1) state.quizzes[idx] = {
          ...state.quizzes[idx],
          ...action.payload.data,
        };
      })
      .addCase(submitQuiz.rejected, (state: any) => { state.loading = false; })

      // delete
      .addCase(deleteQuiz.fulfilled, (state: any, action: any) => {
        state.quizzes = state.quizzes.filter((q: IQuiz) => q.quizId !== action.payload);
        if (state.currentQuiz?.quizId === action.payload) {
          state.currentQuiz = null;
        }
      })

      // leaderboard
      .addCase(fetchLeaderboard.pending, (state: any) => { state.loading = true; })
      .addCase(fetchLeaderboard.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.leaderboard = action.payload.data;
      })
      .addCase(fetchLeaderboard.rejected, (state: any) => { state.loading = false; });
  },
});

export const { setCurrentQuiz, selectAnswer, nextQuestion, prevQuestion, markSubmitted, clearCurrentQuiz } = quizSlice.actions;

export default quizSlice.reducer;



