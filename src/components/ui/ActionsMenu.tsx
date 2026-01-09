"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onDelete: () => void;
}

export default function ActionsMenu({ isOpen, onOpen, onClose, onDelete }: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null
  );

  function openMenu() {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const menuWidth = 192; // w-48
    const menuHeight = 240;
    const viewportHeight = window.innerHeight;

    const top =
      rect.bottom + menuHeight > viewportHeight
        ? rect.top - menuHeight - 6
        : rect.bottom + 6;

    setCoords({
      top,
      left: rect.right - menuWidth,
    });

    onOpen();
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          isOpen ? onClose() : openMenu();
        }}
        className="p-2 rounded-md hover:bg-gray-100"
      >
        <MoreVertical className="w-5 h-5 text-gray-500" />
      </button>

      {isOpen &&
        coords &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
            }}
            className="z-[9999] w-48 rounded-md border border-gray-200 bg-white shadow-lg"
          >
            <button className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
            onClick={() => (window.location.href = `/contacts/lists/[id]}`)}>
              View Contacts
            </button>
            <button className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
              Rename
            </button>
            <button className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
              Duplicate
            </button>
            <button className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
              Merge
            </button>
            <button
              onClick={() => {
                onClose();
                onDelete();
              }}
              className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              Delete List
            </button>
          </div>,
          document.body
        )}
    </>
  );
}
