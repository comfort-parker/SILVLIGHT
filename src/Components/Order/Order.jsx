import React, { useState } from "react";
import { useCart } from "../Cart/CartContext";
import axios from "axios";
import UserTopbar from "../Layout/UserTop";
import Footer from "../Footer/Footer";
import groceries from "../../assets/groceries.gif"; 
import "./Order.css";
import "../../Pages/UserrDash.css";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [shipping, setShipping] = useState({
    phone: "",
    region: "",
    city: "",
    country: "Ghana",
  });
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery"); // ✅ backend enum
  const [orderNotes, setOrderNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleOrder = async () => {
    if (!shipping.phone || !shipping.region || !shipping.city) {
      alert("Please fill in all required shipping details.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders`,
        {
          items: cart.items,
          shipping,
          paymentMethod, // ✅ will be "paystack" or "cash_on_delivery"
          orderNotes,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const createdOrder = res.data.order;
      setSuccessMessage("🎉 Order placed successfully!");
      clearCart();

      // Redirect after short delay
      setTimeout(() => {
        if (paymentMethod === "cash_on_delivery") {
          navigate("/dashboard"); // ✅ COD → dashboard
        } else if (paymentMethod === "paystack") {
          navigate(`/order-confirmation/${createdOrder._id}`); // ✅ Online → confirmation page
        }
      }, 1500);
    } catch (err) {
      console.error(err);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="checkout-page">
        <UserTopbar />
        <div className="checkout-container">
          <h2>Your cart is empty 🛒 to Place Order</h2>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <UserTopbar />

      {/* Hero section */}
      <div className="view-hero" style={{ backgroundImage: `url(${groceries})` }}>
        <div className="overlay"></div>
        <div className="hero-text">
          <h1>Confirm Your Details to Place Order</h1>
          <p>Enter the requested details to place your order</p>
        </div>
      </div>

      <div className="checkout-content">
        {/* Left: Shipping & Payment */}
        <div className="checkout-form">
          <h2>Checkout</h2>

          <h3>Shipping Details</h3>
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={shipping.phone}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="region"
            placeholder="Region"
            value={shipping.region}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={shipping.city}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={shipping.country}
            onChange={handleInputChange}
          />

          <h3>Payment Method</h3>
          <div className="payment-options">
            <label
              className={`payment-card ${
                paymentMethod === "cash_on_delivery" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="cash_on_delivery"
                checked={paymentMethod === "cash_on_delivery"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>Cash on Delivery</span>
            </label>

            <label
              className={`payment-card ${
                paymentMethod === "paystack" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="paystack"
                checked={paymentMethod === "paystack"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>paystack</span>
            </label>
          </div>

          <h3>Order Notes (optional)</h3>
          <textarea
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            placeholder="Any special instructions?"
          />
        </div>

        {/* Right: Order Summary */}
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {cart.items.map((item) => (
            <div
              key={`${item.product._id}-${item.variantId}`}
              className="summary-item"
            >
              <span>
                {item.product.name} x {item.quantity}
              </span>
              <span>GHS {item.price * item.quantity}</span>
            </div>
          ))}
          <hr />
          <h4>Total: GHS {cart.totalPrice}</h4>

          <button
            className="place-order-btn"
            onClick={handleOrder}
            disabled={loading}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
          {successMessage && <p className="success-msg">{successMessage}</p>}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
