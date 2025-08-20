import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import AboutUs from '../pages/aboutUs/AboutUs';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth routes without PublicLayout */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Routes with PublicLayout */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><AboutUs /></PublicLayout>} />
      <Route path="/courses" element={<PublicLayout><CourseList /></PublicLayout>} />
      <Route path="/courses/:id" element={<PublicLayout><CourseDetails /></PublicLayout>} />
      
      {/* Rutas Protegidas - Usuario */}
      <Route 
        path="/profile" 
        element={
          <PublicLayout>
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          </PublicLayout>
        } 
      />
      <Route 
        path="/my-enrollments" 
        element={
          <PublicLayout>
            <ProtectedRoute>
              <MyEnrollments />
            </ProtectedRoute>
          </PublicLayout>
        } 
      />
      <Route 
        path="/payment-history" 
        element={
          <PublicLayout>
            <ProtectedRoute>
              <PaymentHistory />
            </ProtectedRoute>
          </PublicLayout>
        } 
      />
      
      {/* Rutas Protegidas - Admin */}
      <Route 
        path="/admin/users" 
        element={
          <PublicLayout>
            <ProtectedRoute requireAdmin>
              <UserList />
            </ProtectedRoute>
          </PublicLayout>
        } 
      />
      <Route 
        path="/admin/reports" 
        element={
          <PublicLayout>
            <ProtectedRoute requireAdmin>
              <CourseReports />
            </ProtectedRoute>
          </PublicLayout>
        } 
      />
      <Route 
        path="/courses/create" 
        element={
          <PublicLayout>
            <ProtectedRoute requireAdmin>
              <CourseCreate />
            </ProtectedRoute>
          </PublicLayout>
        } 
      />
      <Route 
        path="/courses/:id/edit" 
        element={
          <PublicLayout>
            <ProtectedRoute requireAdmin>
              <CourseEdit />
            </ProtectedRoute>
          </PublicLayout>
        } 
      />
      <Route Add commentMore actions
            path="/admin/courses" 
            element={
              <ProtectedRoute requireAdmin>
                <CourseCreate />
              </ProtectedRoute>
            } 
          />
      {/* Ruta 404 */}
      <Route path="*" element={
        <PublicLayout>
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
        </PublicLayout>
      } />
    </Routes>
  );
}
