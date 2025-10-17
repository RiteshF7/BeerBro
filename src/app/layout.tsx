import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FirebaseProvider } from "@/lib/common/contexts/FirebaseContext";
import { Toaster } from "@/lib/common/ui/sonner";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import PWAStatus from "@/components/PWAStatus";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BeerBro - Premium Beverage Store",
  description: "Discover the finest selection of craft beers, wines, spirits, and premium beverages from around the world.",
  keywords: ["beer", "wine", "spirits", "whiskey", "gin", "vodka", "rum", "tequila", "cocktails", "beverages", "alcohol", "craft beer"],
  authors: [{ name: "BeerBro Team" }],
  creator: "BeerBro",
  publisher: "BeerBro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://beerbro.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "BeerBro - Premium Beverage Store",
    description: "Discover the finest selection of craft beers, wines, spirits, and premium beverages from around the world.",
    url: 'https://beerbro.app',
    siteName: 'BeerBro',
    images: [
      {
        url: '/icons/icon.svg',
        width: 512,
        height: 512,
        alt: 'BeerBro Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "BeerBro - Premium Beverage Store",
    description: "Discover the finest selection of craft beers, wines, spirits, and premium beverages from around the world.",
    images: ['/icons/icon.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/icons/icon.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'BeerBro',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1f2937',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FirebaseProvider>
          <PWAStatus />
          {children}
          <Toaster />
          <PWAInstallPrompt />
        </FirebaseProvider>
      </body>
    </html>
  );
}
