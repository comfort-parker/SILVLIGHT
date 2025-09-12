import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ConfirmOder.css";
import "../../Pages/UserrDash.css";
import groceries from "../../assets/groceries.gif"; // ✅
import UserTopbar from "../Layout/UserTop";
import Footer from "../Footer/Footer";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loadingPay, setLoadingPay] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/orders/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrder(res.data);
      } catch (err) {
        console.error("Error fetching order", err);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handlePayment = async () => {
    try {
      setLoadingPay(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/payments/paystack/initialize`,
        { orderId, method: "paystack" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Redirect to Paystack hosted checkout page
      window.location.href = res.data.authorizationUrl;
    } catch (err) {
      console.error("Payment init failed:", err);
      alert("Payment initialization failed. Try again.");
      setLoadingPay(false);
    }
  };

  if (!order) return <h2 className="loading">Loading your order...</h2>;

  return (
    
          <>
          <UserTopbar />
          <div className="view-hero" style={{ backgroundImage: `url(${groceries})` }}>
          <div className="overlay"></div>
          <div className="hero-text">
            <h1>Confirm Your Details to Place Order</h1>
            <p>Enter the requested details to place your order</p>
      </div>
    </div><div className="order-container">
        <h2 className="order-title">🎉 Order Confirmed!</h2>
        <p className="order-info">Order ID: {order._id}</p>
        <p className="order-info">Status: {order.status}</p>

        {/* Shipping Info */}
        <div className="order-section">
          <h3>Shipping Address</h3>
          <p>{order.shipping?.fullName}</p>
          <p>{order.shipping?.address}</p>
          <p>
            {order.shipping?.city}, {order.shipping?.country}
          </p>
          <p>Phone: {order.shipping?.phone}</p>
        </div>

        {/* Items */}
        <div className="order-section">
          <h3>Items</h3>
          <ul className="order-items">
            {order.items.map((item) => (
              <li key={item._id} className="order-item">
                <img
                  src={item.product.mainImage}
                  alt={item.product.name}
                  className="order-item-img" />
                <div className="order-item-details">
                  <p className="order-item-name">{item.product.name}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <p className="order-item-price">
                  GHS {item.quantity * (item.price || 0)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Payment */}
        <div className="order-section">
          <h3>Payment</h3>
          <p>Method: {order.paymentMethod}</p>
          <p>Status: {order.isPaid ? "✅ Paid" : "❌ Not Paid"}</p>
        </div>

        <h4 className="order-total">Total: GHS {order.totalAmount}</h4>

        {!order.isPaid && (
          <button
            className="pay-btn"
            onClick={handlePayment}
            disabled={loadingPay}
          >
            {loadingPay ? "Redirecting..." : "Proceed to Payment"}
          </button>
        )}
      </div>
      <Footer />
      </>
  );
};

export default OrderConfirmation;
