# Guía de Pruebas - Proyecto Holística

Este documento proporciona instrucciones sobre cómo ejecutar las pruebas tanto para el frontend como para el backend del proyecto Holística.

## Tabla de Contenidos

- [Frontend](#frontend)
  - [Pruebas Unitarias](#pruebas-unitarias-frontend)
  - [Pruebas E2E](#pruebas-e2e)
- [Backend](#backend)
  - [Pruebas Unitarias](#pruebas-unitarias-backend)

## Frontend

### Pruebas Unitarias Frontend

El frontend tiene configurados varios scripts para ejecutar pruebas unitarias de manera eficiente. Debido a problemas de compatibilidad con algunos componentes y estilos en el entorno de pruebas, se han configurado scripts específicos para ejecutar solo las pruebas estables que pasan correctamente.

#### Ejecutar Pruebas Estables

Para ejecutar solo las pruebas que sabemos que pasan correctamente:

```bash
npm run test:working
```

Este comando ejecutará las siguientes pruebas:
- `src/__tests__/App.test.js`
- `src/__tests__/components/CourseCard.test.js`

#### Ejecutar Pruebas en Modo Interactivo

Para seleccionar qué pruebas ejecutar mediante una interfaz de línea de comandos:

```bash
npm run test:interactive
```

#### Ejecutar Todas las Pruebas

Si desea ejecutar todas las pruebas disponibles en modo observación (watch mode):

```bash
npm run test:all
```

O generar un reporte de cobertura:

```bash
npm run test:coverage
```

### Pruebas E2E

El proyecto utiliza Cypress para las pruebas de extremo a extremo.

#### Ejecutar Pruebas E2E en Modo Headless

```bash
npm run test:e2e
```

#### Abrir el Explorador de Cypress

```bash
npm run test:e2e:open
```

## Backend

### Pruebas Unitarias Backend

El backend utiliza Jest para las pruebas unitarias y de integración.

#### Ejecutar Todas las Pruebas Backend

```bash
cd holistica-backend
npm test
```

#### Ejecutar Pruebas con Cobertura

```bash
cd holistica-backend
npm run test:coverage
```

#### Ejecutar una Prueba Específica

```bash
cd holistica-backend
npx jest nombre-del-archivo.test.js
```

Por ejemplo:
```bash
npx jest auth.controller.test.js
```

## Desarrollo de Nuevas Pruebas

### Frontend

Al desarrollar nuevas pruebas para el frontend, siga estas recomendaciones:

1. Asegúrese de mockear correctamente los componentes de PrimeReact u otras librerías que puedan causar problemas en el entorno JSDOM.
2. Evite probar estilos CSS directamente, ya que pueden causar problemas en el entorno de pruebas.
3. Una vez que sus pruebas pasen consistentemente, agréguelas a la lista de pruebas estables en:
   - `scripts/run-tests.js`
   - `scripts/test-runner.js`
   - Y al comando `test:working` en `package.json`

### Backend

Para el backend, siga estas prácticas:

1. Utilice mocks para servicios externos y bases de datos
2. Siga el patrón de Arrange-Act-Assert para estructurar sus pruebas
3. Asegúrese de limpiar cualquier estado global después de cada prueba

## Configuración CI

El proyecto está configurado con GitHub Actions para ejecutar pruebas automáticamente:

1. **Frontend**: El flujo de trabajo `frontend.yml` ejecuta las pruebas estables utilizando el script `test:stable`, genera un build y realiza un análisis de seguridad.
2. **Backend**: El flujo de trabajo `backend.yml` ejecuta todas las pruebas del backend.

En una fase posterior, se implementará el despliegue continuo (CD) con Firebase.

## Resolución de Problemas

### Problemas Comunes en las Pruebas Frontend

1. **Error de CSS en JSDOM**: Algunas pruebas pueden fallar debido a problemas de parseo de CSS en el entorno JSDOM.
2. **Problemas con PrimeReact**: Los componentes de PrimeReact pueden no renderizarse correctamente en el entorno de prueba.

### Soluciones

- Utilizar mocks para componentes de UI complejos
- Usar los scripts `test:working` o `test:stable` que evitan las pruebas problemáticas
- Ejecutar `SKIP_PREFLIGHT_CHECK=true npm test` para evitar algunos problemas de ESLint
