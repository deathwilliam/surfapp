import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SurfConnect - Clases de Surf en El Salvador",
    template: "%s | SurfConnect",
  },
  description: "Conecta con los mejores instructores de surf certificados en El Salvador. Reserva clases en El Tunco, El Zonte, Punta Roca y más.",
  keywords: ["surf", "clases de surf", "El Salvador", "El Tunco", "El Zonte", "instructor de surf", "aprender surf"],
  authors: [{ name: "SurfConnect" }],
  creator: "SurfConnect",
  openGraph: {
    type: "website",
    locale: "es_SV",
    url: "https://surfconnect.sv",
    siteName: "SurfConnect",
    title: "SurfConnect - Clases de Surf en El Salvador",
    description: "Conecta con los mejores instructores de surf certificados en El Salvador.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SurfConnect - Surf en El Salvador",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SurfConnect - Clases de Surf en El Salvador",
    description: "Conecta con instructores de surf certificados cerca de ti.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className="overflow-x-hidden">
      <body
        className={`${inter.variable} ${poppins.variable} antialiased overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <SessionProvider>{children}</SessionProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
