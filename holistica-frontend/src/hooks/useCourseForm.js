import { useState } from 'react';
import { validateCourseForm, formatCourseData } from '../utils/courseValidation';
import { INITIAL_FORM_DATA } from '../constants/courseConstants';

export const useCourseForm = (initialData = INITIAL_FORM_DATA) => {
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
  };

  const validateForm = (toast) => {
    return validateCourseForm(formData, toast);
  };

  const getFormattedData = () => {
    return formatCourseData(formData);
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    resetForm,
    validateForm,
    getFormattedData,
    loading,
    setLoading
  };
};
