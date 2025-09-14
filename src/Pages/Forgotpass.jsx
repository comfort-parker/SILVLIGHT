import React, { useState } from "react";

import "./Resetpass.css";
import cam from "../assets/groceries.gif";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import { forgotPassword } from "../Api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(""); // clear previous messages

    try {
      const { data } = await forgotPassword({ email });
      setMessage(
        data.message || "✅ Password reset link sent! Check your email."
      );
      setEmail(""); // clear input after success
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "❌ Error sending reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
        <Navbar  />
      {/* Blog Hero Section */}
      <div className="log-hero" style={{ backgroundImage: `url(${cam})` }}>
        <div className="overlay"></div>
        <div className="hero-text">
          <h1>Did you forget your password?</h1>
          <p>
            We got you covered. Enter your registered email to receive a reset
            link.
          </p>
        </div>
      </div>

      {/* Forgot Password Form */}
      <div className="auth-Wrapper">
        <div className="auth-form-container">
          <form onSubmit={handleSubmit} className="auth-form">
            <h2>Forgot Password</h2>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
            {message && <p>{message}</p>}
          </form>
        </div>
      </div>
        <Footer />
    </div>
  );
};

export default ForgotPassword;
