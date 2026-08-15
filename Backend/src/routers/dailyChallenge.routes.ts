//backend/src/routers/dailyChallenge.routes.ts

import express from 'express';
import * as challengeController from '../controllers/dailyChallenge.controller';
import { authUser } from '../middlewares/auth.middleware';
import {aiLimiter} from '../middlewares/rateLimiter.middleware';

const router = express.Router();
router.use(authUser);
router.get('/today', aiLimiter, challengeController.getTodayChallengeController);
router.get('/recent', challengeController.getRecentChallengesController);
export default router;