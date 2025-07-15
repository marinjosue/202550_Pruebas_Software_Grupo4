import { showError, showSuccess } from './commonHelpers.js';

// Common form validation rules
export const validationRules = {
  required: (value, fieldName) => {
    if (!value?.toString().trim()) {
      return `${fieldName} es obligatorio`;
    }
    return null;
  },

  email: (value) => {
    if (!value) return null;
    // Linear-time email regex to avoid ReDoS
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
      return 'Por favor, introduce un email válido';
    }
    return null;
  },

  phone: (value) => {
    if (!value) return null;
    const phoneRegex = /^[+]?[1-9]\d{0,15}$/;
    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
      return 'Por favor, introduce un número de teléfono válido';
    }
    return null;
  },

  minLength: (min) => (value, fieldName) => {
    if (!value) return null;
    if (value.length < min) {
      return `${fieldName} debe tener al menos ${min} caracteres`;
    }
    return null;
  },

  maxLength: (max) => (value, fieldName) => {
    if (!value) return null;
    if (value.length > max) {
      return `${fieldName} no puede tener más de ${max} caracteres`;
    }
    return null;
  }
};

// Validate form fields
export const validateForm = (formData, validationSchema) => {
  const errors = {};
  
  for (const [field, rules] of Object.entries(validationSchema)) {
    const value = formData[field];
    
    for (const rule of rules) {
      const error = rule(value, field);
      if (error) {
        errors[field] = error;
        break; // Stop at first error for this field
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Show validation errors in toast
export const showValidationErrors = (toast, errors) => {
  const firstError = Object.values(errors)[0];
  if (firstError) {
    showError(toast, firstError, 'Error de validación');
  }
};

// Common form schemas
export const contactFormSchema = {
  name: [
    validationRules.required,
    validationRules.minLength(2),
    validationRules.maxLength(50)
  ],
  email: [
    validationRules.required,
    validationRules.email
  ],
  phone: [
    validationRules.phone
  ],
  subject: [
    validationRules.required,
    validationRules.minLength(5),
    validationRules.maxLength(100)
  ],
  message: [
    validationRules.required,
    validationRules.minLength(10),
    validationRules.maxLength(1000)
  ]
};

// Form submission helper
export const handleFormSubmission = async (
  formData,
  validationSchema,
  submitFunction,
  toast,
  setLoading,
  successMessage = 'Formulario enviado exitosamente'
) => {
  try {
    setLoading(true);

    // Validate form
    const { isValid, errors } = validateForm(formData, validationSchema);
    
    if (!isValid) {
      showValidationErrors(toast, errors);
      return false;
    }

    // Submit form
    await submitFunction(formData);
    
    showSuccess(toast, successMessage);
    return true;

  } catch (error) {
    showError(toast, error.message || 'Error al enviar el formulario');
    return false;
  } finally {
    setLoading(false);
  }
};

// Form state management helper
export const createFormState = (initialData = {}) => {
  return {
    data: initialData,
    loading: false,
    errors: {}
  };
};

// Update form field helper
export const updateFormField = (formState, setFormState) => (field, value) => {
  setFormState(prev => ({
    ...prev,
    data: {
      ...prev.data,
      [field]: value
    },
    errors: {
      ...prev.errors,
      [field]: null // Clear error when user types
    }
  }));
};

// Reset form helper
export const resetForm = (setFormState, initialData = {}) => {
  setFormState({
    data: initialData,
    loading: false,
    errors: {}
  });
};
