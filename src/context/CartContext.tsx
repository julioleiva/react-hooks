import type { ReactNode } from "react";
import { createContext, useState, useMemo } from "react";

export interface Product {
  id: number;
  name: string;
  price: number;
  availableUnits: number;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  products: Product[];
  cartItems: CartItem[];
  addToCart: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getAvailableUnits: (productId: number) => number;
}

// Productos de ejemplo
const initialProducts: Product[] = [
  { id: 1, name: "Laptop", price: 999, availableUnits: 5 },
  { id: 2, name: "Mouse", price: 25, availableUnits: 15 },
  { id: 3, name: "Teclado", price: 75, availableUnits: 8 },
  { id: 4, name: "Monitor", price: 300, availableUnits: 3 },
];

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const currentCartItem = cartItems.find((item) => item.id === productId);
    const currentQuantityInCart = currentCartItem
      ? currentCartItem.quantity
      : 0;

    // Verificar si hay unidades disponibles
    if (currentQuantityInCart >= product.availableUnits) {
      alert(`No hay más unidades disponibles de ${product.name}`);
      return;
    }

    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === productId);

      if (existingItem) {
        return prev.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
          },
        ];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === productId);

      if (!existingItem) return prev;

      if (existingItem.quantity === 1) {
        return prev.filter((item) => item.id !== productId);
      } else {
        return prev.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
    });
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getAvailableUnits = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    const cartItem = cartItems.find((item) => item.id === productId);
    const quantityInCart = cartItem ? cartItem.quantity : 0;

    return product ? product.availableUnits - quantityInCart : 0;
  };

  const value = useMemo(
    () => ({
      products,
      cartItems,
      addToCart,
      removeFromCart,
      getTotalItems,
      getTotalPrice,
      getAvailableUnits,
    }),
    [products, cartItems]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
