import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'CHINATOWN - Статьи, Рецепты и Литература',
  description: 'Платформа для изучения китайской культуры, кухни и литературы',
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={inter.className}>
      <body>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh' 
        }}>
          <Header />
          <main style={{ 
            flex: 1, 
            paddingTop: '80px'
          }}>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}