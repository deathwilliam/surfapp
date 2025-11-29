# 🗄️ Database Setup Guide

Esta guía te ayudará a configurar la base de datos PostgreSQL para la aplicación de surf.

## Opciones de Base de Datos

Tienes varias opciones para configurar PostgreSQL:

### Opción 1: PostgreSQL Local (Recomendado para desarrollo)

#### Windows

1. **Descargar PostgreSQL**
   - Ve a https://www.postgresql.org/download/windows/
   - Descarga el instalador (versión 14 o superior)
   - Ejecuta el instalador y sigue las instrucciones

2. **Durante la instalación:**
   - Puerto: `5432` (default)
   - Usuario: `postgres`
   - Contraseña: (elige una contraseña segura)

3. **Crear la base de datos**
   ```bash
   # Abre PowerShell o CMD
   psql -U postgres
   
   # Dentro de psql, ejecuta:
   CREATE DATABASE surf_app_db;
   \q
   ```

4. **Configurar .env**
   ```env
   DATABASE_URL="postgresql://postgres:tu_contraseña@localhost:5432/surf_app_db?schema=public"
   ```

### Opción 2: Supabase (Gratis, Cloud)

1. **Crear cuenta en Supabase**
   - Ve a https://supabase.com
   - Crea una cuenta gratuita
   - Crea un nuevo proyecto

2. **Obtener la URL de conexión**
   - En tu proyecto, ve a `Settings` → `Database`
   - Copia la `Connection String` (URI)
   - Cambia `[YOUR-PASSWORD]` por tu contraseña

3. **Configurar .env**
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres?schema=public"
   ```

### Opción 3: Railway (Gratis, Cloud)

1. **Crear cuenta en Railway**
   - Ve a https://railway.app
   - Crea una cuenta con GitHub
   - Crea un nuevo proyecto

2. **Agregar PostgreSQL**
   - Click en `+ New` → `Database` → `PostgreSQL`
   - Espera a que se provisione

3. **Obtener la URL de conexión**
   - Click en el servicio PostgreSQL
   - Ve a la pestaña `Connect`
   - Copia la `Postgres Connection URL`

4. **Configurar .env**
   ```env
   DATABASE_URL="postgresql://postgres:xxxxx@containers-us-west-xx.railway.app:xxxx/railway"
   ```

### Opción 4: Neon (Gratis, Serverless)

1. **Crear cuenta en Neon**
   - Ve a https://neon.tech
   - Crea una cuenta gratuita
   - Crea un nuevo proyecto

2. **Obtener la URL de conexión**
   - En el dashboard, copia la `Connection String`

3. **Configurar .env**
   ```env
   DATABASE_URL="postgresql://user:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```

## Configuración del Archivo .env

1. **Crea el archivo `.env` en la raíz del proyecto**
   ```bash
   # En la raíz del proyecto (surf-app-sv/)
   # Crea un archivo llamado .env
   ```

2. **Agrega las variables de entorno mínimas**
   ```env
   # Database (usa la URL de la opción que elegiste)
   DATABASE_URL="postgresql://..."
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="tu-secreto-super-seguro-cambialo-en-produccion"
   
   # App
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   NODE_ENV="development"
   ```

## Ejecutar Migraciones y Seed

Una vez que tengas configurado el archivo `.env`:

```bash
# 1. Generar el Prisma Client
npm run db:generate

# 2. Aplicar las migraciones a la base de datos
npm run db:push

# 3. Poblar la base de datos con datos de prueba
npm run db:seed
```

## Verificar la Instalación

```bash
# Abrir Prisma Studio para ver los datos
npm run db:studio
```

Esto abrirá una interfaz web en `http://localhost:5555` donde podrás ver todas las tablas y datos.

## Datos de Prueba

Después de ejecutar el seed, tendrás:

### 📍 Ubicaciones
- Playa El Tunco
- Playa El Sunzal
- Playa La Paz
- Playa El Zonte
- Playa Las Flores

### 👨‍🎓 Estudiantes (3)
- carlos.martinez@example.com / password123
- maria.lopez@example.com / password123
- jose.hernandez@example.com / password123

### 🏄 Instructores (4)
- roberto.surf@example.com / password123 ($25/hr, 4.8★)
- ana.waves@example.com / password123 ($20/hr, 4.9★)
- diego.ocean@example.com / password123 ($35/hr, 4.7★)
- lucia.beach@example.com / password123 ($18/hr, 5.0★)

### 👑 Admin
- admin@surfapp.com / admin123

### 📅 Disponibilidad
- 14 días de disponibilidad para cada instructor
- Slots de mañana (8:00-10:00) y tarde (14:00-16:00)
- Slots adicionales de fin de semana (16:30-18:30)

## Solución de Problemas

### Error: "Connection refused"
- Verifica que PostgreSQL esté corriendo
- Verifica el puerto (default: 5432)
- Verifica el usuario y contraseña

### Error: "Database does not exist"
- Crea la base de datos manualmente con `CREATE DATABASE surf_app_db;`

### Error: "Missing environment variable"
- Verifica que el archivo `.env` esté en la raíz del proyecto
- Verifica que `DATABASE_URL` esté correctamente configurada
- Reinicia el servidor de desarrollo

## Próximos Pasos

Una vez que la base de datos esté configurada y poblada:

1. ✅ Ejecutar el servidor de desarrollo: `npm run dev`
2. ✅ Verificar que la app cargue en `http://localhost:3000`
3. ✅ Continuar con la Fase 2: Sistema de Autenticación

---

**¿Necesitas ayuda?** Déjame saber qué opción elegiste y si encuentras algún problema.
