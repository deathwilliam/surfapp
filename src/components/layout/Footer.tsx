import Link from 'next/link';

export function Footer() {
    return (
        <footer className="border-t bg-muted/40">
            <div className="container py-8 md:py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="space-y-4">
                        <h3 className="font-heading text-lg font-bold text-primary">
                            SurfConnect 🏄
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Conectando alumnos con los mejores instructores de surf.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Plataforma</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/search" className="hover:text-primary">Buscar Instructores</Link></li>
                            <li><Link href="/how-it-works" className="hover:text-primary">Cómo funciona</Link></li>
                            <li><Link href="/pricing" className="hover:text-primary">Precios</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Compañía</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary">Sobre Nosotros</Link></li>
                            <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
                            <li><Link href="/contact" className="hover:text-primary">Contacto</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/terms" className="hover:text-primary">Términos</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary">Privacidad</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} SurfConnect. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
}
