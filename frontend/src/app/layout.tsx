import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  fallback: ['system-ui', 'Arial', 'sans-serif']
});

export const metadata: Metadata = {
  title: 'Stable Diffusion Image Generator',
  description: 'Generate images using Stable Diffusion 3.5',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
} 