# 🚀 Quick Start - Configuración de Base de Datos

## Paso 1: Configurar .env

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
# Database (Neon)
DATABASE_URL="postgresql://user:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="cambia-esto-por-un-string-aleatorio-seguro"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### Obtener tu DATABASE_URL de Neon:

1. Ve a https://console.neon.tech
2. Selecciona tu proyecto
3. En el dashboard, busca la sección "Connection String"
4. Copia la URL completa (debe empezar con `postgresql://`)
5. Pégala en el archivo `.env` reemplazando el valor de `DATABASE_URL`

## Paso 2: Ejecutar Migraciones y Seed

Una vez configurado el `.env`, ejecuta estos comandos:

```bash
# 1. Generar Prisma Client
npm run db:generate

# 2. Aplicar migraciones
npm run db:push

# 3. Poblar la base de datos con datos de prueba
npm run db:seed
```

## Paso 3: Verificar

```bash
# Abrir Prisma Studio para ver los datos
npm run db:studio
```

## Paso 4: Iniciar la aplicación

```bash
npm run dev
```

---

**¿Listo?** Una vez que hayas configurado el `.env`, avísame para continuar con las migraciones.
