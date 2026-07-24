//backend/src/routers/quiz.routes.ts

import express from 'express';
import * as quizController from '../controllers/quiz.controller';
import { authUser } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(authUser);

// GET  /api/quiz/leaderboard                   global leaderboard
// POST /api/quiz/generate/:syllabusId          generate quiz  (syllabusId = UUID)
// GET  /api/quiz                               all quizzes for user
// GET  /api/quiz/topic/:syllabusId             quizzes by topic
// GET  /api/quiz/:quizId                       single quiz    (quizId = UUID)
// PATCH /api/quiz/:quizId/submit               submit result
// DELETE /api/quiz/:quizId                     delete quiz

router.get('/leaderboard', quizController.getLeaderboardController);
router.post('/generate/:syllabusId', quizController.generateQuizController);
router.get('/', quizController.getAllQuizzesController);
router.get('/topic/:syllabusId', quizController.getQuizzesByTopicController);
router.get('/:quizId', quizController.getQuizByIdController);
router.patch('/:quizId/submit', quizController.submitQuizController);
router.delete('/:quizId', quizController.deleteQuizController);

export default router;