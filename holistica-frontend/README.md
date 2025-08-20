# Holística Center - Frontend

Una plataforma web moderna para cursos de cosmetología y medicina alternativa, especializada en masajes terapéuticos y bienestar integral.

## 🌟 Características

- **Gestión de Cursos**: Explorar, inscribirse y gestionar cursos especializados
- **Modalidades de Estudio**: Presencial, semipresencial y online
- **Autenticación Segura**: Sistema de login/registro con roles de usuario
- **Panel de Administración**: Gestión completa de cursos y usuarios
- **Pagos Integrados**: Sistema de pagos para inscripciones
- **Interfaz Moderna**: Diseño responsive con PrimeReact

## 🚀 Tecnologías Utilizadas

- **React 18** - Framework principal
- **React Router v6** - Navegación y enrutamiento
- **PrimeReact** - Componentes UI y tema
- **PrimeIcons** - Iconografía
- **Context API** - Gestión de estado global
- **Axios** - Cliente HTTP para API calls

## 📋 Prerequisitos

- Node.js (versión 16 o superior)
- npm o yarn
- Backend API ejecutándose en puerto 3000

## 🔧 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd holistica-frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Crear archivo .env en la raíz del proyecto
   REACT_APP_API_URL=http://localhost:3000/api
   REACT_APP_ENVIRONMENT=development
   ```

4. **Iniciar la aplicación**
   ```bash
   npm start
   ```

La aplicación estará disponible en [http://localhost:3001](http://localhost:3001)

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── common/         # Componentes comunes
│   ├── courses/        # Componentes específicos de cursos
│   └── layout/         # Componentes de layout
├── context/            # Context providers (Auth, Cart)
├── hooks/              # Custom hooks
├── layouts/            # Layouts principales
├── pages/              # Páginas de la aplicación
│   ├── auth/          # Páginas de autenticación
│   ├── courses/       # Páginas de cursos
│   ├── user/          # Páginas de usuario
│   └── admin/         # Páginas de administración
├── services/           # Servicios API
├── styles/            # Archivos CSS
├── utils/             # Utilidades y helpers
└── routes/            # Configuración de rutas
```

## 🎯 Funcionalidades Principales

### Para Estudiantes
- ✅ Explorar catálogo de cursos
- ✅ Ver detalles completos de cada curso
- ✅ Sistema de inscripciones con pagos
- ✅ Seguimiento de progreso académico
- ✅ Gestión de perfil personal

### Para Administradores
- ✅ Crear y editar cursos
- ✅ Gestionar usuarios y roles
- ✅ Ver reportes y estadísticas
- ✅ Moderar contenido

### Modalidades de Cursos
- 🏢 **Presencial**: 7 meses, 28 clases, interacción directa
- 🏢💻 **Semipresencial**: 5 meses, 20 clases, modalidad híbrida
- 💻 **Online**: 3 meses, 12 clases, totalmente virtual

## 🔐 Autenticación y Roles

- **Estudiante**: Acceso a cursos y perfil personal
- **Administrador**: Acceso completo al sistema

## 📱 Responsive Design

La aplicación está optimizada para:
- 📱 Dispositivos móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)

## 🎨 Temas y Estilos

- Tema principal: Lara Light Cyan (PrimeReact)
- Paleta de colores enfocada en bienestar y salud
- Componentes customizados para la marca

## 🔗 Scripts Disponibles

### `npm start`
Ejecuta la aplicación en modo desarrollo.\
Abre [http://localhost:3001](http://localhost:3001) en tu navegador.

### `npm test`
Ejecuta los tests en modo interactivo.

### `npm run build`
Construye la aplicación para producción en la carpeta `build`.\
Optimiza el build para el mejor rendimiento.

### `npm run lint`
Ejecuta ESLint para revisar el código.

### `npm run lint:fix`
Corrige automáticamente los errores de ESLint.

## 🌐 Variables de Entorno

```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_ENVIRONMENT=development
REACT_APP_VERSION=1.0.0
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Contacto y Soporte

- **Email**: contacto@holisticacenter.com
- **WhatsApp**: [Grupo de Soporte](https://chat.whatsapp.com/DKUeRaOpLTeEWAmE8gpvhI)
- **Teléfono**: +593 99 123 4567

## 📜 Licencia

Este proyecto es privado y pertenece a Holística Center.

## 🔄 Actualizaciones Recientes

- ✅ Implementación de sistema de autenticación
- ✅ Integración con backend API
- ✅ Sistema de pagos funcional
- ✅ Panel de administración completo
- ✅ Responsive design optimizado

## 🚨 Problemas Conocidos

- Verificar que el backend esté ejecutándose en puerto 3000
- Algunas funcionalidades requieren conexión a internet
- El sistema de pagos está en modo de prueba

## 📈 Roadmap

- [ ] Implementar notificaciones push
- [ ] Añadir sistema de chat en vivo
- [ ] Integrar videoconferencias
- [ ] App móvil nativa
- [ ] Sistema de calificaciones y reseñas

---

**Desarrollado por**: Grupo 4 - ESPE Universidad de las Fuerzas Armadas\
**Curso**: Pruebas de Software\
**Versión**: 1.0.0
