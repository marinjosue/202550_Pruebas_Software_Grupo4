import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from '../pages/Home'; 
import Login from '../pages/auth/Login'; 
import Register from '../pages/auth/Register'; 
import PublicLayout from '../layouts/PublicLayout'; 
import ResetPassword from '../pages/auth/ResetPassword';
import Profile from '../pages/user/Profile';
import UserList from '../pages/user/UserList';
import CourseReports from '../pages/reports/CourseReports';
import Contact from '../pages/support/ContactSupport';
import CourseList from '../pages/courses/CourseList';
import CourseDetails from '../pages/courses/CourseDetails';
import CourseCreate from '../pages/courses/CourseCreate';
import CourseEdit from '../pages/courses/CourseEdit';
import ProtectedRoute from '../components/ProtectedRoute';
import MyEnrollments from '../pages/user/MyEnrollments';
import PaymentHistory from '../pages/user/PaymentHistory';
import AboutUs from '../pages/aboutUs/AboutUs'; // Importa la página de "Sobre Nosotros"

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
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path='/about' element={<AboutUs/>} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          
          {/* Rutas Protegidas - Usuario */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-enrollments" 
            element={
              <ProtectedRoute>
                <MyEnrollments />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payment-history" 
            element={
              <ProtectedRoute>
                <PaymentHistory />
              </ProtectedRoute>
            } 
          />
          
          {/* Rutas Protegidas - Admin */}
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute requireAdmin>
                <UserList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/reports" 
            element={
              <ProtectedRoute requireAdmin>
                <CourseReports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/courses/create" 
            element={
              <ProtectedRoute requireAdmin>
                <CourseCreate />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/courses/:id/edit" 
            element={
              <ProtectedRoute requireAdmin>
                <CourseEdit />
              </ProtectedRoute>
            } 
          />
          
          {/* Rutas de Administración */}
          <Route 
            path="/admin/courses" 
            element={
              <ProtectedRoute requireAdmin>
                <CourseCreate />
              </ProtectedRoute>
            } 
          />
          
          {/* Ruta 404 */}
          <Route path="*" element={
            <div className="not-found-container">
              <div className="not-found-content">
                <i className="pi pi-exclamation-triangle" style={{fontSize: '4rem', color: '#f59e0b'}}></i>
                <h2>Página no encontrada</h2>
                <p>La página que buscas no existe.</p>
                <button onClick={() => window.location.href = '/'} className="p-button">
                  Volver al Inicio
                </button>
              </div>
            </div>
          } />
        </Routes>
      </PublicLayout>
    </BrowserRouter>
  );
}
