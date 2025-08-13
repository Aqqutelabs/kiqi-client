import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center space-x-2" aria-label="Pagination">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50">
        <ChevronLeft size={18} />
      </button>

      {/* This logic can be expanded to include ellipses for large numbers of pages */}
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={clsx('px-3.5 py-2 text-sm font-medium rounded-md', {
            'bg-[#3366FF] text-white': currentPage === page,
            'hover:bg-gray-100 text-gray-700': currentPage !== page,
          })}
        >
          {page}
        </button>
      ))}

      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50">
        <ChevronRight size={18} />
      </button>
    </nav>
  );
};