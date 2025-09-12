import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Create Cart Context
const CartContext = createContext();

// Custom hook
export const useCart = () => useContext(CartContext);

// Provider
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const config = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : null;

  // ✅ Helper: recalc totalPrice if backend doesn't provide
  const calculateTotalPrice = (items) =>
    items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Fetch cart
  const fetchCart = async () => {
    if (!token) {
      setCart({ items: [], totalPrice: 0 });
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/carts`,
        config
      );
      const data = res.data || { items: [], totalPrice: 0 };
      // Ensure totalPrice is always available
      setCart({
        ...data,
        totalPrice: data.totalPrice || calculateTotalPrice(data.items || []),
      });
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCart({ items: [], totalPrice: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  // Add
  // Add
const addToCart = async (productId, quantity = 1, variantId = null, price = null) => {
  if (!token) {
    alert("❌ Please log in to add items!");
    return;
  }
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/carts/add`,
      { productId, variantId, quantity, price }, // ✅ include all
      config
    );
    const data = res.data;
    setCart({
      ...data,
      totalPrice: data.totalPrice || calculateTotalPrice(data.items || []),
    });
  } catch (err) {
    console.error("Error adding to cart:", err);
  }
};


  // ✅ Update item quantity
const updateCartItem = async (productId, variantId = null, quantity) => {
  if (!token) return;
  try {
    const res = await axios.put(
      `${import.meta.env.VITE_API_URL}/carts/update`,
      { productId, variantId, quantity },
      config
    );
    const data = res.data;
    setCart({
      ...data,
      totalPrice: data.totalPrice || calculateTotalPrice(data.items || []),
    });
  } catch (err) {
    console.error("Error updating cart:", err.response?.data || err.message);
  }
};


// Remove
const removeFromCart = async (productId, variantId = null) => {
  if (!token) return;
  try {
    let url = `${import.meta.env.VITE_API_URL}/carts/remove/${productId}`;
    if (variantId) url += `/${variantId}`;

    const res = await axios.delete(url, config); // ✅ safe URL
    const data = res.data;
    setCart({
      ...data,
      totalPrice: data.totalPrice || calculateTotalPrice(data.items || []),
    });
  } catch (err) {
    console.error("Error removing from cart:", err);
  }
};

  // Clear
  const clearCart = async () => {
    if (!token) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/carts/clear`,
        config
      );
      setCart({ items: [], totalPrice: 0 });
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateCartItem, // ✅ added
        removeFromCart,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
