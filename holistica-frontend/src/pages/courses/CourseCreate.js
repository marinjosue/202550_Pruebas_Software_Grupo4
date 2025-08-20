import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { Checkbox } from 'primereact/checkbox';
import { useAuth } from '../../hooks/useAuth';

import courseService from '../../services/courseService';
import '../../styles/CourseCreate.css';

export default function CourseCreate() {
  const navigate = useNavigate();
  const toast = useRef(null);
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
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

  // Verificar permisos de administrador
  React.useEffect(() => {
    if (!user || user.role !== 1) {
      toast.current?.show({
        severity: 'error',
        summary: 'Acceso denegado',
        detail: 'No tienes permisos para crear cursos',
        life: 3000
      });
      navigate('/courses');
    }
  }, [user, navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
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

    if (!formData.start_date) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error de validación',
        detail: 'La fecha de inicio es obligatoria',
        life: 3000
      });
      return false;
    }

    if (!formData.end_date) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error de validación',
        detail: 'La fecha de fin es obligatoria',
        life: 3000
      });
      return false;
    }

    if (formData.start_date >= formData.end_date) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error de validación',
        detail: 'La fecha de fin debe ser posterior a la fecha de inicio',
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
      setLoading(true);
      
      // Preparar datos para envío
      const courseData = {
        ...formData,
        start_date: formData.start_date.toISOString().split('T')[0],
        end_date: formData.end_date.toISOString().split('T')[0],
        instructor_name: formData.instructor_name || user.name + ' ' + user.lastname
      };

      await courseService.createCourse(courseData);
      
      toast.current?.show({
        severity: 'success',
        summary: 'Curso creado',
        detail: 'El curso se ha creado exitosamente',
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="course-form-container">
      <Toast ref={toast} />
      
      <div className="form-header">
        <Button 
          label="← Volver a cursos" 
          className="p-button-text"
          onClick={() => navigate('/courses')}
        />
        <h1><i className="pi pi-plus"></i> Crear Nuevo Curso</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Información Básica */}
          <Card title="Información Básica" className="form-card">
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="title">Nombre del Curso *</label>
                <InputText
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
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
                value={formData.detailed_description}
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
                <label htmlFor="start_date">Fecha de Inicio *</label>
                <Calendar
                  id="start_date"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange('start_date', e.value)}
                  showIcon
                  dateFormat="dd/mm/yy"
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="end_date">Fecha de Fin *</label>
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

          {/* Contenido Académico */}
          <Card title="Contenido Académico" className="form-card">
            <div className="form-field">
              <label htmlFor="objectives">Objetivos del Curso</label>
              <InputTextarea
                id="objectives"
                value={formData.objectives}
                onChange={(e) => handleInputChange('objectives', e.target.value)}
                rows={4}
                placeholder="Cada objetivo en una línea separada"
              />
            </div>

            <div className="form-field">
              <label htmlFor="requirements">Requisitos</label>
              <InputTextarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => handleInputChange('requirements', e.target.value)}
                rows={3}
                placeholder="Cada requisito en una línea separada"
              />
            </div>
          </Card>

          {/* Instructor */}
          <Card title="Información del Instructor" className="form-card">
            <div className="form-field">
              <label htmlFor="instructor_name">Nombre del Instructor</label>
              <InputText
                id="instructor_name"
                value={formData.instructor_name}
                onChange={(e) => handleInputChange('instructor_name', e.target.value)}
                placeholder="Por defecto: tu nombre"
              />
            </div>

            <div className="form-field">
              <label htmlFor="instructor_bio">Biografía del Instructor</label>
              <InputTextarea
                id="instructor_bio"
                value={formData.instructor_bio}
                onChange={(e) => handleInputChange('instructor_bio', e.target.value)}
                rows={3}
                placeholder="Experiencia y especialidades del instructor"
              />
            </div>
          </Card>

          {/* Imagen */}
          <Card title="Imagen del Curso" className="form-card">
            <div className="form-field">
              <label htmlFor="image_url">URL de la Imagen</label>
              <InputText
                id="image_url"
                value={formData.image_url}
                onChange={(e) => handleInputChange('image_url', e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            <div className="form-field">
              <label htmlFor="course-image-upload">Subir Imagen</label>
              <FileUpload
                id="course-image-upload"
                mode="basic"
                name="courseImage"
                accept="image/*"
                maxFileSize={1000000}
                chooseLabel="Seleccionar Imagen"
                className="course-image-upload"
              />
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
            onClick={() => navigate('/courses')}
          />
          <Button
            type="submit"
            label={loading ? 'Creando...' : 'Crear Curso'}
            icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
            loading={loading}
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
}
