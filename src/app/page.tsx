import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Waves, Calendar, Star, MapPin, Users, Award, Compass, Sparkles } from 'lucide-react';
import prisma from '@/lib/prisma';

// Landing page with dynamic beach locations
export default async function Home() {
  const locations = await prisma.location.findMany({
    where: { isActive: true },
    take: 9,
  });
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section with Surf City Gradient & Beach Background */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent py-24 md:py-32 lg:py-40">
          {/* Beach Background Image */}
          <div className="absolute inset-0 opacity-70">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: 'url(/images/beaches/el-tunco.png)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-secondary/60" />
          </div>

          {/* Animated Wave Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJ3YXZlcyIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjEwMCIgaGVpZ2h0PSI1MCI+PHBhdGggZD0iTTAgMjVRMjUgMCA1MCAyNVQxMDAgMjUiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCN3YXZlcykiLz48L3N2Zz4=')] opacity-30"></div>
          </div>

          <div className="container relative z-10 flex flex-col items-center text-center text-white">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
              <Waves className="h-4 w-4" />
              <span className="text-sm font-medium">Surf City - El Salvador 🇸🇻</span>
            </div>

            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Encuentra tu{' '}
              <span className="relative inline-block">
                <span className="relative z-10">Instructor de Surf</span>
                <span className="absolute bottom-2 left-0 h-3 w-full bg-accent/50"></span>
              </span>
            </h1>

            <p className="mt-6 max-w-[42rem] text-lg text-white/95 sm:text-xl md:text-2xl drop-shadow-lg">
              Descubre las mejores olas de El Salvador. Conecta con instructores certificados en El Tunco, El Sunzal, Punta Roca y más.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/search">
                <Button size="lg" className="h-14 bg-white px-8 text-lg font-semibold hover:bg-white/90 hover:scale-105 transition-transform shadow-xl" style={{ color: '#00acc1' }}>
                  <Users className="mr-2 h-5 w-5" />
                  Buscar Instructores
                </Button>
              </Link>
              <Link href="/register?type=instructor">
                <Button size="lg" className="h-14 bg-white px-8 text-lg font-semibold hover:bg-white/90 hover:scale-105 transition-transform shadow-xl" style={{ color: '#00acc1' }}>
                  <Award className="mr-2 h-5 w-5" />
                  Soy Instructor
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 md:gap-12">
              <div>
                <div className="text-3xl font-bold md:text-4xl">500+</div>
                <div className="mt-1 text-sm text-white/90">Clases Impartidas</div>
              </div>
              <div>
                <div className="text-3xl font-bold md:text-4xl">50+</div>
                <div className="mt-1 text-sm text-white/90">Instructores</div>
              </div>
              <div>
                <div className="text-3xl font-bold md:text-4xl">4.9</div>
                <div className="mt-1 text-sm text-white/90">Rating Promedio</div>
              </div>
            </div>
          </div>

          {/* Wave SVG Bottom */}
          <div className="absolute bottom-0 left-0 w-full">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
              <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
            </svg>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="mb-16 text-center">
              <h2 className="font-heading text-3xl font-bold md:text-4xl">
                ¿Cómo Funciona?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Tres simples pasos para comenzar tu aventura en el surf
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <Card className="border-2 transition-all hover:border-primary hover:shadow-lg">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#0E225C] to-[#1E73BE] text-white shadow-lg">
                    <MapPin className="h-8 w-8" />
                  </div>
                  <h3 className="font-heading text-xl font-bold">1. Busca</h3>
                  <p className="mt-3 text-muted-foreground">
                    Encuentra instructores certificados por ubicación, precio y nivel de experiencia
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 transition-all hover:border-primary hover:shadow-lg">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#0E225C] to-[#1E73BE] text-white shadow-lg">
                    <Calendar className="h-8 w-8" />
                  </div>
                  <h3 className="font-heading text-xl font-bold">2. Reserva</h3>
                  <p className="mt-3 text-muted-foreground">
                    Elige el horario que mejor te convenga y confirma tu clase al instante
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 transition-all hover:border-primary hover:shadow-lg">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#0E225C] to-[#1E73BE] text-white shadow-lg">
                    <Waves className="h-8 w-8" />
                  </div>
                  <h3 className="font-heading text-xl font-bold">3. Surfea</h3>
                  <p className="mt-3 text-muted-foreground">
                    Disfruta de tu clase personalizada y califica tu experiencia
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Surf Beaches Section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-white to-blue-50/30">
          <div className="container">
            <div className="mb-16 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
                <Compass className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Surf City El Salvador</span>
              </div>
              <h2 className="font-heading text-3xl font-bold md:text-4xl">
                Playas de Surf en El Salvador
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Descubre las mejores olas de Centroamérica en nuestras playas de clase mundial
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {locations.map((location) => (
                <Card key={location.id} className="group overflow-hidden border-2 transition-all hover:border-primary hover:shadow-xl">
                  <div className="relative h-48 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${location.imageUrl || '/images/placeholder-beach.jpg'})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-heading text-2xl font-bold text-white drop-shadow-lg">{location.name}</h3>
                      <p className="text-sm text-white/90">{location.city}</p>
                    </div>
                    {location.difficulty && (
                      <div className="absolute top-4 right-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${location.difficulty === 'Experto' ? 'bg-red-500' :
                          location.difficulty === 'Intermedio' ? 'bg-orange-500' :
                            location.difficulty === 'Principiante' ? 'bg-green-500' :
                              'bg-blue-500'
                          }`}>
                          {location.difficulty}
                        </span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {location.description}
                    </p>
                    {location.surfType && (
                      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                        <Waves className="h-4 w-4" />
                        <span>{location.surfType}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link href="/search">
                <Button size="lg" className="h-12 px-8">
                  <MapPin className="mr-2 h-5 w-5" />
                  Explorar Todas las Playas
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* AI Advisor Promotion Section */}
        <section className="py-20 bg-slate-50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

          <div className="container relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 text-left">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-emerald-700">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-bold">Nuevo: AI Surf Advisor</span>
                </div>
                <h2 className="font-heading text-3xl font-bold md:text-4xl lg:text-5xl text-[#0E225C]">
                  ¿No estás seguro de dónde surfear hoy?
                </h2>
                <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
                  Nuestro asistente experto conoce cada rincón de El Salvador. Desde el pronóstico en Punta Roca hasta la mejor pupusería en El Zonte.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link href="/ai-advisor">
                    <Button size="lg" className="h-14 bg-gradient-to-r from-[#0E225C] to-[#1E73BE] px-8 text-lg font-semibold text-white hover:scale-105 transition-transform shadow-xl">
                      Consultar con el Experto
                    </Button>
                  </Link>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="User" />
                        </div>
                      ))}
                    </div>
                    <span>+500 consultas hoy</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 relative">
                <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                  <img src="/images/beaches/el-sunzal.png" alt="Surf City AI" className="w-full h-auto aspect-[4/3] object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E225C]/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                    <p className="text-white text-sm font-medium italic">
                      "El Sunzal es perfecto hoy para un longboard session. Waves are 3-4ft and glassy."
                    </p>
                  </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent rounded-full -z-10 animate-blob"></div>
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary rounded-full -z-10 animate-blob animation-delay-2000"></div>
              </div>
            </div>
          </div>
        </section>


        {/* CTA Section with Surf City Gradient & Beach Background */}
        <section className="relative overflow-hidden bg-gradient-to-r from-primary via-secondary to-accent py-20">
          {/* Beach Background */}
          <div className="absolute inset-0 opacity-80">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: 'url(/images/beaches/el-zonte.png)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-secondary/70" />
          </div>

          <div className="container relative z-10 text-center text-white">
            <Star className="mx-auto mb-6 h-12 w-12 drop-shadow-lg" />
            <h2 className="font-heading text-3xl font-bold md:text-4xl drop-shadow-md">
              ¿Listo para Conquistar las Olas de El Salvador?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/95 drop-shadow">
              Únete a cientos de surfistas que ya están mejorando su técnica con los mejores instructores de Surf City
            </p>
            <Link href="/search">
              <Button size="lg" className="mt-8 h-14 bg-gradient-to-r from-[#00D4D4] to-[#00B8B8] px-8 text-lg font-semibold text-white hover:from-[#00B8B8] hover:to-[#008B8B] hover:scale-105 transition-transform shadow-2xl border-none">
                <Waves className="mr-2 h-5 w-5" />
                Comenzar Ahora
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
