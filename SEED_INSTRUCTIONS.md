# Seeding Production Database

Una vez que Vercel compile exitosamente los cambios, ejecuta este comando para poblar la base de datos de producción:

```powershell
# Opción 1: Usar el script
.\scripts\seed-production.ps1

# Opción 2: Curl manual
curl -X POST https://surfapp-two.vercel.app/api/admin/seed `
  -H "x-seed-key: dev-key-change-in-production"

# Opción 3: PowerShell manual
$response = Invoke-WebRequest -Uri "https://surfapp-two.vercel.app/api/admin/seed" `
  -Method POST `
  -Headers @{ "x-seed-key" = "dev-key-change-in-production" } `
  -ContentType "application/json"

$response.Content | ConvertFrom-Json | ConvertTo-Json
```

## Test Credentials

Después de ejecutar el seed, puedes log in con:

- **Student**: carlos.martinez@example.com / password123
- **Instructor**: roberto.surf@example.com / password123
- **Admin**: admin@surfapp.com / admin123

## Verificación

1. Abre https://surfapp-two.vercel.app/login
2. Intenta con `carlos.martinez@example.com` / `password123`
3. Deberías ser redirigido a `/dashboard/student`

## Variables de Entorno Requeridas

Asegúrate de que estas estén configuradas en Vercel:

- `DATABASE_URL` - Conexión a la base de datos Postgres
- `NEXTAUTH_SECRET` - Clave secreta para NextAuth (debe estar set)
- `NEXTAUTH_URL` - Debe ser `https://surfapp-two.vercel.app`
- `SEED_KEY` - (Opcional) Puedes cambiar la clave en Vercel Settings si lo deseas

## Notas

- El endpoint `/api/admin/seed` **limpia toda la base de datos** antes de crear nuevos datos
- Usa solo en desarrollo o cuando estés seguro
- El `SEED_KEY` es "dev-key-change-in-production" por defecto; deberías cambiar esto en producción
