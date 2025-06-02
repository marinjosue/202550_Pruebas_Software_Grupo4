import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="protected-route-loading">
        <ProgressSpinner />
        <p>Verificando autenticación...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== 1) {
    return (
      <div className="access-denied-container">
        <Card className="access-denied-card">
          <div className="access-denied-content">
            <i className="pi pi-lock access-denied-icon"></i>
            <h2>Acceso Denegado</h2>
            <p>No tienes permisos para acceder a esta página.</p>
            <p>Se requieren privilegios de administrador.</p>
            <div className="access-denied-actions">
              <Button 
                label="Volver al Inicio" 
                icon="pi pi-home"
                onClick={() => window.location.href = '/'}
              />
              <Button 
                label="Ver Cursos" 
                icon="pi pi-graduation-cap"
                className="p-button-outlined"
                onClick={() => window.location.href = '/courses'}
              />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
