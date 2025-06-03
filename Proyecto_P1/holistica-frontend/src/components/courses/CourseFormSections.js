import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { LEVEL_OPTIONS, STATUS_OPTIONS } from '../../constants/courseConstants';

// Shared PropTypes definition
const formDataPropType = PropTypes.shape({
  name: PropTypes.string,
  level: PropTypes.string,
  description: PropTypes.string,
  detailed_description: PropTypes.string,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  original_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max_students: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  start_date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  end_date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  status: PropTypes.string,
  featured: PropTypes.bool
});

const sectionPropTypes = {
  formData: formDataPropType.isRequired,
  handleInputChange: PropTypes.func.isRequired
};

// Helper component for form fields
const FormField = ({ label, children, className = "form-field" }) => (
  <div className={className}>
    <label>{label}</label>
    {children}
  </div>
);

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

const BasicInfoSection = ({ formData, handleInputChange }) => (
  <Card title="Información Básica" className="form-card">
    <div className="form-grid">
      <FormField label="Nombre del Curso">
        <InputText
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Ej: Masaje Terapéutico Avanzado"
        />
      </FormField>
      
      <FormField label="Nivel">
        <Dropdown
          id="level"
          value={formData.level}
          options={LEVEL_OPTIONS}
          onChange={(e) => handleInputChange('level', e.value)}
          placeholder="Seleccionar nivel"
        />
      </FormField>
      
      <FormField label="Descripción Corta" className="form-field full-width">
        <InputTextarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={3}
          placeholder="Descripción breve del curso"
        />
      </FormField>
      
      <FormField label="Descripción Detallada" className="form-field full-width">
        <InputTextarea
          id="detailed_description"
          value={formData.detailed_description || ''}
          onChange={(e) => handleInputChange('detailed_description', e.target.value)}
          rows={5}
          placeholder="Descripción completa del curso"
        />
      </FormField>
    </div>
  </Card>
);

const PricingSection = ({ formData, handleInputChange }) => (
  <Card title="Precios y Duración" className="form-card">
    <div className="form-grid">
      <FormField label="Precio Actual">
        <InputNumber
          id="price"
          value={formData.price}
          onValueChange={(e) => handleInputChange('price', e.value)}
          mode="currency"
          currency="USD"
          locale="en-US"
        />
      </FormField>
      
      <FormField label="Precio Original">
        <InputNumber
          id="original_price"
          value={formData.original_price}
          onValueChange={(e) => handleInputChange('original_price', e.value)}
          mode="currency"
          currency="USD"
          locale="en-US"
        />
      </FormField>
      
      <FormField label="Duración (horas)">
        <InputNumber
          id="duration"
          value={formData.duration}
          onValueChange={(e) => handleInputChange('duration', e.value)}
          min={1}
        />
      </FormField>
      
      <FormField label="Máximo de Estudiantes">
        <InputNumber
          id="max_students"
          value={formData.max_students}
          onValueChange={(e) => handleInputChange('max_students', e.value)}
          min={1}
        />
      </FormField>
    </div>
  </Card>
);

const ScheduleStatusSection = ({ formData, handleInputChange }) => (
  <Card title="Fechas y Estado" className="form-card">
    <div className="form-grid">
      <FormField label="Fecha de Inicio">
        <Calendar
          id="start_date"
          value={formData.start_date}
          onChange={(e) => handleInputChange('start_date', e.value)}
          showIcon
          dateFormat="dd/mm/yy"
        />
      </FormField>
      
      <FormField label="Fecha de Fin">
        <Calendar
          id="end_date"
          value={formData.end_date}
          onChange={(e) => handleInputChange('end_date', e.value)}
          showIcon
          dateFormat="dd/mm/yy"
        />
      </FormField>
      
      <FormField label="Estado">
        <Dropdown
          id="status"
          value={formData.status}
          options={STATUS_OPTIONS}
          onChange={(e) => handleInputChange('status', e.value)}
        />
      </FormField>
      
      <FormField label="">
        <div className="checkbox-field">
          <Checkbox
            id="featured"
            checked={formData.featured}
            onChange={(e) => handleInputChange('featured', e.checked)}
          />
          <label htmlFor="featured">Curso Destacado</label>
        </div>
      </FormField>
    </div>
  </Card>
);

// Apply PropTypes to all sections
BasicInfoSection.propTypes = sectionPropTypes;
PricingSection.propTypes = sectionPropTypes;
ScheduleStatusSection.propTypes = sectionPropTypes;

export { BasicInfoSection, PricingSection, ScheduleStatusSection };
