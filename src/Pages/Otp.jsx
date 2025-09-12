// src/pages/VerifyOtp.jsx
import React, { useState } from "react";
import "./Resetpass.css"; // Reusing the same styles
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import groceries from '../assets/groceries.gif';
import { verifyOtp } from "../Api";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const email = localStorage.getItem("signupEmail"); // get email from signup

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await verifyOtp({ email, otp });
      setMessage("✅ Account verified! Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
        <Navbar  />
      <Navbar />
      {/* log Hero Section */}
            <div className="log-hero" style={{ backgroundImage: `url(${groceries})` }}>
              <div className="overlay"></div>
              <div className="hero-text">
                <h1>Verify your Account</h1>
                <p>Access our premium features features by loging in with the right credentials</p>
              </div>
            </div>
      <div className="auth-wrapper">
        
          
            {message && <p className="success-message">{message}</p>}
            <form onSubmit={handleVerify} className="auth-form">
              <h2>Verify OTP</h2>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Verify"}
              </button>
            </form>
          
       
      </div>
      <Footer />
    </div>
  );
};

export default VerifyOtp;
