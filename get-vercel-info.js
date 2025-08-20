#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Obteniendo información de Vercel...\n');

// Leer información del proyecto vinculado
const vercelPath = path.join(__dirname, 'holistica-frontend', '.vercel', 'project.json');

if (fs.existsSync(vercelPath)) {
  const projectInfo = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
  
  console.log('📋 Información para GitHub Secrets:');
  console.log('=====================================');
  console.log(`VERCEL_ORG_ID: ${projectInfo.orgId}`);
  console.log(`VERCEL_PROJECT_ID: ${projectInfo.projectId}`);
  console.log('');
  
  console.log('🔐 Para obtener VERCEL_TOKEN:');
  console.log('1. Ve a: https://vercel.com/account/tokens');
  console.log('2. Crea un nuevo token');
  console.log('3. Copia el token generado');
  console.log('');
  
} else {
  console.log('❌ No se encontró la información del proyecto.');
  console.log('Ejecuta: cd holistica-frontend && vercel link');
}

console.log('🚀 Para obtener RENDER_DEPLOY_HOOK:');
console.log('1. Ve a tu dashboard de Render: https://dashboard.render.com/');
console.log('2. Selecciona tu servicio backend');
console.log('3. Ve a Settings → Deploy Hook');
console.log('4. Crea un deploy hook');
console.log('5. Copia la URL del webhook');
console.log('');

console.log('📝 Cómo configurar los secrets en GitHub:');
console.log('1. Ve a tu repositorio en GitHub');
console.log('2. Settings → Secrets and variables → Actions');
console.log('3. Click "New repository secret"');
console.log('4. Agrega cada secret con su valor correspondiente');
console.log('');

console.log('✅ Una vez configurados, el CD se ejecutará automáticamente en cada push a main');
