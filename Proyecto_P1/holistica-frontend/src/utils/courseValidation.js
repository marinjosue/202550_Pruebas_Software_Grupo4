import { validationRules, showValidationErrors } from './formHelpers';

export const courseValidationSchema = {
  name: [
    validationRules.required,
    validationRules.minLength(3),
    validationRules.maxLength(100)
  ],
  description: [
    validationRules.required,
    validationRules.minLength(10),
    validationRules.maxLength(500)
  ],
  price: [
    (value) => {
      if (!value || value <= 0) {
        return 'El precio debe ser mayor a 0';
      }
      return null;
    }
  ]
};

export const validateCourseForm = (formData, toast) => {
  const validations = [
    {
      condition: !formData.title?.trim(),
      message: 'El nombre del curso es obligatorio'
    },
    {
      condition: !formData.description?.trim(),
      message: 'La descripción es obligatoria'
    },
    {
      condition: !formData.price || formData.price <= 0,
      message: 'El precio debe ser mayor a 0'
    }
  ];

  for (const validation of validations) {
    if (validation.condition) {
      showValidationErrors(toast, { field: validation.message });
      return false;
    }
  }

  return true;
};

export const formatCourseData = (formData) => ({
  ...formData,
  start_date: formData.start_date ? formData.start_date.toISOString().split('T')[0] : null,
  end_date: formData.end_date ? formData.end_date.toISOString().split('T')[0] : null,
});

export const parseCourseData = (courseData) => ({
  ...courseData,
  start_date: courseData.start_date ? new Date(courseData.start_date) : null,
  end_date: courseData.end_date ? new Date(courseData.end_date) : null,
});
