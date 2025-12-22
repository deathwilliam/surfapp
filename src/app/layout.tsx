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
  title: "SurfConnect - Encuentra tu instructor de surf",
  description: "Conecta con instructores de surf certificados cerca de ti.",
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
