'use client';

import { useEffect } from 'react';

interface OwlCarouselClientProps {
  selector: string;
  options?: any;
}

export default function OwlCarouselClient({ selector, options }: OwlCarouselClientProps) {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).jQuery) {
      const $ = (window as any).jQuery;
      $(selector).owlCarousel(options || {
        loop: true,
        margin: 10,
        nav: true,
        responsive: {
          0: {
            items: 1
          },
          600: {
            items: 3
          },
          1000: {
            items: 5
          }
        }
      });
    }
  }, [selector, options]);

  return null;
}