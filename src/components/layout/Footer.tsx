import Link from 'next/link';
import { Waves, Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative overflow-hidden border-t bg-gradient-to-br from-[#00D4D4]/5 via-background to-[#FF6B35]/5">
            {/* Wave decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00D4D4] via-[#FFD23F] to-[#FF6B35]" />

            <div className="container py-12 md:py-16">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
                    {/* Brand Section */}
                    <div className="lg:col-span-2 space-y-4">
                        <Link href="/" className="flex items-center space-x-2 group w-fit">
                            <Waves className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
                            <span className="font-heading text-2xl font-bold bg-gradient-to-r from-[#00D4D4] to-[#FF6B35] bg-clip-text text-transparent">
                                Surf City
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            Conectando surfistas con los mejores instructores de El Salvador.
                            Desde El Tunco hasta Punta Roca, tu próxima ola te espera. 🏄‍♂️🇸🇻
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-3 pt-2">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-all hover:bg-primary hover:text-white hover:scale-110"
                                aria-label="Facebook"
                            >
                                <Facebook className="h-4 w-4" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-all hover:bg-primary hover:text-white hover:scale-110"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-4 w-4" />
                            </a>
                            <a
                                href="mailto:info@surfcity.sv"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-all hover:bg-primary hover:text-white hover:scale-110"
                                aria-label="Email"
                            >
                                <Mail className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* Surf Spots */}
                    <div>
                        <h4 className="font-heading font-semibold mb-4 text-foreground">Surf Spots</h4>
                        <ul className="space-y-2.5 text-sm text-muted-foreground">
                            <li>
                                <Link href="/search?location=el-tunco" className="hover:text-primary transition-colors inline-flex items-center gap-1">
                                    El Tunco
                                </Link>
                            </li>
                            <li>
                                <Link href="/search?location=el-sunzal" className="hover:text-primary transition-colors inline-flex items-center gap-1">
                                    El Sunzal
                                </Link>
                            </li>
                            <li>
                                <Link href="/search?location=punta-roca" className="hover:text-primary transition-colors inline-flex items-center gap-1">
                                    Punta Roca
                                </Link>
                            </li>
                            <li>
                                <Link href="/search?location=el-zonte" className="hover:text-primary transition-colors inline-flex items-center gap-1">
                                    El Zonte
                                </Link>
                            </li>
                            <li>
                                <Link href="/search?location=las-flores" className="hover:text-primary transition-colors inline-flex items-center gap-1">
                                    Las Flores
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Platform */}
                    <div>
                        <h4 className="font-heading font-semibold mb-4 text-foreground">Plataforma</h4>
                        <ul className="space-y-2.5 text-sm text-muted-foreground">
                            <li><Link href="/search" className="hover:text-primary transition-colors">Buscar Instructores</Link></li>
                            <li><Link href="/how-it-works" className="hover:text-primary transition-colors">Cómo funciona</Link></li>
                            <li><Link href="/register?type=instructor" className="hover:text-primary transition-colors">Ser Instructor</Link></li>
                            <li><Link href="/register" className="hover:text-primary transition-colors">Registrarse</Link></li>
                        </ul>
                    </div>

                    {/* Legal & Support */}
                    <div>
                        <h4 className="font-heading font-semibold mb-4 text-foreground">Soporte</h4>
                        <ul className="space-y-2.5 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary transition-colors">Sobre Nosotros</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contacto</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Términos</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacidad</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="mt-10 pt-8 border-t border-border/50">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span>La Libertad, El Salvador</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-primary" />
                                <a href="mailto:info@surfcity.sv" className="hover:text-primary transition-colors">
                                    info@surfcity.sv
                                </a>
                            </div>
                        </div>
                        <div className="text-center md:text-right">
                            © {currentYear} Surf City El Salvador. Todos los derechos reservados.
                        </div>
                    </div>
                </div>

                {/* Made with love */}
                <div className="mt-6 text-center text-xs text-muted-foreground/70">
                    Hecho con ❤️ para la comunidad de surf salvadoreña
                </div>
            </div>
        </footer>
    );
}
