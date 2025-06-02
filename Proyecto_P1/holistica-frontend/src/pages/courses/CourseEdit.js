import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Checkbox } from 'primereact/checkbox';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useAuth } from '../../hooks/useAuth';
import courseService from '../../services/courseService';
import '../../styles/CourseCreate.css';

export default function CourseEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useRef(null);
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    detailed_description: '',
    price: 0,
    original_price: 0,
    duration: 0,
    start_date: null,
    end_date: null,
    level: '',
    status: 'activo',
    featured: false,
    max_students: 0,
    objectives: '',
    requirements: '',
    instructor_name: '',
    instructor_bio: '',
    image_url: ''
  });

  const levelOptions = [
    { label: 'Principiante', value: 'principiante' },
    { label: 'Intermedio', value: 'intermedio' },
    { label: 'Avanzado', value: 'avanzado' },
    { label: 'Todos los niveles', value: 'todos' }
  ];

  const statusOptions = [
    { label: 'Activo', value: 'activo' },
    { label: 'Próximo', value: 'proximo' },
    { label: 'Borrador', value: 'borrador' },
    { label: 'Finalizado', value: 'finalizado' }
  ];

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
      
      setFormData({
        ...courseData,
        start_date: courseData.start_date ? new Date(courseData.start_date) : null,
        end_date: courseData.end_date ? new Date(courseData.end_date) : null,
      });
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error de validación',
        detail: 'El nombre del curso es obligatorio',
        life: 3000
      });
      return false;
    }

    if (!formData.description.trim()) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error de validación',
        detail: 'La descripción es obligatoria',
        life: 3000
      });
      return false;
    }

    if (!formData.price || formData.price <= 0) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error de validación',
        detail: 'El precio debe ser mayor a 0',
        life: 3000
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setSaving(true);
      
      const courseData = {
        ...formData,
        start_date: formData.start_date ? formData.start_date.toISOString().split('T')[0] : null,
        end_date: formData.end_date ? formData.end_date.toISOString().split('T')[0] : null,
      };

      await courseService.updateCourse(id, courseData);
      
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
          {/* Información Básica */}
          <Card title="Información Básica" className="form-card">
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="name">Nombre del Curso *</label>
                <InputText
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ej: Masaje Terapéutico Avanzado"
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="level">Nivel</label>
                <Dropdown
                  id="level"
                  value={formData.level}
                  options={levelOptions}
                  onChange={(e) => handleInputChange('level', e.value)}
                  placeholder="Seleccionar nivel"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="description">Descripción Corta *</label>
              <InputTextarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                placeholder="Descripción breve del curso"
              />
            </div>

            <div className="form-field">
              <label htmlFor="detailed_description">Descripción Detallada</label>
              <InputTextarea
                id="detailed_description"
                value={formData.detailed_description || ''}
                onChange={(e) => handleInputChange('detailed_description', e.target.value)}
                rows={5}
                placeholder="Descripción completa del curso"
              />
            </div>
          </Card>

          {/* Precios y Duración */}
          <Card title="Precios y Duración" className="form-card">
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="price">Precio Actual *</label>
                <InputNumber
                  id="price"
                  value={formData.price}
                  onValueChange={(e) => handleInputChange('price', e.value)}
                  mode="currency"
                  currency="USD"
                  locale="en-US"
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="original_price">Precio Original</label>
                <InputNumber
                  id="original_price"
                  value={formData.original_price}
                  onValueChange={(e) => handleInputChange('original_price', e.value)}
                  mode="currency"
                  currency="USD"
                  locale="en-US"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="duration">Duración (horas)</label>
                <InputNumber
                  id="duration"
                  value={formData.duration}
                  onValueChange={(e) => handleInputChange('duration', e.value)}
                  min={1}
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="max_students">Máximo de Estudiantes</label>
                <InputNumber
                  id="max_students"
                  value={formData.max_students}
                  onValueChange={(e) => handleInputChange('max_students', e.value)}
                  min={1}
                />
              </div>
            </div>
          </Card>

          {/* Fechas y Estado */}
          <Card title="Fechas y Estado" className="form-card">
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="start_date">Fecha de Inicio</label>
                <Calendar
                  id="start_date"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange('start_date', e.value)}
                  showIcon
                  dateFormat="dd/mm/yy"
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="end_date">Fecha de Fin</label>
                <Calendar
                  id="end_date"
                  value={formData.end_date}
                  onChange={(e) => handleInputChange('end_date', e.value)}
                  showIcon
                  dateFormat="dd/mm/yy"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="status">Estado</label>
                <Dropdown
                  id="status"
                  value={formData.status}
                  options={statusOptions}
                  onChange={(e) => handleInputChange('status', e.value)}
                />
              </div>
              
              <div className="form-field checkbox-field">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => handleInputChange('featured', e.checked)}
                />
                <label htmlFor="featured">Curso Destacado</label>
              </div>
            </div>
          </Card>
        </div>

        {/* Acciones */}
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
