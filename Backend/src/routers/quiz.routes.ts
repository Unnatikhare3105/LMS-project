//backend/src/routers/quiz.routes.ts

import express from 'express';
import * as quizController from '../controllers/quiz.controller';
import { authUser } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(authUser);

// GET  /api/quiz/leaderboard                   global leaderboard
router.get('/leaderboard', quizController.getLeaderboardController);

// POST /api/quiz/generate/:syllabusId          generate quiz  (syllabusId = UUID)
router.post('/generate/:syllabusId', quizController.generateQuizController);

// GET  /api/quiz                               all quizzes for user
router.get('/', quizController.getAllQuizzesController);

// GET  /api/quiz/topic/:syllabusId             quizzes by topic
router.get('/topic/:syllabusId', quizController.getQuizzesByTopicController);

// GET  /api/quiz/:quizId                       single quiz    (quizId = UUID)
router.get('/:quizId', quizController.getQuizByIdController);

// PATCH /api/quiz/:quizId/submit               submit result
router.patch('/:quizId/submit', quizController.submitQuizController);

// DELETE /api/quiz/:quizId                     delete quiz
router.delete('/:quizId', quizController.deleteQuizController);

export default router;