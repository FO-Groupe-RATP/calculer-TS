import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Calculateur TS - Groupe FO',
  description: 'Calculer votre le montant de vos TS du Groupe FO',
  icons: {
    icon: './LogoFO.jpg', // navigateur
    shortcut: './LogoFO.jpg', // fallback
    apple: './LogoFO.jpg', // iOS
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-screen h-screen bg-background`}
      >
        {children}
      </body>
    </html>
  );
}
