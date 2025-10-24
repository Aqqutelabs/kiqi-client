"use client";

import { createContext, useContext, useState } from "react";

type ProductsContextType = {
  isAdded: boolean;
  handleAddToCart: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
};

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined
);

export const ProductsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isAdded, setIsAdded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleAddToCart = () => {
    setIsAdded(true);
  };
  return (
    <ProductsContext.Provider
      value={{
        isAdded,
        isSidebarOpen,
        setIsSidebarOpen,
        handleAddToCart
      }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context)
    throw new Error("useProducts must be used within ProductsProvider");
  return context;
};