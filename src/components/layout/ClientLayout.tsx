'use client';

import { ReduxProvider } from '@/components/provider/ReduxProvider';
import ToasterClient from '@/app/ToasterClient';

export default function ClientLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <html lang="en">
      <body className={className} suppressHydrationWarning>
        <ReduxProvider>
          <ToasterClient />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}