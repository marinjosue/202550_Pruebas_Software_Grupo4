import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from '../pages/Home'; // ✅ Asegúrate que exista
import Login from '../pages/auth/Login'; // ⚠️ Asegúrate que exista
import Register from '../pages/auth/Register'; // ⚠️ Asegúrate que exista
import PublicLayout from '../layouts/PublicLayout'; // ✅ Asegúrate que exista
import CourseManager from '../pages/courses/Courses'; // ✅ Asegúrate que exista

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <PublicLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<CourseManager />} />
        </Routes>
      </PublicLayout>
    </BrowserRouter>
  );
}
