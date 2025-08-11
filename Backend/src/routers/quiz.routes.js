import express from 'express';
const router = express.Router();
import * as quizController from "../controllers/quiz.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

router.post(
    "/generate-questions/:topicId",
    authUser,
    quizController.createQuizController
);

router.get(
    "/get-all",
    authUser,
    quizController.getAllQuizzesController
);

router.get(
    "/get-by-topic/:topicId",
    authUser,
    quizController.getQuizzesByTopicId
);

router.get(
    "/get-by-id/:quizId",
    authUser,
    quizController.getQuizByIdController
);

router.delete(
    "/delete-quiz/:quizId",
    authUser,
    quizController.deleteQuizController
);



export default router;