import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from '../pages/Home'; 
import Login from '../pages/auth/Login'; 
import Register from '../pages/auth/Register'; 
import PublicLayout from '../layouts/PublicLayout'; 
import CourseManager from '../pages/courses/Courses'; 
import ResetPassword from '../pages/auth/ResetPassword';
import Profile from '../pages/user/Profile';
import UserList from '../pages/user/UserList';
import CourseReports from '../pages/reports/CourseReports';
import Contact from '../pages/support/ContactSupport';


export default function AppRoutes() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <PublicLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<CourseManager />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/reports/courses" element={<CourseReports />} />
          {/* Puedes agregar más rutas aquí */}
        </Routes>
      </PublicLayout>
    </BrowserRouter>
  );
}
