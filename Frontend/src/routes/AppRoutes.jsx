import React from 'react'
import { BrowserRouter as AppRouter, Routes as AppRoutes, Route } from 'react-router-dom'
import Signup from '../features/authentication/Register'
import Login from '../features/authentication/LoginByPassword'
import VerifyOTP from '../features/authentication/VerifyOTP'
import LoginByOTP from '../features/authentication/LoginByOTP'

const ProjectRoutes = () => {
  return (
    <AppRouter>
      <AppRoutes>
        <Route path="/" element={<h1 className="text-3xl font-bold text-center mt-10">Welcome to the Project</h1>} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/login-by-otp" element={<LoginByOTP />} />
      </AppRoutes>
    </AppRouter>
  )
}


export default ProjectRoutes
