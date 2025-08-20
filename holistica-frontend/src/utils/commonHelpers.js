// Date formatting utilities
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'No especificada';
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  try {
    return new Date(dateString).toLocaleDateString('es-ES', { ...defaultOptions, ...options });
  } catch {
    return 'Fecha inválida';
  }
};

export const formatDateTime = (dateString) => {
  return formatDate(dateString, {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatFullDate = (dateString) => {
  return formatDate(dateString, {
    month: 'long',
    day: 'numeric'
  });
};

// Status utilities
export const getStatusSeverity = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'completado':
    case 'activo':
    case 'active':
      return 'success';
    case 'pending':
    case 'pendiente':
    case 'próximo':
      return 'warning';
    case 'failed':
    case 'fallido':
    case 'cancelado':
    case 'cancelled':
      return 'danger';
    case 'finalizado':
      return 'secondary';
    default:
      return 'info';
  }
};

export const getStatusLabel = (status) => {
  const statusMap = {
    'active': 'Activo',
    'completed': 'Completado',
    'cancelled': 'Cancelado',
    'pending': 'Pendiente',
    'activo': 'Activo',
    'completado': 'Completado',
    'cancelado': 'Cancelado',
    'pendiente': 'Pendiente',
    'próximo': 'Próximo',
    'finalizado': 'Finalizado'
  };
  return statusMap[status?.toLowerCase()] || status || 'Desconocido';
};

// Payment method utilities
export const getMethodIcon = (method) => {
  const iconMap = {
    'transferencia': 'pi pi-building',
    'stripe': 'pi pi-credit-card',
    'paypal': 'pi pi-paypal',
    'efectivo': 'pi pi-dollar',
    'tarjeta': 'pi pi-credit-card',
    'online': 'pi pi-globe'
  };
  return iconMap[method?.toLowerCase()] || 'pi pi-shopping-cart';
};

// Array utilities
export const ensureArray = (data) => Array.isArray(data) ? data : [];

// Error handling utilities
export const showToast = (toast, severity, summary, detail, life = 3000) => {
  if (toast?.current?.show) {
    toast.current.show({
      severity,
      summary,
      detail,
      life
    });
  } else {
    console.warn('Toast reference not available:', { severity, summary, detail });
  }
};

export const showError = (toast, detail, summary = 'Error') => {
  showToast(toast, 'error', summary, detail);
};

export const showSuccess = (toast, detail, summary = 'Éxito') => {
  showToast(toast, 'success', summary, detail);
};

export const showWarning = (toast, detail, summary = 'Advertencia') => {
  showToast(toast, 'warn', summary, detail);
};

// Loading states
export const createLoadingState = (message = 'Cargando...') => ({
  loading: true,
  message
});

// Navigation utilities
export const navigateWithDelay = (navigate, path, delay = 2000) => {
  setTimeout(() => navigate(path), delay);
};
