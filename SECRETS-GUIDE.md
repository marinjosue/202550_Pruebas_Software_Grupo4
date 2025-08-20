# 🔐 Guía para Obtener Secrets de GitHub Actions

## ✅ Problema del Curso Resuelto
**El bug de creación de cursos ya está arreglado**: El campo `name` ahora se llama `title` en el frontend para coincidir con lo que espera el backend.

---

## 📋 Secrets Necesarios para CD

### 1. VERCEL_TOKEN ✨
**Valor**: `vercel_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**Cómo obtenerlo**:
1. Ve a [https://vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Click en "Create Token"
3. Nombre: `GitHub Actions CD`
4. Scope: `Full Account`
5. Copia el token generado

### 2. VERCEL_ORG_ID ✨
**Valor**: `team_TS8BZ3MlloyA2QCGIsLsnXfI`
*(Ya obtenido de tu proyecto)*

### 3. VERCEL_PROJECT_ID ✨  
**Valor**: `prj_0WhB22TOtUlpoZKmDiDw7lMu9dY5`
*(Ya obtenido de tu proyecto)*

### 4. RENDER_DEPLOY_HOOK 🚀
**Valor**: `https://api.render.com/deploy/srv-xxxxxxxxxxxxx?key=xxxxxxxxxx`

**Cómo obtenerlo**:
1. Ve a [https://dashboard.render.com](https://dashboard.render.com)
2. Selecciona tu servicio backend (`holistica-backend`)
3. Ve a `Settings` → `Deploy Hook`
4. Click `Create Deploy Hook`
5. Copia la URL completa

---

## 🛠️ Configurar Secrets en GitHub

### Paso a paso:
1. **Ve a tu repositorio**: `https://github.com/marinjosue/202550_Pruebas_Software_Grupo4`
2. **Click en Settings** (pestaña del repo)
3. **Sidebar izquierdo**: `Secrets and variables` → `Actions`
4. **Click**: `New repository secret`
5. **Agrega cada secret**:

```
Name: VERCEL_TOKEN
Secret: [tu token de vercel]

Name: VERCEL_ORG_ID  
Secret: team_TS8BZ3MlloyA2QCGIsLsnXfI

Name: VERCEL_PROJECT_ID
Secret: prj_0WhB22TOtUlpoZKmDiDw7lMu9dY5

Name: RENDER_DEPLOY_HOOK
Secret: [tu webhook de render]
```

---

## 🚀 Cómo Funciona el CD

### Flujo Automático:
```
1. Push to main →
2. Frontend CI (tests + build) →
3. Backend CI (tests + coverage) →  
4. Performance Tests (bundle size) →
5. Deploy to Vercel + Render
```

### Trigger Manual:
1. Ve a `Actions` tab en GitHub
2. Click en `Continuous Deployment`
3. Click `Run workflow`
4. Selecciona `main` branch
5. Click `Run workflow`

---

## 🔍 Verificar Deployment

### ✅ Logs en GitHub:
- Ve a `Actions` tab
- Click en el workflow run
- Revisa cada job

### ✅ Frontend en Vercel:
- Dashboard: [https://vercel.com/dashboard](https://vercel.com/dashboard)
- Tu app: [https://202550-pruebas-software-grupo4.vercel.app](https://202550-pruebas-software-grupo4.vercel.app)

### ✅ Backend en Render:
- Dashboard: [https://dashboard.render.com](https://dashboard.render.com)
- Logs de deployment disponibles

---

## 🎯 Qué Cambió

### ✅ Frontend:
- **Bug fix**: Campo `name` → `title` en CourseCreate.js
- **CD**: Deploy automático a Vercel cuando pasan tests

### ✅ Backend: 
- **CD**: Deploy automático a Render cuando pasan tests

### ✅ CI/CD Pipeline:
- Tests unitarios obligatorios
- Performance tests (bundle size)
- Deploy solo si todo pasa ✅
- Notificaciones automáticas

---

## 🚨 Troubleshooting

### Problema: "secrets not configured"
- **Solución**: Agrega los 4 secrets en GitHub Settings

### Problema: "Vercel deployment failed"  
- **Check**: Token válido y proyecto linkeado
- **Solución**: Re-crear token en Vercel

### Problema: "Render deployment failed"
- **Check**: Webhook URL correcta
- **Solución**: Re-crear deploy hook en Render

### Problema: "Tests failing"
- **Check**: Logs en Actions tab
- **Solución**: Fix tests antes de merge a main

---

## 🎉 ¡Listo!

Una vez configurados los secrets, cada push a `main` activará automáticamente:
- ✅ Tests unitarios
- ✅ Performance checks  
- ✅ Deploy a producción
- ✅ Notificaciones de estado

**El curso creation bug ya está arreglado** - ahora puedes crear cursos sin problemas.
