import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { FormField } from './FormField';
import { 
  contactFormSchema, 
  handleFormSubmission,
  createFormState,
  updateFormField,
  resetForm 
} from '../../utils/formHelpers';

const ContactForm = ({ 
  onSubmit, 
  toast, 
  title = "Envíanos un Mensaje",
  subtitle = "Completa el formulario y nos pondremos en contacto contigo",
  submitLabel = "Enviar Mensaje",
  className = ""
}) => {
  const [formState, setFormState] = useState(createFormState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  }));

  const handleFieldChange = updateFormField(formState, setFormState);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const success = await handleFormSubmission(
      formState.data,
      contactFormSchema,
      onSubmit,
      toast,
      (loading) => setFormState(prev => ({ ...prev, loading })),
      'Tu mensaje ha sido enviado exitosamente. Te contactaremos pronto.'
    );

    if (success) {
      resetForm(setFormState, {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }
  };

  const formHeader = (
    <div className="form-header gradient-soft text-center">
      <h2 className="flex-center gap-md">
        <i className="pi pi-envelope"></i>
        {title}
      </h2>
      <p>{subtitle}</p>
    </div>
  );

  return (
    <Card className={`contact-form-card rounded-2xl shadow-medium ${className}`}>
      {formHeader}
      
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-row grid-2">
          <FormField label="Nombre" required>
            <InputText
              id="name"
              value={formState.data.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              placeholder="Tu nombre completo"
              className="form-input"
            />
          </FormField>
          
          <FormField label="Email" required>
            <InputText
              id="email"
              type="email"
              value={formState.data.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              placeholder="tu@email.com"
              className="form-input"
            />
          </FormField>
        </div>

        <div className="form-row grid-2">
          <FormField label="Teléfono">
            <InputText
              id="phone"
              value={formState.data.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              placeholder="+593 99 999 9999"
              className="form-input"
            />
          </FormField>
          
          <FormField label="Asunto" required>
            <InputText
              id="subject"
              value={formState.data.subject}
              onChange={(e) => handleFieldChange('subject', e.target.value)}
              placeholder="Motivo de contacto"
              className="form-input"
            />
          </FormField>
        </div>

        <FormField label="Mensaje" required>
          <InputTextarea
            id="message"
            value={formState.data.message}
            onChange={(e) => handleFieldChange('message', e.target.value)}
            rows={5}
            placeholder="Escribe tu mensaje aquí..."
            className="form-input"
          />
        </FormField>

        <Button
          type="submit"
          label={formState.loading ? 'Enviando...' : submitLabel}
          icon={formState.loading ? 'pi pi-spin pi-spinner' : 'pi pi-send'}
          className="btn-primary submit-button"
          loading={formState.loading}
          disabled={formState.loading}
        />
      </form>
    </Card>
  );
};

ContactForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  toast: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.shape({ current: PropTypes.object })
  ]).isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  submitLabel: PropTypes.string,
  className: PropTypes.string
};

ContactForm.defaultProps = {
  title: "Envíanos un Mensaje",
  subtitle: "Completa el formulario y nos pondremos en contacto contigo",
  submitLabel: "Enviar Mensaje",
  className: ""
};

export default ContactForm;
