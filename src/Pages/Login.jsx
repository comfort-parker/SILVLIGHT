import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import groceries from '../assets/groceries.gif';
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import { loginUser } from "../Api";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate(); // <-- Moved here, top-level

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const { data } = await loginUser(form);

    // ✅ Save token
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    // ✅ Save user info
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user.role);
    }

    alert("Login successful!");

    // ✅ Redirect based on role
    if (data.user.role === "admin") {
      navigate("/admin"); // Admin dashboard
    } else {
      navigate("/dashboard"); // User dashboard
    }
  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  }
};


  return (
    <>
      <Navbar />
      <div className="log-hero" style={{ backgroundImage: `url(${groceries})` }}>
        <div className="overlay"></div>
        <div className="hero-text">
          <h1>Login to stay in touch</h1>
          <p>Access our premium features by logging in with the right credentials</p>
        </div>
      </div>

      <div className="auth-Wrapper">
        <div className="auth-form-container">
          <form onSubmit={handleLogin} className="auth-form">
            <h2>Welcome Back</h2>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button type="submit">Login</button>

            <p className="auth-switch">
              Don’t have an account? <a href="/signup" className="auth-link">Sign Up</a>
            </p>

            <p className="auth-switch">
              Forgot password? <a href="/forgot-password" className="auth-link">Reset</a>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
