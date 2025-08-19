const { ValidationError } = require('../utils/errorHandler');

const validateRegistration = (req, res, next) => {
  const { name, lastname, email, password, phone, dni } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres');
  }

  if (!lastname || lastname.trim().length < 2) {
    errors.push('El apellido debe tener al menos 2 caracteres');
  }


  if (
    !email ||
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
  ) {
    errors.push('Email inválido');
  }

  if (!password || password.length < 6) {
    errors.push('La contraseña debe tener al menos 6 caracteres');
  }

  if (!phone || !/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
    errors.push('Teléfono inválido (10 dígitos)');
  }

  if (!dni || dni.trim().length < 8) {
    errors.push('DNI inválido');
  }

  if (errors.length > 0) {
    return next(new ValidationError(errors.join(', ')));
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email) {
    errors.push('Email es requerido');
  }

  if (!password) {
    errors.push('Contraseña es requerida');
  }

  if (errors.length > 0) {
    return next(new ValidationError(errors.join(', ')));
  }

  next();
};

const validateCourse = (req, res, next) => {
  const { title, description, price, duration, category } = req.body;
  const errors = [];

  if (!title || title.trim().length < 3) {
    errors.push('El título debe tener al menos 3 caracteres');
  }

  if (!description || description.trim().length < 10) {
    errors.push('La descripción debe tener al menos 10 caracteres');
  }

  if (!price || price < 0) {
    errors.push('El precio debe ser mayor o igual a 0');
  }

  if (!duration || duration < 1) {
    errors.push('La duración debe ser mayor a 0');
  }

  if (!category || category.trim().length < 2) {
    errors.push('La categoría es requerida');
  }

  if (errors.length > 0) {
    return next(new ValidationError(errors.join(', ')));
  }

  next();
};

const validatePayment = (req, res, next) => {
  const { course_id, amount, method } = req.body;
  const errors = [];

  if (!course_id) {
    errors.push('ID del curso es requerido');
  }

  if (!amount || amount <= 0) {
    errors.push('El monto debe ser mayor a 0');
  }

  if (!method || !['stripe', 'transferencia', 'efectivo'].includes(method)) {
    errors.push('Método de pago inválido');
  }

  if (errors.length > 0) {
    return next(new ValidationError(errors.join(', ')));
  }

  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateCourse,
  validatePayment
};
