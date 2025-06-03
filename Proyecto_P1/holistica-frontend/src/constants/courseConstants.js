export const LEVEL_OPTIONS = [
  { label: 'Principiante', value: 'principiante' },
  { label: 'Intermedio', value: 'intermedio' },
  { label: 'Avanzado', value: 'avanzado' },
  { label: 'Todos los niveles', value: 'todos' }
];

export const STATUS_OPTIONS = [
  { label: 'Activo', value: 'activo' },
  { label: 'Próximo', value: 'proximo' },
  { label: 'Borrador', value: 'borrador' },
  { label: 'Finalizado', value: 'finalizado' }
];

export const INITIAL_FORM_DATA = {
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
};
