import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from '@/components/provider/ReduxProvider';
import ToasterClient from './ToasterClient';
import { ProductsProvider } from '@/context/ProductContext';
import { SidebarProvider } from '@/context/SidebarContext';
import { WalletProvider } from '@/context/WalletContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KiKi',
  description: 'Streamline your business with KiKi.',
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SidebarProvider>
          <ProductsProvider>
              <ReduxProvider>
                <WalletProvider>
                  <ToasterClient />
                  {children}
                </WalletProvider>
              </ReduxProvider>
          </ProductsProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
