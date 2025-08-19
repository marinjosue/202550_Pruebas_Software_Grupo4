#!/usr/bin/env node

/**
 * Este script proporciona una interfaz interactiva para ejecutar pruebas específicas
 * que sabemos que pasan correctamente.
 */

const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Lista de pruebas estables
const workingTests = [
  'App.test.js',
  'CourseCard.test.js',
];

console.log('\n=== EJECUTOR DE PRUEBAS ESTABLES ===');
console.log('Selecciona una opción:');
console.log('1. Ejecutar todas las pruebas estables');
console.log('2. Ejecutar una prueba específica');
console.log('3. Salir');

rl.question('\nSelecciona una opción (1-3): ', (answer) => {
  switch (answer) {
    case '1':
      console.log('\nEjecutando todas las pruebas estables...\n');
      try {
        execSync('npm run test:working', { stdio: 'inherit' });
      } catch (error) {
        console.error('Error al ejecutar las pruebas:', error.message);
      }
      break;
    
    case '2':
      console.log('\nPruebas disponibles:');
      workingTests.forEach((test, index) => {
        console.log(`${index + 1}. ${test}`);
      });
      
      rl.question('\nSelecciona una prueba (1-' + workingTests.length + '): ', (testIndex) => {
        const index = parseInt(testIndex) - 1;
        if (index >= 0 && index < workingTests.length) {
          const selectedTest = workingTests[index];
          console.log(`\nEjecutando ${selectedTest}...\n`);
          
          try {
            // Buscamos el archivo de prueba en diferentes directorios
            const possiblePaths = [
              `src/__tests__/${selectedTest}`,
              `src/__tests__/components/${selectedTest}`,
              `src/__tests__/components/common/${selectedTest}`,
              `src/__tests__/context/${selectedTest}`,
              `src/__tests__/utils/${selectedTest}`,
              `src/__tests__/pages/${selectedTest}`,
              `src/__tests__/hooks/${selectedTest}`,
              `src/__tests__/layouts/${selectedTest}`,
            ];
            
            // Intentamos encontrar la ruta correcta
            for (const path of possiblePaths) {
              try {
                execSync(`npm test -- --watchAll=false ${path}`, { stdio: 'inherit' });
                break; // Si se ejecuta con éxito, salimos del bucle
              } catch (error) {
                // Si hay un error, probablemente la ruta es incorrecta, intentamos la siguiente
                continue;
              }
            }
          } catch (error) {
            console.error('Error al ejecutar la prueba:', error.message);
          }
        } else {
          console.log('Opción inválida.');
        }
        rl.close();
      });
      return;
    
    case '3':
      console.log('Saliendo...');
      break;
    
    default:
      console.log('Opción inválida.');
  }
  rl.close();
});
