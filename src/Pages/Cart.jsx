// src/Pages/Cart.jsx
import React from "react";
import { useCart } from "../Components/Cart/CartContext";
import UserTopbar from "../Components/Layout/UserTop";
import Footer from "../Components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const CartPage = () => {
  const { cart, removeFromCart, clearCart, updateCartItem } = useCart();
  const navigate = useNavigate();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <UserTopbar />
        <div className="cart-container empty-cart">
          <h2>Your Cart is Empty 🛒</h2>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="cart-page">
      <UserTopbar />

      <div className="cart-content">
        {/* Left side: Cart items */}
        <div className="cart-items-section">
          <h2>Your Cart</h2>
          {cart.items.map((item) => (
            <div key={`${item.product._id}-${item.variantId}`} className="cart-item">
              {/* Image */}
              <img
                src={item.product.mainImage}
                alt={item.product.name}
                className="cart-item-image"
              />

              {/* Details (middle) */}
              <div className="cart-item-details">
                <h4>{item.product.name}</h4>

                <div className="quantity-controls">
                  <button
                    className="qty-btn"
                    onClick={() =>
                      updateCartItem(item.product._id, item.variantId, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() =>
                      updateCartItem(item.product._id, item.variantId, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions (right side) */}
              <div className="cart-item-actions">
                <p className="item-price">GHS {item.price * item.quantity}</p>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.product._id, item.variantId)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button className="clear-btn" onClick={clearCart}>
            Clear Cart
          </button>
        </div>

        {/* Right side: Summary card */}
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <p>Total Items: {cart.items.length}</p>
          <p>Total Price: GHS {cart.totalPrice}</p>
          <button
            className="checkout-btn"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;
