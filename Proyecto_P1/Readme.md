# Holística Academy API

## Descripción
API REST para la plataforma educativa Holística Academy. Permite gestionar usuarios, cursos, pagos, inscripciones y contenido multimedia.

## Estado del Servidor
🟢 **FUNCIONANDO** - El servidor está operativo en el puerto 3000

Para verificar que el servidor esté corriendo, visita: `http://localhost:3000`

## Tecnologías
- Node.js
- Express.js
- SQLite (desarrollo) / MySQL (producción)
- JWT para autenticación
- bcrypt para encriptación de contraseñas

## Instalación y Configuración

```bash
# Navegar al directorio Backend
cd Backend

# Instalar dependencias
npm install

# Configurar base de datos
npm run setup-db

# Iniciar servidor
npm start
```

## 🔐 Usuarios por Defecto

Después de ejecutar `npm run setup-db`, tendrás disponible:

**Usuario Administrador:**
- Email: `admin@holistica.com`
- Password: `admin123`
- Rol: Admin (puede acceder a todos los endpoints)

## 📡 Configuración de Postman

### Variables de Entorno Recomendadas:
```
base_url: http://localhost:3000
token: (se llenará automáticamente al hacer login)
admin_token: (se llenará automáticamente al hacer login como admin)
user_id: (ID del usuario actual)
course_id: (ID de curso para pruebas)
```

### Headers Globales:
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

## 📋 Documentación de Endpoints

### 🔑 1. AUTENTICACIÓN

#### 1.1 Registrar Usuario
**Función:** Permite crear una nueva cuenta de usuario en el sistema.
```
POST /api/auth/register
```
**Body:**
```json
{
  "name": "Juan",
  "lastname": "Pérez",
  "email": "juan@example.com",
  "phone": "0987654321",
  "dni": "1234567890",
  "address": "Quito, Ecuador",
  "password": "123456",
  "role_id": 2
}
```
**Respuesta Exitosa:**
```json
{
  "message": "Usuario registrado exitosamente",
  "userId": 1
}
```

#### 1.2 Iniciar Sesión
**Función:** Autentica al usuario y devuelve un token JWT para acceder a endpoints protegidos.
```
POST /api/auth/login
```
**Body:**
```json
{
  "email": "juan@example.com",
  "password": "123456"
}
```
**Respuesta Exitosa:**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Juan",
    "email": "juan@example.com",
    "role": 2
  }
}
```

#### 1.3 Cerrar Sesión
**Función:** Simula el cierre de sesión del usuario (limpia el token del lado cliente).
**Métodos:** GET o POST (ambos funcionan para compatibilidad)
```
POST /api/auth/logout
Headers: Authorization: Bearer {{token}}
```
O también:
```
GET /api/auth/logout
Headers: Authorization: Bearer {{token}}
```

#### 1.4 Recuperar Contraseña
**Función:** Simula el envío de un correo para recuperar contraseña.
```
POST /api/auth/reset-password
```
**Body:**
```json
{
  "email": "juan@example.com"
}
```

### 👤 2. GESTIÓN DE USUARIOS

#### 2.1 Obtener Mi Perfil
**Función:** Devuelve la información completa del usuario autenticado.
```
GET /api/users/me
Headers: Authorization: Bearer {{token}}
```

#### 2.2 Actualizar Mi Perfil
**Función:** Permite al usuario modificar su información personal.
```
PUT /api/users/me
Headers: Authorization: Bearer {{token}}
```
**Body:**
```json
{
  "name": "Juan Carlos",
  "lastname": "Pérez",
  "phone": "0987654321",
  "address": "Quito, Pichincha, Ecuador"
}
```

#### 2.3 Listar Todos los Usuarios (Solo Admin)
**Función:** Obtiene una lista completa de todos los usuarios registrados en el sistema.
```
GET /api/users
Headers: Authorization: Bearer {{admin_token}}
```

#### 2.4 Crear Usuario (Solo Admin)
**Función:** Permite al administrador crear nuevos usuarios con cualquier rol.
```
POST /api/users
Headers: Authorization: Bearer {{admin_token}}
```
**Body:**
```json
{
  "name": "María",
  "lastname": "González",
  "email": "maria@example.com",
  "phone": "0987654322",
  "dni": "1234567891",
  "address": "Guayaquil, Ecuador",
  "password": "123456",
  "role_id": 2
}
```

### 📚 3. GESTIÓN DE CURSOS

#### 3.1 Listar Cursos (Público)
**Función:** Obtiene todos los cursos disponibles. No requiere autenticación.
```
GET /api/courses
```

#### 3.2 Ver Detalles del Curso (Público)
**Función:** Obtiene información detallada de un curso específico.
```
GET /api/courses/{{course_id}}
```

#### 3.3 Crear Curso (Solo Admin)
**Función:** Permite al administrador crear nuevos cursos en la plataforma.
```
POST /api/courses
Headers: Authorization: Bearer {{admin_token}}
```
**Body:**
```json
{
  "title": "Introducción a React",
  "description": "Aprende los fundamentos de React desde cero",
  "price": 99.99,
  "duration": 40,
  "category": "Desarrollo Web",
  "type": "online",
  "start_date": "2024-02-01",
  "end_date": "2024-03-01"
}
```

#### 3.4 Editar Curso (Solo Admin)
**Función:** Permite modificar la información de un curso existente.
```
PUT /api/courses/{{course_id}}
Headers: Authorization: Bearer {{admin_token}}
```
**Body:**
```json
{
  "title": "React Avanzado - Actualizado",
  "description": "Conceptos avanzados de React con hooks, context y mejores prácticas",
  "price": 149.99,
  "duration": 60,
  "category": "Desarrollo Web",
  "type": "online",
  "start_date": "2024-02-15",
  "end_date": "2024-04-15"
}
```

#### 3.5 Eliminar Curso (Solo Admin)
**Función:** Elimina permanentemente un curso del sistema.
```
DELETE /api/courses/{{course_id}}
Headers: Authorization: Bearer {{admin_token}}
```

### 💳 4. GESTIÓN DE PAGOS

#### 4.1 Realizar Pago
**Función:** Procesa el pago de un curso e inscribe automáticamente al usuario.
```
POST /api/payments
Headers: Authorization: Bearer {{token}}
```
**Body:**
```json
{
  "course_id": 1,
  "amount": 99.99,
  "method": "stripe"
}
```
**Métodos disponibles:** `transferencia`, `online`, `stripe`, `efectivo`, `paypal`, `tarjeta`

#### 4.2 Ver Historial de Pagos
**Función:** Muestra todos los pagos realizados por el usuario autenticado.
```
GET /api/payments/history
Headers: Authorization: Bearer {{token}}
```

### 🎓 5. GESTIÓN DE INSCRIPCIONES

#### 5.1 Inscribirse a un Curso
**Función:** Inscribe al usuario en un curso específico (sin pago).
```
POST /api/enrollments
Headers: Authorization: Bearer {{token}}
```
**Body:**
```json
{
  "course_id": 1
}
```

#### 5.2 Ver Mis Inscripciones
**Función:** Lista todos los cursos en los que está inscrito el usuario.
```
GET /api/enrollments/my-enrollments
Headers: Authorization: Bearer {{token}}
```

#### 5.3 Actualizar Estado de Inscripción (Solo Admin)
**Función:** Permite al admin cambiar el estado de progreso de una inscripción.
```
PUT /api/enrollments/{{enrollment_id}}/status
Headers: Authorization: Bearer {{admin_token}}
```
**Body:**
```json
{
  "status": "completado"
}
```
**Estados disponibles:** `inscrito`, `en_progreso`, `completado`, `abandonado`

### 📄 6. GESTIÓN DE CONTENIDO

#### 6.1 Subir Contenido (Solo Admin)
**Función:** Permite agregar material educativo (videos, documentos) a un curso.
```
POST /api/admin/content/upload
Headers: Authorization: Bearer {{admin_token}}
```
**Body:**
```json
{
  "course_id": 1,
  "title": "Lección 1: Introducción",
  "type": "video",
  "url": "https://example.com/video1.mp4"
}
```
**Tipos disponibles:** `video`, `audio`, `documento`, `imagen`

#### 6.2 Ver Contenido de un Curso
**Función:** Lista todo el material disponible para un curso específico.
```
GET /api/admin/content/{{course_id}}
Headers: Authorization: Bearer {{token}}
```

#### 6.3 Editar Contenido (Solo Admin)
**Función:** Modifica la información de un contenido existente.
```
PUT /api/admin/content/{{content_id}}
Headers: Authorization: Bearer {{admin_token}}
```

#### 6.4 Eliminar Contenido (Solo Admin)
**Función:** Elimina permanentemente un contenido del curso.
```
DELETE /api/admin/content/{{content_id}}
Headers: Authorization: Bearer {{admin_token}}
```

### 🔔 7. NOTIFICACIONES

#### 7.1 Ver Notificaciones No Leídas
**Función:** Obtiene todas las notificaciones pendientes del usuario.
```
GET /api/notifications/unread
Headers: Authorization: Bearer {{token}}
```

#### 7.2 Marcar Notificación como Leída
**Función:** Marca una notificación específica como vista.
```
PUT /api/notifications/{{notification_id}}/read
Headers: Authorization: Bearer {{token}}
```

#### 7.3 Enviar Notificación (Solo Admin)
**Función:** Permite al admin enviar notificaciones personalizadas a usuarios.
```
POST /api/notifications
Headers: Authorization: Bearer {{admin_token}}
```
**Body:**
```json
{
  "user_id": 1,
  "message": "Nuevo contenido disponible en tu curso"
}
```

### 📊 8. REPORTES (Solo Admin)

#### 8.1 Reporte de Cursos
**Función:** Genera estadísticas detalladas sobre ventas, inscripciones y abandono de cursos.
```
GET /api/reports/courses
Headers: Authorization: Bearer {{admin_token}}
```

#### 8.2 Reporte Financiero
**Función:** Muestra análisis de ingresos, transacciones y tendencias financieras.
```
GET /api/reports/financial
Headers: Authorization: Bearer {{admin_token}}
```

### 📅 9. GESTIÓN DE HORARIOS

#### 9.1 Ver Todos los Horarios
**Función:** Lista los horarios de todos los cursos disponibles.
```
GET /api/schedules
Headers: Authorization: Bearer {{token}}
```

#### 9.2 Ver Horarios por Curso
**Función:** Muestra el cronograma específico de un curso.
```
GET /api/schedules/course/{{course_id}}
Headers: Authorization: Bearer {{token}}
```

#### 9.3 Crear Horario (Solo Admin)
**Función:** Establece un nuevo horario para un curso.
```
POST /api/schedules
Headers: Authorization: Bearer {{admin_token}}
```
**Body:**
```json
{
  "course_id": 1,
  "day_of_week": "lunes",
  "start_time": "09:00:00",
  "end_time": "11:00:00",
  "instructor_id": 1
}
```

#### 9.4 Actualizar Horario (Solo Admin)
**Función:** Modifica un horario existente.
```
PUT /api/schedules/{{schedule_id}}
Headers: Authorization: Bearer {{admin_token}}
```

#### 9.5 Eliminar Horario (Solo Admin)
**Función:** Elimina un horario del sistema.
```
DELETE /api/schedules/{{schedule_id}}
Headers: Authorization: Bearer {{admin_token}}
```

## 🛠️ Endpoints de Diagnóstico

### Verificar Estado del Servidor
**Función:** Confirma que la API está funcionando correctamente.
```
GET /health
```

### Verificar Conexión a Base de Datos
**Función:** Prueba la conectividad con la base de datos.
```
GET /health/db
```

### Información de la API
**Función:** Muestra detalles sobre la API y endpoints disponibles.
```
GET /
```

## 🚀 Configuración Completa en Postman

### Paso 1: Crear Nuevo Environment
1. En Postman, click en "Environments" → "Create Environment"
2. Nombrar: `Holistica Academy Local`
3. Agregar variables:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| base_url | http://localhost:3000 | http://localhost:3000 |
| token | | |
| admin_token | | |
| user_id | | |
| course_id | | |

### Paso 2: Configurar Scripts Automáticos

#### Para el endpoint de Login (POST /api/auth/login):
En la pestaña "Tests", agregar:
```javascript
if (responseCode.code === 200) {
    const jsonData = pm.response.json();
    
    // Guardar token y datos del usuario
    pm.environment.set("token", jsonData.token);
    pm.environment.set("user_id", jsonData.user.id);
    
    // Si es admin, guardar token como admin_token también
    if (jsonData.user.role === 1) {
        pm.environment.set("admin_token", jsonData.token);
    }
    
    console.log("Login exitoso. Token guardado automáticamente.");
}
```

#### Para el endpoint de Registro (POST /api/auth/register):
En la pestaña "Tests", agregar:
```javascript
if (responseCode.code === 201) {
    const jsonData = pm.response.json();
    pm.environment.set("user_id", jsonData.userId);
    console.log("Usuario registrado. ID guardado:", jsonData.userId);
}
```

### Paso 3: Headers Globales por Colección
1. En tu colección, ir a "Authorization"
2. Seleccionar "Bearer Token"
3. En "Token" poner: `{{token}}`

### Paso 4: Orden de Testing Recomendado

#### Para Usuario Regular:
1. **POST** `/api/auth/register` - Crear cuenta
2. **POST** `/api/auth/login` - Obtener token automáticamente
3. **GET** `/api/users/me` - Verificar perfil
4. **GET** `/api/courses` - Ver cursos disponibles
5. **POST** `/api/enrollments` - Inscribirse a un curso
6. **POST** `/api/payments` - Realizar pago
7. **GET** `/api/enrollments/my-enrollments` - Ver mis cursos
8. **GET** `/api/notifications/unread` - Ver notificaciones
9. **GET/POST** `/api/auth/logout` - Cerrar sesión

#### Para Administrador:
1. **POST** `/api/auth/login` - Login con admin@holistica.com
2. **GET** `/api/users` - Ver todos los usuarios
3. **POST** `/api/courses` - Crear nuevo curso
4. **POST** `/api/admin/content/upload` - Subir contenido
5. **GET** `/api/reports/courses` - Ver reportes de cursos
6. **GET** `/api/reports/financial` - Ver reportes financieros
7. **POST** `/api/notifications` - Enviar notificación
8. **GET** `/api/schedules` - Ver horarios

## 🛠️ Scripts de Configuración Inicial

### Ejecutar Setup de Base de Datos:
```bash
cd Backend
npm run setup-db
```

### Verificar Conectividad:
```bash
# Verificar servidor
curl http://localhost:3000/health

# Verificar base de datos
curl http://localhost:3000/health/db
```

## 📥 Colección de Postman Lista para Importar

### Crear archivo: `Holistica_Academy_API.postman_collection.json`
```json
{
  "info": {
    "name": "Holística Academy API",
    "description": "Colección completa para probar la API de Holística Academy",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{token}}",
        "type": "string"
      }
    ]
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3000",
      "type": "string"
    }
  ]
}
```

## ⚠️ Solución de Problemas Comunes

### Error 404 en /api/auth/logout:
- **Problema:** Usando método GET en lugar de POST
- **Solución:** Cambiar a POST o usar GET (ambos están habilitados)

### Token no se guarda automáticamente:
- **Problema:** Falta script en Tests del login
- **Solución:** Agregar el script de Tests mencionado arriba

### Error de conexión a BD:
- **Problema:** Base de datos no configurada
- **Solución:** Ejecutar `npm run setup-db`

### Headers de autorización no funcionan:
- **Problema:** Token mal configurado
- **Solución:** Verificar formato `Bearer {{token}}`

## 🐛 Solución de Problemas

### Error "Cannot destructure property of req.body as it is undefined":
- **Problema:** El body de la petición está llegando vacío
- **Solución 1:** Verificar que el Content-Type sea `application/json`
- **Solución 2:** Asegurarse de enviar datos en el body
- **Solución 3:** Verificar que el middleware body-parser esté funcionando

### Ejemplo correcto para actualizar perfil:
```json
PUT /api/users/me
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "name": "Juan Carlos",
  "lastname": "Pérez Updated",
  "phone": "0987654321",
  "address": "Nueva dirección"
}
```

### Error 401 "No autorizado":
- Verificar que el token esté en el header Authorization
- Confirmar formato: `Bearer tu_token_aqui`
- Renovar token si ha expirado

### Error 403 "Sin permisos":
- Verificar que el usuario tenga el rol correcto
- Admin endpoints requieren role_id = 1

### Error 500 "Error del servidor":
- Verificar que la base de datos esté funcionando
- Revisar logs del servidor en la consola
- Verificar endpoint `/health/db`

### Error "Data truncated for column 'method'":
- **Problema:** El método de pago no está en los valores ENUM permitidos
- **Solución:** Usar solo métodos válidos: transferencia, online, stripe, efectivo, paypal, tarjeta
- **Actualizar BD:** Ejecutar `npm run setup-db` para agregar nuevos métodos ENUM

# Holística Academy - Plataforma Educativa

## Descripción
Plataforma completa para gestión de cursos en línea con backend API REST y frontend React con PrimeReact.

## Estado del Proyecto
🟢 **Backend API**: Funcionando en puerto 3000
🟢 **Frontend React**: Listo para desarrollo en puerto 3001

## Tecnologías

### Backend
- Node.js
- Express.js
- SQLite (desarrollo) / MySQL (producción)
- JWT para autenticación
- bcrypt para encriptación de contraseñas

### Frontend
- React 19
- PrimeReact UI Components
- React Router DOM
- Axios para HTTP requests
- SCSS para estilos

## Instalación y Configuración

### Backend
```bash
# Navegar al directorio Backend
cd Backend

# Instalar dependencias
npm install

# Configurar base de datos
npm run setup-db

# Iniciar servidor
npm start
```

### Frontend
```bash
# Navegar al directorio Frontend
cd holistica-frontend

# Instalar dependencias
npm install

# Iniciar aplicación de desarrollo
npm start
```

La aplicación estará disponible en:
- Backend API: http://localhost:3000
- Frontend: http://localhost:3001

## 🔐 Usuarios por Defecto

Después de ejecutar `npm run setup-db`, tendrás disponible:

**Usuario Administrador:**
- Email: `admin@holistica.com`
- Password: `admin123`
- Rol: Admin (acceso completo)

## 🎨 Características del Frontend

### Componentes Principales
- **Autenticación**: Login, registro, recuperación de contraseña
- **Cursos**: Listado, detalles, inscripción, mis cursos
- **Panel de Usuario**: Perfil, configuración
- **Panel de Admin**: Gestión de cursos, usuarios, reportes
- **Responsive Design**: Optimizado para móviles y desktop

### Páginas Disponibles
- `/` - Página principal
- `/login` - Iniciar sesión
- `/register` - Registrarse
- `/courses` - Catálogo de cursos
- `/courses/:id` - Detalles de curso
- `/my-courses` - Mis cursos (requiere autenticación)
- `/profile` - Mi perfil (requiere autenticación)
- `/admin` - Dashboard administrativo (solo admin)
- `/admin/courses` - Gestión de cursos (solo admin)
- `/admin/users` - Gestión de usuarios (solo admin)

### Funcionalidades
- ✅ Autenticación JWT con persistencia
- ✅ Navegación protegida por roles
- ✅ Gestión de estado global (Context API)
- ✅ Notificaciones toast
- ✅ Diseño responsive con PrimeReact
- ✅ Manejo de errores centralizado
- ✅ Loading states y spinners

## 🚀 Próximos Pasos

1. **Instalar dependencias del frontend**:
   ```bash
   cd holistica-frontend
   npm install
   ```

2. **Agregar React Router DOM**:
   ```bash
   npm install react-router-dom axios
   ```

3. **Iniciar desarrollo**:
   ```bash
   npm start
   ```

4. **Personalizar estilos** en `src/styles/global.scss`

## 📁 Estructura del Frontend

```
holistica-frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   ├── Auth/
│   │   ├── UI/
│   │   └── Course/
│   ├── pages/
│   │   ├── Home/
│   │   ├── Auth/
│   │   ├── Courses/
│   │   ├── User/
│   │   └── Admin/
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ToastContext.jsx
│   ├── services/
│   │   ├── apiClient.js
│   │   ├── authService.js
│   │   └── courseService.js
│   ├── styles/
│   │   └── global.scss
│   ├── App.jsx
│   └── main.js
└── package.json
```