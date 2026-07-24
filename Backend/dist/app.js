"use strict";
//backend/src/app.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const db_1 = require("./db/db");
const user_routes_1 = __importDefault(require("./routers/user.routes"));
const syllabus_routes_1 = __importDefault(require("./routers/syllabus.routes"));
const quiz_routes_1 = __importDefault(require("./routers/quiz.routes"));
const bookmark_routes_1 = __importDefault(require("./routers/bookmark.routes"));
const dailyChallenge_routes_1 = __importDefault(require("./routers/dailyChallenge.routes"));
const error_middleware_1 = require("@middlewares/error.middleware");
const ai_service_1 = require("@services/ai.service");
const app = (0, express_1.default)();
(0, db_1.connectDB)();
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json({ limit: '2mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100
}));
app.get('/health', (_req, res) => res.json({
    success: true,
    message: 'LMS Server healthy.'
}));
(0, ai_service_1.checkGroqConnection)();
// .then(() => console.log('Groq check done'))
// .catch(console.error);
app.use('/api/user', user_routes_1.default);
app.use('/api/syllabus', syllabus_routes_1.default);
app.use('/api/quiz', quiz_routes_1.default);
app.use('/api/bookmarks', bookmark_routes_1.default);
app.use('/api/daily-challenge', dailyChallenge_routes_1.default);
// listAvailableModels().then(() => console.log('done')).catch(console.error);
app.use(error_middleware_1.notFound);
app.use(error_middleware_1.errorHandler);
exports.default = app;
// import express, { Express } from "express";
// import cookieParser from 'cookie-parser';
// import cors from 'cors';
// import morgan from 'morgan';
// import userRoutes from 'routers/user.routes';
// import syllabusRoutes from 'routers/syllabus.routes';
// import quizController from 'routers/quiz.routes';
// import { connectDB } from 'db/db';
// const app: Express = express();
// // Database connection
// connectDB();
// // Middlewares
// app.use(morgan('dev'));  // 'dev' better for development
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(
//   cors({
//     origin: 'http://localhost:5173', // तुम्हारा frontend URL
//     credentials: true,
//   })
// );
// //health routes
// app.get('/health', (req, res) => {
//   console.log("Health check endpoint hit");
//   return res.status(200).json({ message: 'Server is healthy!' });
// });
// // Routes
// app.use('/user', userRoutes);
// app.use('/syllabus', syllabusRoutes);
// app.use('/quiz', quizController);
// export default app;
//# sourceMappingURL=app.js.map