import React from "react";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>✨ Everything You Need, All in One Place</h1>
        <p>
          From fresh bakery delights to premium skincare, cosmetics, groceries,
          and everyday essentials — we’ve got you covered.
        </p>
        <div className="hero-buttons">
          <button className="btn-primary">🛒 Shop Now</button>
          <button className="btn-secondary">🔍 Browse Categories</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
