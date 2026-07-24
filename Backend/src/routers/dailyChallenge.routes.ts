//backend/src/routers/dailyChallenge.routes.ts

import express from 'express';
import * as challengeController from '../controllers/dailyChallenge.controller';
import { authUser } from '../middlewares/auth.middleware';
const router = express.Router();
router.use(authUser);
router.get('/today', challengeController.getTodayChallengeController);
router.get('/recent', challengeController.getRecentChallengesController);
export default router;