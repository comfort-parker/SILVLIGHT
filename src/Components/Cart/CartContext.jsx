// src/Components/Cart/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Create context
const CartContext = createContext();

// Custom hook
export const useCart = () => useContext(CartContext);

// Provider
const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Helper: calculate total price
  const calculateTotalPrice = (items) =>
    items.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0);

  // Fetch cart (backend or guest)
  const fetchCart = async () => {
    if (!token) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || { items: [], totalPrice: 0 };
      setCart(guestCart);
      setLoading(false);
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/carts`, config);
      const data = res.data || { items: [], totalPrice: 0 };
      setCart({ ...data, totalPrice: data.totalPrice || calculateTotalPrice(data.items || []) });
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCart({ items: [], totalPrice: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Listen to login/logout changes
  useEffect(() => {
    const handleStorage = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    fetchCart();
  }, [token]);

  // Add item
  const addToCart = async (productId, quantity = 1, variantId = null, price = null) => {
    if (!token) {
      // Guest cart
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || { items: [], totalPrice: 0 };
      const idx = guestCart.items.findIndex(item => item.product._id === productId && item.variantId === variantId);

      if (idx > -1) {
        guestCart.items[idx].quantity += quantity;
      } else {
        guestCart.items.push({ product: { _id: productId, price }, variantId, quantity });
      }

      guestCart.totalPrice = calculateTotalPrice(guestCart.items);
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      setCart(guestCart);
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/carts/add`, { productId, variantId, quantity, price }, config);
      const data = res.data;
      setCart({ ...data, totalPrice: data.totalPrice || calculateTotalPrice(data.items || []) });
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  // Update item
  const updateCartItem = async (productId, variantId = null, quantity) => {
    if (!token) return;

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/carts/update`, { productId, variantId, quantity }, config);
      const data = res.data;
      setCart({ ...data, totalPrice: data.totalPrice || calculateTotalPrice(data.items || []) });
    } catch (err) {
      console.error("Error updating cart:", err);
    }
  };

  // Remove item
  const removeFromCart = async (productId, variantId = null) => {
    if (!token) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || { items: [], totalPrice: 0 };
      guestCart.items = guestCart.items.filter(item => !(item.product._id === productId && item.variantId === variantId));
      guestCart.totalPrice = calculateTotalPrice(guestCart.items);
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      setCart(guestCart);
      return;
    }

    try {
      let url = `${import.meta.env.VITE_API_URL}/carts/remove/${productId}`;
      if (variantId) url += `/${variantId}`;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.delete(url, config);
      const data = res.data;
      setCart({ ...data, totalPrice: data.totalPrice || calculateTotalPrice(data.items || []) });
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  // Clear cart
  const clearCart = () => {
    if (!token) localStorage.removeItem("guestCart");
    setCart({ items: [], totalPrice: 0 });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
