import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gestione Ore Squadre",
  description: "Sistema professionale monitoraggio cantieri",
  manifest: "/manifest.json?v=2", // Versione per forzare il refresh
  icons: {
    icon: "/favicon.ico?v=2",
    apple: "/logo_ar.png?v=2", // Punta al tuo logo specifico
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <head>
        {/* Forza l'icona per i dispositivi Apple */}
        <link rel="apple-touch-icon" href="/logo_ar.png?v=2" />
        
        {/* Impostazioni per farla sembrare un'App nativa su mobile */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}