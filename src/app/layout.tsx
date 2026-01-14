import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { LanguageProvider } from "@/contexts/LanguageContext";
import "./globals.css";

const garetFont = localFont({
  src: [
    {
      path: "../../public/fonts/Garet-Book.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-body",
});

const monumentFont = localFont({
  src: [
    {
      path: "../../public/fonts/MonumentExtended-Regular.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-heading",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Port Access Control",
  description: "Sistema de Controle de Acesso Portuário",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${garetFont.variable} ${monumentFont.variable}`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}