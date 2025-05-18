
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
// import dynamic from 'next/dynamic'; // No longer needed here
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ClientOnlyToaster } from '@/components/ClientOnlyToaster'; // Import the new client component

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'StyleCanvas - Fashion Reimagined',
  description: 'Discover the latest trends and timeless classics at StyleCanvas.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`} suppressHydrationWarning={true}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <ClientOnlyToaster /> {/* Use the new ClientOnlyToaster component */}
      </body>
    </html>
  );
}
