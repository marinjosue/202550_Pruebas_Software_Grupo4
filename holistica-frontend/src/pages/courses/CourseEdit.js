import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useAuth } from '../../hooks/useAuth';
import { useCourseForm } from '../../hooks/useCourseForm';
import courseService from '../../services/courseService';
import { BasicInfoSection, PricingSection, ScheduleStatusSection } from '../../components/courses/CourseFormSections';
import { parseCourseData } from '../../utils/courseValidation';
import '../../styles/CourseCreate.css';

export default function CourseEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useRef(null);
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const {
    formData,
    setFormData,
    handleInputChange,
    validateForm,
    getFormattedData
  } = useCourseForm();

  useEffect(() => {
    if (!user || user.role !== 1) {
      toast.current?.show({
        severity: 'error',
        summary: 'Acceso denegado',
        detail: 'No tienes permisos para editar cursos',
        life: 3000
      });
      navigate('/courses');
      return;
    }
    
    loadCourse();
  }, [user, navigate, id]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const courseData = await courseService.getCourseById(id);
      setFormData(parseCourseData(courseData));
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 3000
      });
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm(toast)) return;

    try {
      setSaving(true);
      await courseService.updateCourse(id, getFormattedData());
      
      toast.current?.show({
        severity: 'success',
        summary: 'Curso actualizado',
        detail: 'El curso se ha actualizado exitosamente',
        life: 3000
      });
      
      setTimeout(() => navigate(`/courses/${id}`), 2000);
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 3000
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="course-form-loading">
        <ProgressSpinner />
        <p>Cargando curso...</p>
      </div>
    );
  }

  return (
    <div className="course-form-container">
      <Toast ref={toast} />
      
      <div className="form-header">
        <Button 
          label="← Volver al curso" 
          className="p-button-text"
          onClick={() => navigate(`/courses/${id}`)}
        />
        <h1><i className="pi pi-pencil"></i> Editar Curso</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <BasicInfoSection formData={formData} handleInputChange={handleInputChange} />
          <PricingSection formData={formData} handleInputChange={handleInputChange} />
          <ScheduleStatusSection formData={formData} handleInputChange={handleInputChange} />
        </div>

        <div className="form-actions">
          <Button
            type="button"
            label="Cancelar"
            icon="pi pi-times"
            className="p-button-outlined"
            onClick={() => navigate(`/courses/${id}`)}
          />
          <Button
            type="submit"
            label={saving ? 'Guardando...' : 'Guardar Cambios'}
            icon={saving ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
            loading={saving}
            disabled={saving}
          />
        </div>
      </form>
    </div>
  );
}
