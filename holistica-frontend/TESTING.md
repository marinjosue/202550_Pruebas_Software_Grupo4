# Testing Suite - Holística Frontend

## 📋 Resumen

Este proyecto incluye una suite completa de pruebas para garantizar la calidad y funcionamiento correcto de la aplicación frontend de Holística Center.

## 🧪 Tipos de Pruebas

### 1. Pruebas Unitarias (Unit Tests)
- **Framework**: Jest + React Testing Library
- **Ubicación**: `src/__tests__/`
- **Propósito**: Probar componentes individuales y funciones de utilidad
- **Cobertura objetivo**: 70% mínimo

### 2. Pruebas de Integración (Integration Tests)
- **Framework**: Jest + React Testing Library
- **Ubicación**: `src/__tests__/integration/`
- **Propósito**: Probar la interacción entre componentes y servicios

### 3. Pruebas End-to-End (E2E)
- **Framework**: Cypress
- **Ubicación**: `cypress/e2e/`
- **Propósito**: Probar flujos completos de usuario

## 🚀 Comandos Disponibles

### Pruebas Unitarias e Integración
```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas con coverage
npm run test:coverage

# Ejecutar pruebas en modo CI
npm run test:ci
```

### Pruebas E2E con Cypress
```bash
# Abrir Cypress en modo interactivo
npm run cypress:open

# Ejecutar Cypress en modo headless
npm run cypress:run

# Ejecutar Cypress con interfaz gráfica
npm run cypress:run:headed
```

### Scripts de Automatización
```bash
# En Windows
run-tests.bat

# En Linux/Mac
chmod +x run-tests.sh
./run-tests.sh
```

## 📁 Estructura de Archivos

```
src/
├── __tests__/
│   ├── components/          # Pruebas de componentes
│   │   ├── Navbar.test.js
│   │   └── ConnectionStatus.test.js
│   ├── pages/               # Pruebas de páginas
│   │   └── Login.test.js
│   ├── hooks/               # Pruebas de hooks
│   │   └── useAuth.test.js
│   ├── services/            # Pruebas de servicios
│   │   └── authService.test.js
│   ├── utils/               # Pruebas de utilidades
│   │   └── courseValidation.test.js
│   └── integration/         # Pruebas de integración
│       ├── Authentication.test.js
│       └── Navigation.test.js
├── setupTests.js            # Configuración global de Jest
└── ...

cypress/
├── e2e/                     # Pruebas E2E
│   ├── authentication.cy.js
│   └── navigation.cy.js
├── fixtures/                # Datos de prueba
│   └── testData.json
├── support/                 # Comandos personalizados
│   ├── commands.js
│   └── index.js
└── ...
```

## 🔧 Configuración

### Jest (jest.config.js)
- Cobertura mínima: 70%
- Reportes: HTML, LCOV, JSON
- Timeouts: 10 segundos
- Entorno: jsdom

### Cypress (cypress.config.js)
- Base URL: http://localhost:3000
- Viewports: 1280x720
- Videos y screenshots habilitados
- Timeouts: 10 segundos

## 📊 Cobertura de Pruebas

### Componentes Cubiertos
- ✅ App.js
- ✅ Navbar.js
- ✅ ConnectionStatus.js
- ✅ Login.js

### Servicios Cubiertos
- ✅ authService.js
- ✅ Validaciones de cursos

### Hooks Cubiertos
- ✅ useAuth

### Flujos E2E Cubiertos
- ✅ Autenticación completa
- ✅ Navegación principal
- ✅ Gestión de usuarios
- ✅ Funcionalidades de admin

## 🤖 Automatización CI/CD

### GitHub Actions (.github/workflows/frontend.yml)

El pipeline incluye:

1. **Test Job**
   - Pruebas unitarias e integración
   - Múltiples versiones de Node.js
   - Reporte de cobertura

2. **E2E Tests Job**
   - Pruebas Cypress
   - Capturas de pantalla en fallos
   - Videos de ejecución

3. **Build Job**
   - Verificación de build de producción
   - Artefactos de build

4. **Security Scan Job**
   - Auditoría de dependencias
   - Verificación de vulnerabilidades

5. **Performance Test Job**
   - Lighthouse CI
   - Solo en rama main

6. **Deploy Job**
   - Despliegue automático
   - Smoke tests
   - Notificaciones

## 📝 Mejores Prácticas

### Escritura de Pruebas
1. **AAA Pattern**: Arrange, Act, Assert
2. **Nombres descriptivos**: Describe qué hace la prueba
3. **Un solo concepto por prueba**
4. **Usar data-testid para selectores estables**
5. **Mockear dependencias externas**

### Mantenimiento
1. **Actualizar pruebas con cambios de código**
2. **Revisar cobertura regularmente**
3. **Limpiar pruebas obsoletas**
4. **Documentar casos edge complejos**

## 🐛 Debugging

### Pruebas Unitarias
```bash
# Ejecutar pruebas en modo watch
npm test -- --watch

# Ejecutar una prueba específica
npm test -- --testNamePattern="Login"

# Debug con breakpoints
npm test -- --inspect-brk
```

### Pruebas E2E
```bash
# Abrir Cypress con debugging
npm run cypress:open

# Ejecutar con logs detallados
DEBUG=cypress:* npm run cypress:run
```

## 📈 Métricas de Calidad

### Objetivos de Cobertura
- **Statements**: 70% mínimo
- **Branches**: 70% mínimo  
- **Functions**: 70% mínimo
- **Lines**: 70% mínimo

### Tiempo de Ejecución
- **Pruebas unitarias**: < 30 segundos
- **Pruebas E2E**: < 5 minutos
- **Pipeline completo**: < 15 minutos

## 🔗 Enlaces Útiles

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress Documentation](https://docs.cypress.io/)
- [Testing Best Practices](https://testingjavascript.com/)

## 🆘 Troubleshooting

### Problemas Comunes

1. **Tests fallan por timeouts**
   - Aumentar timeout en configuración
   - Verificar mocks de APIs

2. **Cypress no encuentra elementos**
   - Usar data-testid
   - Verificar selectores
   - Esperar elementos con cy.wait()

3. **Coverage bajo**
   - Revisar archivos excluidos
   - Agregar pruebas para funciones sin cubrir

4. **CI/CD falla**
   - Verificar variables de entorno
   - Revisar permisos de GitHub Actions
   - Verificar dependencias

## 👥 Contribución

1. Escribir pruebas para nuevos features
2. Mantener cobertura > 70%
3. Ejecutar suite completa antes de PR
4. Documentar casos de prueba complejos
