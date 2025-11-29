import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-muted/40 py-20 md:py-32">
          <div className="container flex flex-col items-center text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Encuentra tu <span className="text-primary">Instructor de Surf</span>
            </h1>
            <p className="mt-6 max-w-[42rem] text-lg text-muted-foreground sm:text-xl">
              Conecta con instructores certificados cerca de ti. Reserva clases personalizadas y mejora tu nivel de surf hoy mismo.
            </p>
            <div className="mt-8 flex gap-4">
              <Link href="/search">
                <Button size="lg" className="h-12 px-8 text-lg">
                  Buscar Instructores
                </Button>
              </Link>
              <Link href="/register?type=instructor">
                <Button variant="outline" size="lg" className="h-12 px-8 text-lg">
                  Soy Instructor
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container">
            <div className="grid gap-12 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                </div>
                <h3 className="font-heading text-xl font-bold">Busca</h3>
                <p className="mt-2 text-muted-foreground">Encuentra instructores por ubicación, precio y nivel.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                </div>
                <h3 className="font-heading text-xl font-bold">Reserva</h3>
                <p className="mt-2 text-muted-foreground">Elige el horario que mejor te convenga y reserva al instante.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8"><path d="M2 12h10" /><path d="M9 4v16" /><path d="m3 9 3 3-3 3" /><path d="M12 6A7 7 0 0 1 19 13v8" /><path d="M19 13l-3-3" /><path d="M19 13l3-3" /></svg>
                </div>
                <h3 className="font-heading text-xl font-bold">Surfea</h3>
                <p className="mt-2 text-muted-foreground">Disfruta de tu clase y califica a tu instructor.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
