import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gestione Ore Squadre",
  description: "Sistema professionale monitoraggio cantieri",
  manifest: "/manifest.json", // Fondamentale per l'installazione su smartphone
  icons: {
    icon: "/favicon.ico",
    apple: "/icon.png", // L'icona che apparirà sulla home dell'iPhone
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}