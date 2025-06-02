import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Chip } from 'primereact/chip';
import { Dialog } from 'primereact/dialog';
import { Badge } from 'primereact/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import enrollmentService from '../../services/enrollmentService';
import '../../styles/MyEnrollments.css';

export default function MyEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadEnrollments();
  }, [user, navigate]);

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      const data = await enrollmentService.getMyEnrollments();
      setEnrollments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading enrollments:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 3000
      });
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEnrollment = async () => {
    if (!selectedEnrollment) return;

    try {
      setCancelling(true);
      await enrollmentService.cancelEnrollment(selectedEnrollment.id);
      
      toast.current?.show({
        severity: 'success',
        summary: 'Inscripción cancelada',
        detail: 'Tu inscripción ha sido cancelada exitosamente',
        life: 3000
      });
      
      setShowCancelDialog(false);
      setSelectedEnrollment(null);
      loadEnrollments();
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 3000
      });
    } finally {
      setCancelling(false);
    }
  };

  const getStatusSeverity = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'activo':
        return 'success';
      case 'completed':
      case 'completado':
        return 'info';
      case 'cancelled':
      case 'cancelado':
        return 'danger';
      case 'pending':
      case 'pendiente':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'Activo';
      case 'completed':
        return 'Completado';
      case 'cancelled':
        return 'Cancelado';
      case 'pending':
        return 'Pendiente';
      default:
        return status || 'Desconocido';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const enrollmentTemplate = (enrollment) => {
    const course = enrollment.course || {};
    const progress = enrollment.progress || 0;
    const canCancel = enrollment.status?.toLowerCase() === 'active' || enrollment.status?.toLowerCase() === 'pending';

    return (
      <Card className="enrollment-card" key={enrollment.id}>
        <div className="enrollment-header">
          <div className="enrollment-image">
            <img 
              src={course.image_url || 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&h=200&fit=crop'}
              alt={course.name}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&h=200&fit=crop';
              }}
            />
            <div className="enrollment-status-overlay">
              <Tag 
                value={getStatusLabel(enrollment.status)}
                severity={getStatusSeverity(enrollment.status)}
              />
            </div>
          </div>
          
          <div className="enrollment-info">
            <h3 className="course-title">{course.name || 'Curso sin nombre'}</h3>
            <p className="course-description">{course.description}</p>
            
            <div className="enrollment-details">
              <div className="detail-item">
                <i className="pi pi-calendar"></i>
                <span>Inscrito: {formatDate(enrollment.enrollment_date)}</span>
              </div>
              <div className="detail-item">
                <i className="pi pi-clock"></i>
                <span>Duración: {course.duration || 0} horas</span>
              </div>
              <div className="detail-item">
                <i className="pi pi-calendar-times"></i>
                <span>Inicia: {formatDate(course.start_date)}</span>
              </div>
            </div>

            {progress > 0 && (
              <div className="progress-section">
                <div className="progress-header">
                  <span>Progreso del curso</span>
                  <Badge value={`${progress}%`} severity="info" />
                </div>
                <ProgressBar value={progress} className="enrollment-progress" />
              </div>
            )}

            <div className="enrollment-tags">
              <Chip label={course.level || 'Todos los niveles'} />
              {course.featured && <Chip label="Destacado" className="featured-chip" />}
              <Chip label={`$${course.price || 0}`} className="price-chip" />
            </div>
          </div>
        </div>

        <div className="enrollment-actions">
          <Button
            label="Ver Curso"
            icon="pi pi-eye"
            onClick={() => navigate(`/courses/${course.id}`)}
            className="p-button-outlined"
          />
          
          {enrollment.status?.toLowerCase() === 'active' && (
            <Button
              label="Continuar Aprendiendo"
              icon="pi pi-play"
              onClick={() => navigate(`/learning/${enrollment.id}`)}
              className="continue-button"
            />
          )}
          
          {canCancel && (
            <Button
              label="Cancelar Inscripción"
              icon="pi pi-times"
              onClick={() => {
                setSelectedEnrollment(enrollment);
                setShowCancelDialog(true);
              }}
              className="p-button-danger p-button-outlined"
            />
          )}
        </div>
      </Card>
    );
  };

  const header = () => {
    return (
      <div className="enrollments-header">
        <div className="enrollments-title">
          <h1><i className="pi pi-graduation-cap"></i> Mis Inscripciones</h1>
          <p>Gestiona tus cursos inscritos y continúa tu aprendizaje</p>
        </div>
        
        <div className="enrollments-stats">
          <div className="stat-item">
            <div className="stat-number">{enrollments.length}</div>
            <div className="stat-label">Total Inscripciones</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              {enrollments.filter(e => e.status?.toLowerCase() === 'active').length}
            </div>
            <div className="stat-label">Cursos Activos</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              {enrollments.filter(e => e.status?.toLowerCase() === 'completed').length}
            </div>
            <div className="stat-label">Completados</div>
          </div>
        </div>

        <div className="enrollments-actions">
          <Button
            label="Explorar Cursos"
            icon="pi pi-search"
            onClick={() => navigate('/courses')}
            className="explore-courses-button"
          />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="enrollments-loading">
        <ProgressSpinner />
        <p>Cargando tus inscripciones...</p>
      </div>
    );
  }

  return (
    <div className="my-enrollments-container">
      <Toast ref={toast} />
      
      {enrollments.length > 0 ? (
        <DataView
          value={enrollments}
          itemTemplate={enrollmentTemplate}
          header={header()}
          paginator
          rows={6}
          emptyMessage="No tienes inscripciones actualmente"
          className="enrollments-dataview"
        />
      ) : (
        <div className="no-enrollments">
          <div className="no-enrollments-content">
            <i className="pi pi-graduation-cap no-enrollments-icon"></i>
            <h2>No tienes inscripciones</h2>
            <p>¡Explora nuestros cursos y comienza tu viaje de aprendizaje!</p>
            <Button
              label="Explorar Cursos"
              icon="pi pi-search"
              onClick={() => navigate('/courses')}
              className="explore-button"
            />
          </div>
        </div>
      )}

      {/* Cancel Enrollment Dialog */}
      <Dialog
        header="Cancelar Inscripción"
        visible={showCancelDialog}
        onHide={() => setShowCancelDialog(false)}
        className="cancel-dialog"
        footer={
          <div>
            <Button
              label="Cancelar"
              icon="pi pi-times"
              onClick={() => setShowCancelDialog(false)}
              className="p-button-text"
            />
            <Button
              label={cancelling ? 'Cancelando...' : 'Confirmar Cancelación'}
              icon={cancelling ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
              onClick={handleCancelEnrollment}
              className="p-button-danger"
              loading={cancelling}
              disabled={cancelling}
            />
          </div>
        }
      >
        {selectedEnrollment && (
          <div className="cancel-content">
            <p>¿Estás seguro de que deseas cancelar tu inscripción en:</p>
            <h4>{selectedEnrollment.course?.name}</h4>
            <p className="cancel-warning">
              <i className="pi pi-exclamation-triangle"></i>
              Esta acción no se puede deshacer y perderás el acceso al curso.
            </p>
          </div>
        )}
      </Dialog>
    </div>
  );
}
