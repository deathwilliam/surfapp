# 🚀 Guía de Despliegue en Vercel

Esta guía te ayudará a desplegar tu aplicación Surf App en Vercel.

---

## 📋 Pre-requisitos

- ✅ Cuenta en [Vercel](https://vercel.com)
- ✅ Repositorio en GitHub con el código
- ✅ Base de datos PostgreSQL en Neon (ya configurada)

---

## 🔧 Paso 1: Preparar el Repositorio

### 1.1 Hacer commit de los cambios

```bash
git add .
git commit -m "feat: complete Phase 2 and 3 - Authentication and Student Features"
git push origin main
```

---

## 🌐 Paso 2: Conectar con Vercel

### 2.1 Importar Proyecto

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Click en **"Import Git Repository"**
3. Selecciona tu repositorio: `deathwilliam/surfapp`
4. Click en **"Import"**

### 2.2 Configurar el Proyecto

Vercel detectará automáticamente que es un proyecto Next.js.

**Framework Preset:** Next.js  
**Root Directory:** `./`  
**Build Command:** `npm run build`  
**Output Directory:** `.next`

---

## 🔐 Paso 3: Variables de Entorno

Antes de hacer deploy, configura estas variables de entorno en Vercel:

### 3.1 En la sección "Environment Variables"

Agrega las siguientes variables:

```env
# Database
DATABASE_URL=postgresql://neondb_owner:npg_3FA2YSVQXtGg@ep-dark-rain-adj7c8wq-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require

# NextAuth
NEXTAUTH_URL=https://tu-app.vercel.app
NEXTAUTH_SECRET=genera-un-secreto-aleatorio-aqui

# App
NEXT_PUBLIC_APP_URL=https://tu-app.vercel.app
NODE_ENV=production
```

### 3.2 Generar NEXTAUTH_SECRET

En tu terminal local, ejecuta:

```bash
openssl rand -base64 32
```

Copia el resultado y úsalo como `NEXTAUTH_SECRET`.

### 3.3 Importante

- Marca todas las variables para **Production**, **Preview**, y **Development**
- Después de agregar las variables, NO hagas deploy todavía

---

## 🗄️ Paso 4: Configurar Base de Datos

### 4.1 Ejecutar Migraciones

Vercel necesita que la base de datos esté lista. En tu terminal local:

```bash
# Asegúrate de tener DATABASE_URL en tu .env local
npx prisma migrate deploy
```

### 4.2 Poblar con Datos (Opcional)

Si quieres los datos de prueba en producción:

```bash
npm run db:seed
```

> ⚠️ **Nota:** En producción real, NO uses los datos de seed. Solo para demo.

---

## 🚀 Paso 5: Hacer Deploy

### 5.1 Iniciar Deploy

1. En Vercel, click en **"Deploy"**
2. Espera a que termine el build (2-5 minutos)
3. Vercel te dará una URL: `https://tu-app.vercel.app`

### 5.2 Verificar Deploy

1. Abre la URL de tu app
2. Verifica que la landing page carga correctamente
3. Intenta registrarte como estudiante
4. Intenta hacer login con las credenciales de prueba

---

## 🔄 Paso 6: Actualizar NEXTAUTH_URL

### 6.1 Obtener URL Final

Después del primer deploy, Vercel te asigna una URL permanente.

### 6.2 Actualizar Variables

1. Ve a **Settings** → **Environment Variables**
2. Edita `NEXTAUTH_URL` y `NEXT_PUBLIC_APP_URL`
3. Reemplaza con tu URL real: `https://surfapp-xxx.vercel.app`
4. Click en **"Save"**

### 6.3 Re-deploy

1. Ve a **Deployments**
2. Click en los tres puntos del último deployment
3. Click en **"Redeploy"**

---

## ✅ Verificación Final

Prueba estas funcionalidades en producción:

- [ ] Landing page carga correctamente
- [ ] Registro de estudiante funciona
- [ ] Registro de instructor funciona
- [ ] Login funciona
- [ ] Dashboard de estudiante es accesible
- [ ] Dashboard de instructor es accesible
- [ ] Búsqueda de instructores funciona
- [ ] Perfil de instructor se muestra
- [ ] Sistema de reservas funciona

---

## 🐛 Troubleshooting

### Error: "Database connection failed"

**Solución:** Verifica que `DATABASE_URL` esté correctamente configurada en Vercel.

### Error: "NextAuth configuration error"

**Solución:** Asegúrate de que `NEXTAUTH_URL` y `NEXTAUTH_SECRET` estén configurados.

### Error: "Prisma Client not generated"

**Solución:** Agrega un script de postinstall en `package.json`:

```json
"scripts": {
  "postinstall": "prisma generate"
}
```

Luego re-deploy.

---

## 📊 Monitoreo

### Ver Logs

1. En Vercel, ve a tu proyecto
2. Click en **"Deployments"**
3. Click en el deployment activo
4. Ve a **"Functions"** para ver logs en tiempo real

### Analytics

Vercel incluye analytics automáticamente. Ve a la pestaña **"Analytics"** para ver:
- Visitas
- Performance
- Errores

---

## 🎉 ¡Listo!

Tu aplicación Surf App ahora está en producción en Vercel.

**Próximos pasos:**
- Configura un dominio personalizado (opcional)
- Habilita Vercel Analytics
- Configura notificaciones de deployment

---

**URL de tu app:** https://[tu-proyecto].vercel.app
