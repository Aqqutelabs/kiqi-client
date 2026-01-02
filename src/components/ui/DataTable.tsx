import React from 'react';
import { Eye, Trash, Loader2 } from 'lucide-react';
import { Button } from './Button';
import Link from 'next/link';

export interface Column<T> {
  header: string;
  accessor: keyof T;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (id: string | number) => string; // Returns the URL for the detail page
  extraActions?: (item: T) => React.ReactNode;
  isLoading?: boolean;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  onEdit,
  onDelete,
  onView,
  extraActions,
  isLoading = false,
}: DataTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-[#D1DAF4] h-16.5">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.accessor)}
                className="px-6 py-3 text-left text-xs font-medium text-[#0A0A0A] uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete || onView || extraActions) && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-800 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 rounded-b-xl">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length + ((onEdit || onDelete || onView || extraActions) ? 1 : 0)} className="py-12">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                  <p className="text-gray-600 text-lg font-medium leading-tight">
                    Loading data...
                  </p>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + ((onEdit || onDelete || onView || extraActions) ? 1 : 0)} className="py-8">
                <div className="flex flex-col items-center gap-2">
                  <Trash
                    size={60}
                    color="gray"
                  />
                  <p className="text-gray-600 text-xl font-bold leading-tight tracking-[-0.015em]">
                    No Items to Display
                  </p>
                  <p className="text-gray-500 text-base font-normal leading-normal w-2/4 text-center">
                    Refresh the data to see if anything new has appeared.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id} className="bg-white h-20">
                {columns.map((col) => (
                  <td key={String(col.accessor)} className="px-6 py-4 whitespace-wrap text-sm text-gray-700 w-125">
                    {String(row[col.accessor])}
                  </td>
                ))}
                {(onEdit || onDelete || onView || extraActions) && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center gap-2">
                      {onView && (
                        <Link href={onView(row.id)}>
                          <Button variant="tertiary" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </Link>
                      )}
                      {onEdit && (
                        <Button variant="tertiary" size="sm" onClick={() => onEdit(row)}>
                          Edit
                        </Button>
                      )}
                      {onDelete && (
                        <Button variant="destructive" size="sm" onClick={() => onDelete(row)}>
                          Delete
                        </Button>
                      )}
                      {extraActions && extraActions(row)}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
