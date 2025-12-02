import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Waves, Calendar, Star, MapPin, Users, Award } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section with Ocean Gradient */}
        <section className="relative overflow-hidden bg-gradient-to-br from-cyan-500 via-blue-500 to-blue-600 py-24 md:py-32 lg:py-40">
          {/* Animated Wave Pattern Overlay */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJ3YXZlcyIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjEwMCIgaGVpZ2h0PSI1MCI+PHBhdGggZD0iTTAgMjVRMjUgMCA1MCAyNVQxMDAgMjUiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCN3YXZlcykiLz48L3N2Zz4=')] opacity-30"></div>
          </div>

          <div className="container relative z-10 flex flex-col items-center text-center text-white">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
              <Waves className="h-4 w-4" />
              <span className="text-sm font-medium">Plataforma #1 de Surf en El Salvador</span>
            </div>

            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Encuentra tu{' '}
              <span className="relative inline-block">
                <span className="relative z-10">Instructor de Surf</span>
                <span className="absolute bottom-2 left-0 h-3 w-full bg-yellow-400/50"></span>
              </span>
            </h1>

            <p className="mt-6 max-w-[42rem] text-lg text-blue-50 sm:text-xl md:text-2xl">
              Conecta con instructores certificados cerca de ti. Reserva clases personalizadas y mejora tu nivel de surf hoy mismo.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/search">
                <Button size="lg" className="h-14 bg-white px-8 text-lg font-semibold text-blue-600 hover:bg-blue-50">
                  <Users className="mr-2 h-5 w-5" />
                  Buscar Instructores
                </Button>
              </Link>
              <Link href="/register?type=instructor">
                <Button variant="outline" size="lg" className="h-14 border-2 border-white bg-transparent px-8 text-lg font-semibold text-white hover:bg-white/10">
                  <Award className="mr-2 h-5 w-5" />
                  Soy Instructor
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 md:gap-12">
              <div>
                <div className="text-3xl font-bold md:text-4xl">500+</div>
                <div className="mt-1 text-sm text-blue-100">Clases Impartidas</div>
              </div>
              <div>
                <div className="text-3xl font-bold md:text-4xl">50+</div>
                <div className="mt-1 text-sm text-blue-100">Instructores</div>
              </div>
              <div>
                <div className="text-3xl font-bold md:text-4xl">4.9</div>
                <div className="mt-1 text-sm text-blue-100">Rating Promedio</div>
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
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
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
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
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
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
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

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-cyan-500 to-blue-600 py-20">
          <div className="container text-center text-white">
            <Star className="mx-auto mb-6 h-12 w-12" />
            <h2 className="font-heading text-3xl font-bold md:text-4xl">
              ¿Listo para Conquistar las Olas?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-50">
              Únete a cientos de surfistas que ya están mejorando su técnica con los mejores instructores de El Salvador
            </p>
            <Link href="/search">
              <Button size="lg" className="mt-8 h-14 bg-white px-8 text-lg font-semibold text-blue-600 hover:bg-blue-50">
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
