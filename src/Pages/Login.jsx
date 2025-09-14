import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Auth.css";
import groceries from "../assets/groceries.gif";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import { loginUser } from "../Api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await loginUser(form);

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("role", data.user.role);
      }

      toast.success("Login successful!");

      // ✅ Handle redirect if ?redirect= is present
      const params = new URLSearchParams(location.search);
      const redirect = params.get("redirect");

      if (redirect) {
        navigate(redirect); // e.g., /products or /categories
      } else if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
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
            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </button>

            <p className="auth-switch">
              Don’t have an account?{" "}
              <a href="/signup" className="auth-link">
                Sign Up
              </a>
            </p>

            <p className="auth-switch">
              Forgot password?{" "}
              <a href="/forgot-password" className="auth-link">
                Reset
              </a>
            </p>
          </form>
        </div>
      </div>
      <Footer />

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};

export default Login;
