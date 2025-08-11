import express from 'express';
import userRoutes from './routers/user.routes.js';
import syllabusRoutes from './routers/syllabus.routes.js';
import {connectDB} from './db/db.js';
import cookieParser from 'cookie-parser';
import quizController from './routers/quiz.routes.js';
// import messageRoutes from './routers/messages.routes.js';
import cors from 'cors';
const app = express();


connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true, // Allow cookies to be sent
}));

app.use('/user', userRoutes);
app.use("/syllabus", syllabusRoutes);
app.use("/quiz", quizController); 

export default app;