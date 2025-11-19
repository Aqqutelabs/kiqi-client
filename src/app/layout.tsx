import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from '@/components/provider/ReduxProvider';
import ToasterClient from './ToasterClient';
import { ProductsProvider } from '@/context/ProductContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
const jakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800'],
    variable: '--font-jakarta',
    display: 'swap',
});

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
        <html lang="en" className={jakarta.variable}>
            <body className={inter.className}>
                <ProductsProvider>
                    <ReduxProvider>
                        <ToasterClient />
                        {children}
                    </ReduxProvider>
                </ProductsProvider>


                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet" />

                <Script
                    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
                    strategy="afterInteractive"
                />
            </body>
        </html>
    );
}
