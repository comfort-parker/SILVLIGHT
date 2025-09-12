import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios"; 
import cam from "../Assets/groceries.gif";
import "./Forgotpass.css";

// Import your common layout components
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";

const ResetPassword = () => {
  const { token } = useParams(); 
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/auth/reset-password/${token}`, 
        { password }
      );

      setMessage(res.data.message);
      navigate("/login");
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="page-container"> {/* full-page flex container */}
      <Navbar />

      <div className="log-hero" style={{ backgroundImage: `url(${cam})` }}>
        <div className="overlay"></div>
        <div className="hero-text">
          <h1>Did you forget your password?</h1>
          <p>
            We got you covered. Enter your registered email to receive a reset link.
          </p>
        </div>
      </div>

      <div className="auth-wrapper">
        <h2>Reset Your Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Reset Password</button>
        </form>
        {message && <p>{message}</p>}
      </div>

      <Footer />
    </div>
  );
};

export default ResetPassword;
