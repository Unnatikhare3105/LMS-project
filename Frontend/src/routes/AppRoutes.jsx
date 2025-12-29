import React from 'react'
import { BrowserRouter as AppRouter, Routes as AppRoutes, Route } from 'react-router-dom'
import LoginSignup from '../features/authentication/LoginSignup'
import VerifyOTP from '../features/authentication/VerifyOTP'
import LoginByOTP from '../features/authentication/LoginByOTP'
import SyllabusList from '../components/SyllabusList'
import QuizList from '../components/QuizList'
import CreateQuiz from '../components/CreateQuiz'

const ProjectRoutes = () => {
  return (
    <AppRouter>
      <AppRoutes>
  <Route path="/" element={<LoginSignup />} />
  <Route path="/login" element={<LoginSignup />} />
  <Route path="/verify-otp" element={<VerifyOTP />} />
  <Route path="/login-by-otp" element={<LoginByOTP />} />
  <Route path="/syllabus" element={<SyllabusList />} />
  <Route path="/quizzes" element={<QuizList />} />
  <Route path="/create-quiz" element={<CreateQuiz />} />
      </AppRoutes>
    </AppRouter>
  )
}


export default ProjectRoutes
