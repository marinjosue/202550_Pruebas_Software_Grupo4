import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { DataView } from 'primereact/dataview';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Chip } from 'primereact/chip';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Badge } from 'primereact/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

import courseService from '../../services/courseService';
import enrollmentService from '../../services/enrollmentService';
import PaymentDialog from '../../components/PaymentDialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import '../../styles/CourseList.css';

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState(new Set());
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const sortOptions = [
    { label: 'Más Recientes', value: 'recent' },
    { label: 'Precio: Menor a Mayor', value: 'price_asc' },
    { label: 'Precio: Mayor a Menor', value: 'price_desc' },
    { label: 'Duración: Menor a Mayor', value: 'duration_asc' },
    { label: 'Duración: Mayor a Menor', value: 'duration_desc' },
    { label: 'Nombre A-Z', value: 'name_asc' },
    { label: 'Nombre Z-A', value: 'name_desc' }
  ];

  useEffect(() => {
    loadCourses();
    if (user) {
      loadEnrolledCourses();
    }
  }, [user]);

  useEffect(() => {
    filterAndSortCourses();
  }, [courses, searchTerm, sortBy]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getAllCourses();
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading courses:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 3000
      });
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const loadEnrolledCourses = async () => {
    try {
      const enrollments = await enrollmentService.getMyEnrollments();
      const enrolledIds = new Set(enrollments.map(e => e.course_id || e.course?.id));
      setEnrolledCourses(enrolledIds);
    } catch (error) {
      console.warn('Could not load enrolled courses:', error);
    }
  };

  const filterAndSortCourses = () => {
    let filtered = [...courses];

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.level?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenar
    if (sortBy) {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'price_asc':
            return (a.price || 0) - (b.price || 0);
          case 'price_desc':
            return (b.price || 0) - (a.price || 0);
          case 'duration_asc':
            return (a.duration || 0) - (b.duration || 0);
          case 'duration_desc':
            return (b.duration || 0) - (a.duration || 0);
          case 'name_asc':
            return (a.name || '').localeCompare(b.name || '');
          case 'name_desc':
            return (b.name || '').localeCompare(a.name || '');
          case 'recent':
          default:
            return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        }
      });
    }

    setFilteredCourses(filtered);
  };

  const handleEnroll = async (course) => {
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

    if (enrolledCourses.has(course.id)) {
      toast.current?.show({
        severity: 'info',
        summary: 'Ya inscrito',
        detail: 'Ya estás inscrito en este curso',
        life: 3000
      });
      return;
    }

    // Mostrar confirmación antes de proceder
    confirmDialog({
      message: `¿Estás seguro de que deseas inscribirte en "${course.name}"?`,
      header: 'Confirmar Inscripción',
      icon: 'pi pi-graduation-cap',
      acceptLabel: 'Sí, inscribirme',
      rejectLabel: 'Cancelar',
      accept: () => {
        if (course.price && course.price > 0) {
          setSelectedCourse(course);
          setShowPaymentDialog(true);
        } else {
          handleFreeEnrollment(course.id);
        }
      }
    });
  };

  const handleFreeEnrollment = async (courseId) => {
    try {
      await enrollmentService.enrollInCourse(courseId);
      toast.current?.show({
        severity: 'success',
        summary: 'Inscripción exitosa',
        detail: 'Te has inscrito al curso correctamente',
        life: 3000
      });
      loadEnrolledCourses();
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 3000
      });
    }
  };

  const handlePaymentSuccess = () => {
    loadEnrolledCourses();
    setSelectedCourse(null);
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await courseService.deleteCourse(courseId);
      toast.current?.show({
        severity: 'success',
        summary: 'Curso eliminado',
        detail: 'El curso ha sido eliminado exitosamente',
        life: 3000
      });
      loadCourses();
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 3000
      });
    }
  };

  const renderPriceDisplay = (course) => {
    if (course.original_price && course.original_price > course.price) {
      return (
        <>
          <span className="original-price">${course.original_price}</span>
          <span className="current-price">${course.price}</span>
        </>
      );
    }
    return (
      <span className="current-price">
        {course.price > 0 ? `$${course.price}` : 'Gratis'}
      </span>
    );
  };

  const renderCourseMeta = (course) => (
    <div className="course-meta">
      <div className="meta-item">
        <i className="pi pi-clock"></i>
        <span>{course.duration || 0} horas</span>
      </div>
      <div className="meta-item">
        <i className="pi pi-users"></i>
        <span>{course.max_students || '∞'} estudiantes</span>
      </div>
      <div className="meta-item">
        <i className="pi pi-calendar"></i>
        <span>{course.start_date ? new Date(course.start_date).toLocaleDateString() : 'Por definir'}</span>
      </div>
    </div>
  );

  const renderAdminActions = (course) => (
    <div className="admin-course-actions">
      <Button
        label="Editar"
        icon="pi pi-pencil"
        onClick={() => navigate(`/courses/${course.id}/edit`)}
        className="p-button-warning p-button-sm"
      />
      <Button
        label="Eliminar"
        icon="pi pi-trash"
        onClick={() => {
          confirmDialog({
            message: `¿Estás seguro de que deseas eliminar el curso "${course.name}"?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            accept: () => { handleDeleteCourse(course.id); }
          });
        }}
        className="p-button-danger p-button-sm"
      />
    </div>
  );

  const renderStudentActions = (course, isEnrolled) => {
    if (isEnrolled) {
      return (
        <div className="enrolled-status">
          <Button
            label="Inscrito ✓"
            icon="pi pi-check"
            className="p-button-success p-button-sm"
            disabled
          />
        </div>
      );
    }
    
    const enrollLabel = course.price && course.price > 0 ? 
                       `Inscribirse $${course.price}` : 
                       'Inscribirse Gratis';
    const enrollIcon = course.price && course.price > 0 ? 
                      'pi pi-credit-card' : 
                      'pi pi-user-plus';
    
    return (
      <Button
        label={enrollLabel}
        icon={enrollIcon}
        onClick={() => handleEnroll(course)}
        className="enroll-button"
      />
    );
  };

  const courseTemplate = (course) => {
    const isEnrolled = enrolledCourses.has(course.id);
    const isAdmin = user && user.role === 1;

    return (
      <Card className="course-card" key={course.id}>
        <div className="course-image-container">
          <img 
            src={course.image_url || 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=250&fit=crop'}
            alt={course.name}
            className="course-image"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=250&fit=crop';
            }}
          />
          {course.featured && <Badge value="Destacado" severity="success" className="featured-badge" />}
          {isEnrolled && <Badge value="Inscrito" severity="info" className="enrolled-badge" />}
        </div>
        
        <div className="course-content">
          <div className="course-header">
            <h3 className="course-title">{course.name}</h3>
            <div className="course-price">
              {renderPriceDisplay(course)}
            </div>
          </div>

          <p className="course-description">{course.description}</p>

          {renderCourseMeta(course)}

          <div className="course-tags">
            <Chip label={course.level || 'Todos los niveles'} className="level-chip" />
            <Tag value={course.status || 'activo'} severity={course.status === 'activo' ? 'success' : 'warning'} />
          </div>
        </div>

        <div className="course-actions">
          <Button
            label="Ver Detalles"
            icon="pi pi-info-circle"
            onClick={() => navigate(`/courses/${course.id}`)}
            className="p-button-outlined detail-button"
          />
          {isAdmin ? renderAdminActions(course) : renderStudentActions(course, isEnrolled)}
        </div>
      </Card>
    );
  };

  const header = () => {
    return (
      <div className="course-list-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Catálogo de Cursos</h1>
            <p>Descubre nuestros cursos especializados en medicina alternativa y bienestar</p>
          </div>
          
          {user && user.role === 1 && (
            <Button
              label="Crear Curso"
              icon="pi pi-plus"
              onClick={() => navigate('/courses/create')}
              className="create-course-button"
            />
          )}
        </div>

        <div className="filters-container">
          <div className="search-container">
            <i className="pi pi-search search-icon"></i>
            <InputText
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar cursos..."
              className="search-input"
            />
          </div>

          <Dropdown
            value={sortBy}
            options={sortOptions}
            onChange={(e) => setSortBy(e.value)}
            placeholder="Ordenar por..."
            className="sort-dropdown"
          />
        </div>

        <div className="results-summary">
          <span>
            {filteredCourses.length} curso{filteredCourses.length !== 1 ? 's' : ''} encontrado{filteredCourses.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="course-list-loading">
        <ProgressSpinner />
        <p>Cargando cursos...</p>
      </div>
    );
  }

  return (
    <div className="course-list-container">
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <DataView
        value={filteredCourses}
        itemTemplate={courseTemplate}
        header={header()}
        paginator
        rows={9}
        layout="grid"
        emptyMessage="No se encontraron cursos"
        className="course-dataview"
      />

      {/* Payment Dialog */}
      <PaymentDialog
        visible={showPaymentDialog}
        onHide={() => {
          setShowPaymentDialog(false);
          setSelectedCourse(null);
        }}
        course={selectedCourse}
        onPaymentSuccess={handlePaymentSuccess}
        onEnrollmentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
