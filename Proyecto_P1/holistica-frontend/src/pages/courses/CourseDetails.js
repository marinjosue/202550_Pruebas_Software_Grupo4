import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tag } from 'primereact/tag';
import { Badge } from 'primereact/badge';
import { Chip } from 'primereact/chip';
import { Divider } from 'primereact/divider';
import { Panel } from 'primereact/panel';
import { useAuth } from '../../hooks/useAuth';
import courseService from '../../services/courseService';
import contentService from '../../services/contentService';
import enrollmentService from '../../services/enrollmentService';
import PaymentDialog from '../../components/PaymentDialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import '../../styles/CourseDetails.css';

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useRef(null);
  const { user } = useAuth();

  
  const [course, setCourse] = useState(null);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        console.error('No course ID provided');
        navigate('/courses');
        return;
      }

      try {
        console.log('Loading course details for ID:', id);
        setLoading(true);
        
        // Cargar curso principal
        const courseData = await courseService.getCourseById(id);
        console.log('Course data loaded:', courseData);
        setCourse(courseData);
        
        // Cargar contenido (opcional, no bloquea si falla)
        try {
          const contentData = await contentService.getContentByCourse(id);
          setContent(Array.isArray(contentData) ? contentData : []);
        } catch (contentError) {
          console.warn('Content loading failed, continuing without content:', contentError);
          setContent([]);
        }
        
      } catch (error) {
        console.error('Error loading course:', error);
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Error al cargar el curso',
          life: 5000
        });
        
        // Dar tiempo para mostrar el error antes de redirigir
        setTimeout(() => navigate('/courses'), 3000);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  const handleEnroll = async () => {
    if (!user) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Autenticación requerida',
        detail: 'Debes iniciar sesión para inscribirte',
        life: 3000
      });
      navigate('/login');
      return;
    }

    try {
      setEnrolling(true);
      await enrollmentService.enrollInCourse(id);
      toast.current?.show({
        severity: 'success',
        summary: 'Inscripción exitosa',
        detail: 'Te has inscrito al curso correctamente',
        life: 3000
      });
      // Recargar datos del curso
      const courseData = await courseService.getCourseById(id);
      setCourse(courseData);
    } catch (error) {
      console.error('Enrollment error:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Error al inscribirse en el curso',
        life: 3000
      });
    } finally {
      setEnrolling(false);
    }
  };

  const handleDeleteCourse = async () => {
    try {
      await courseService.deleteCourse(id);
      toast.current?.show({
        severity: 'success',
        summary: 'Curso eliminado',
        detail: 'El curso se ha eliminado correctamente',
        life: 3000
      });
      setTimeout(() => navigate('/courses'), 2000);
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 3000
      });
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

  const getStatusSeverity = (status) => {
    switch (status?.toLowerCase()) {
      case 'activo': return 'success';
      case 'próximo': return 'info';
      case 'finalizado': return 'secondary';
      default: return 'warning';
    }
  };

  // Mostrar loading
  if (loading) {
    return (
      <div className="course-details-loading">
        <ProgressSpinner />
        <p>Cargando detalles del curso...</p>
        <small>ID del curso: {id}</small>
      </div>
    );
  }

  // Mostrar error si no hay curso
  if (!course) {
    return (
      <div className="course-not-found">
        <i className="pi pi-exclamation-triangle"></i>
        <h2>Curso no encontrado</h2>
        <p>El curso con ID {id} no existe o no está disponible.</p>
        <Button label="Volver a cursos" onClick={() => navigate('/courses')} />
      </div>
    );
  }

  return (
    <div className="course-details-container">
      <Toast ref={toast} />
      
      {/* Hero Section */}
      <div className="course-hero">
        <div className="course-hero-content">
          <div className="course-hero-left">
            <div className="course-breadcrumb">
              <Button 
                label="← Volver a cursos" 
                className="p-button-text"
                onClick={() => navigate('/courses')}
              />
            </div>
            
            <h1 className="course-hero-title">{course.title || 'Curso sin nombre'}</h1>
            <p className="course-hero-description">{course.description || 'Sin descripción disponible'}</p>
            
            <div className="course-hero-tags">
              <Tag value={`${course.duration || 0} horas`} severity="info" />
              <Tag value={course.level || 'Todos los niveles'} severity="warning" />
              <Tag value={course.status || 'Disponible'} severity={getStatusSeverity(course.status)} />
            </div>
            
            <div className="course-hero-dates">
              <div className="date-item">
                <i className="pi pi-calendar"></i>
                <div>
                  <span className="date-label">Fecha de inicio</span>
                  <span className="date-value">{formatDate(course.start_date)}</span>
                </div>
              </div>
              <div className="date-item">
                <i className="pi pi-calendar-times"></i>
                <div>
                  <span className="date-label">Fecha de fin</span>
                  <span className="date-value">{formatDate(course.end_date)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="course-hero-right">
            <Card className="course-pricing-card">
              <div className="pricing-header">
                <div className="price-display">
                  <span className="current-price">${course.price || 0}</span>
                  {course.original_price && course.original_price > course.price && (
                    <span className="original-price">${course.original_price}</span>
                  )}
                </div>
                {course.featured && <Badge value="Curso Destacado" severity="success" />}
              </div>
              
              <Divider />
              
              <div className="course-features">
                <div className="feature-item">
                  <i className="pi pi-clock"></i>
                  <span>{course.duration || 0} horas de contenido</span>
                </div>
                <div className="feature-item">
                  <i className="pi pi-globe"></i>
                  <span>Acceso de por vida</span>
                </div>
                <div className="feature-item">
                  <i className="pi pi-certificate"></i>
                  <span>Certificado de finalización</span>
                </div>
                <div className="feature-item">
                  <i className="pi pi-mobile"></i>
                  <span>Acceso móvil</span>
                </div>
              </div>
              
              {user && user.role === 1 ? (
                <div className="admin-course-actions">
                  <Button
                    label="Editar Curso"
                    icon="pi pi-pencil"
                    className="edit-course-button"
                    onClick={() => navigate(`/courses/${id}/edit`)}
                  />
                  <Button
                    label="Eliminar Curso"
                    icon="pi pi-trash"
                    className="p-button-danger delete-course-button"
                    onClick={handleDeleteCourse}
                  />
                </div>
              ) : (
                <Button
                  label={enrolling ? 'Inscribiendo...' : 'Inscribirse Ahora'}
                  icon={enrolling ? 'pi pi-spin pi-spinner' : 'pi pi-user-plus'}
                  className="enroll-cta-button"
                  onClick={handleEnroll}
                  loading={enrolling}
                  disabled={enrolling}
                />
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="course-content-section">
        <TabView className="course-tabs">
          <TabPanel header="Descripción" leftIcon="pi pi-info-circle">
            <div className="course-description-content">
              <h3>Sobre este curso</h3>
              <p>{course.detailed_description || course.description || 'No hay descripción disponible.'}</p>
              
              {course.objectives && (
                <div className="course-objectives">
                  <h4>Objetivos del curso</h4>
                  <ul>
                    {course.objectives.split('\n').map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {course.requirements && (
                <div className="course-requirements">
                  <h4>Requisitos</h4>
                  <ul>
                    {course.requirements.split('\n').map((requirement, index) => (
                      <li key={index}>{requirement}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </TabPanel>

          <TabPanel header="Contenido" leftIcon="pi pi-list">
            <div className="course-content-list">
              {content.length > 0 ? (
                content.map((item, index) => (
                  <Panel
                    key={item.id}
                    header={`${index + 1}. ${item.title}`}
                    className="content-panel"
                    toggleable
                  >
                    <div className="content-item">
                      <p>{item.description}</p>
                      <div className="content-meta">
                        <Chip label={item.type} />
                        {item.duration && <Chip label={`${item.duration} min`} />}
                      </div>
                    </div>
                  </Panel>
                ))
              ) : (
                <div className="no-content">
                  <i className="pi pi-info-circle"></i>
                  <p>El contenido del curso se revelará una vez inscrito</p>
                </div>
              )}
            </div>
          </TabPanel>

          <TabPanel header="Instructor" leftIcon="pi pi-user">
            <div className="instructor-info">
              <div className="instructor-card">
                <div className="instructor-avatar">
                  <i className="pi pi-user"></i>
                </div>
                <div className="instructor-details">
                  <h3>{course.instructor_name || 'Instructor Profesional'}</h3>
                  <p>{course.instructor_bio || 'Instructor especializado en el área de cosmetología y masajes terapéuticos.'}</p>
                  <div className="instructor-stats">
                    <div className="stat-item">
                      <span className="stat-number">5+</span>
                      <span className="stat-label">Años de experiencia</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">100+</span>
                      <span className="stat-label">Estudiantes</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">4.8</span>
                      <span className="stat-label">Calificación</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel header="Reseñas" leftIcon="pi pi-star">
            <div className="course-reviews">
              <div className="reviews-summary">
                <div className="rating-display">
                  <span className="rating-number">4.8</span>
                  <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i key={star} className="pi pi-star-fill"></i>
                    ))}
                  </div>
                  <span className="rating-count">(24 reseñas)</span>
                </div>
              </div>
              
              <div className="sample-reviews">
                <div className="review-item">
                  <div className="review-header">
                    <strong>María González</strong>
                    <div className="review-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i key={star} className="pi pi-star-fill"></i>
                      ))}
                    </div>
                  </div>
                  <p>"Excelente curso, muy completo y bien estructurado. Los instructores son muy profesionales."</p>
                </div>
                
                <div className="review-item">
                  <div className="review-header">
                    <strong>Carlos Rodríguez</strong>
                    <div className="review-stars">
                      {[1, 2, 3, 4].map((star) => (
                        <i key={star} className="pi pi-star-fill"></i>
                      ))}
                      <i className="pi pi-star"></i>
                    </div>
                  </div>
                  <p>"Muy buena experiencia de aprendizaje. El contenido es práctico y aplicable."</p>
                </div>
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
}
