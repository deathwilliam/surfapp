#!/usr/bin/env pwsh
# Script to seed the production database via the /api/admin/seed endpoint

$VERCEL_URL = "https://surfapp-two.vercel.app"
$SEED_KEY = "dev-key-change-in-production"

Write-Host "🌊 Seeding production database..." -ForegroundColor Blue

$response = Invoke-WebRequest -Uri "$VERCEL_URL/api/admin/seed" `
    -Method POST `
    -Headers @{ "x-seed-key" = $SEED_KEY } `
    -ContentType "application/json" `
    -ErrorAction Stop

$result = $response.Content | ConvertFrom-Json

if ($result.success) {
    Write-Host "✅ Database seeded successfully!" -ForegroundColor Green
    Write-Host "Stats:"
    Write-Host "  📍 Locations: $($result.stats.locations)"
    Write-Host "  👨‍🎓 Students: $($result.stats.students)"
    Write-Host "  🏄 Instructors: $($result.stats.instructors)"
    Write-Host "  📅 Availability slots: $($result.stats.availabilities)"
    Write-Host "  👑 Admin users: $($result.stats.admin)"
    Write-Host ""
    Write-Host "You can now log in with:"
    Write-Host "  📧 carlos.martinez@example.com / password123"
    Write-Host "  👑 admin@surfapp.com / admin123"
} else {
    Write-Host "❌ Failed to seed database:" -ForegroundColor Red
    Write-Host $result.error
    if ($result.details) {
        Write-Host "Details: $($result.details)"
    }
}
