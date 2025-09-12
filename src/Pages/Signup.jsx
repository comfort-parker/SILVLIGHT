// src/pages/Signup.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import LogimImg from '../assets/groceries.gif';
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import { registerUser } from "../Api";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    acceptedTerms: false,
  });

  const [toast, setToast] = useState({ message: "", type: "" }); 
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000); 
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await registerUser(form);

      if (data.message.includes("Registration successful")) {
        localStorage.setItem("signupEmail", form.email);
        showToast(data.message, "success");
        setTimeout(() => navigate("/verify-otp"), 1500);
      } else {
        showToast(data.message || "Unexpected registration response", "error");
      }
    } catch (err) {
      showToast(err.response?.data?.message || "❌ Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar solid />
      <div className="auth-wrapper">
        <div className="auth-box">
          <div className="auth-image">
            <img src={LogimImg} alt="Signup" />
          </div>

          <div className="auth-form-container">
            <form onSubmit={handleRegister} className="auth-form">
              <h2>Create Account</h2>
              <input
                name="firstName"
                type="text"
                placeholder="First Name"
                onChange={handleChange}
                required
              />
              <input
                name="lastName"
                type="text"
                placeholder="Last Name"
                onChange={handleChange}
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleChange}
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                required
              />
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="acceptedTerms"
                  checked={form.acceptedTerms}
                  onChange={handleChange}
                  required
                />
                I accept Terms & Privacy Policy
              </label>
              <button type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>

              <p className="auth-switch">
                Already have an account?{" "}
                <a href="/login" className="auth-link">Login</a>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.message && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}

      <Footer />
    </>
  );
};

export default Signup;
