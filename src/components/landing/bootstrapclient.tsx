'use client';

import { useEffect } from 'react';

export default function BootstrapClient() {
  useEffect(() => {
    // Dynamically import bootstrap on client side only
    import('bootstrap').catch(err => console.error('Bootstrap import failed:', err));
  }, []);

  return null;
}
