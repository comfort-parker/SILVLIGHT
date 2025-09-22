import React from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  const navigate = useNavigate();

  const handleShopNow = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first to continue");
      navigate("/login?redirect=/dashboard"); // ✅ send redirect param
    } else {
      navigate("/dashboard");
    }
  };

  const handleBrowseCategories = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first to continue");
      navigate("/login?redirect=/dashboard"); // ✅ send redirect param
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>✨ Everything You Need, All in One Place</h1>
        <p>
          From fresh bakery delights to premium skincare, cosmetics, groceries,
          and everyday essentials — we’ve got you covered.
        </p>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={handleShopNow}>
            🛒 Shop Now
          </button>
          <button className="btn-secondary" onClick={handleBrowseCategories}>
            🔍 Browse Categories
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
