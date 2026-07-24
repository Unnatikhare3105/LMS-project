"use strict";
//backend/src/routers/quiz.routes.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const quizController = __importStar(require("../controllers/quiz.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.use(auth_middleware_1.authUser);
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
exports.default = router;
//# sourceMappingURL=quiz.routes.js.map