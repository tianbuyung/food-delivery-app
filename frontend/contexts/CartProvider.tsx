"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Cookie from "js-cookie";

interface CartContextType {
  cart: any;
  addItem: (item: any) => void;
  removeItem: (item: any) => void;
  resetCart: () => void;
  showCart: boolean;
  setShowCart: (show: any) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const cartCookie =
    Cookie.get("cart") !== "undefined" ? Cookie.get("cart") : null;
  const [cart, setCart] = useState(
    cartCookie ? JSON.parse(cartCookie) : { items: [], total: 0 }
  );
  const [showCart, setShowCart] = useState(true);

  useEffect(() => {
    Cookie.set("cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = (item: any) => {
    let newItem = cart.items.find((i: any) => i.id === item.id);
    if (!newItem) {
      const newItem = {
        quantity: 1,
        ...item,
      };
      setCart((prevCart: any) => ({
        items: [...prevCart.items, newItem],
        total: prevCart.total + item.attributes.price,
      }));
    } else {
      setCart((prevCart: any) => ({
        items: prevCart.items.map((i: any) =>
          i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
        total: prevCart.total + item.attributes.price,
      }));
    }
  };

  const removeItem = (item: any) => {
    let newItem = cart.items.find((i: any) => i.id === item.id);
    if (newItem.quantity > 1) {
      setCart((prevCart: any) => ({
        items: prevCart.items.map((i: any) =>
          i.id === newItem.id ? { ...i, quantity: i.quantity - 1 } : i
        ),
        total: prevCart.total - item.attributes.price,
      }));
    } else {
      setCart((prevCart: any) => ({
        items: prevCart.items.filter((i: any) => i.id !== item.id),
        total: prevCart.total - item.attributes.price,
      }));
    }
  };

  const resetCart = () => {
    setCart({ items: [], total: 0 });
  };

  return (
    <CartContext.Provider
      value={{ cart, addItem, removeItem, resetCart, showCart, setShowCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

const useCartContext = () => {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCartContext must be used within a CartProvider");
  }

  return context;
};

export { CartProvider, useCartContext };
