import React, { useState } from "react";
import "./Footer.css";
import logo from "../../assets/log.png"; 
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import axios from "axios";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  try {
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:7000/api";

    await axios.post(`${API_BASE}/newsletter/subscribe`, { email });
    setMessage("🎉 Subscribed successfully!");
    setEmail("");
  } catch (err) {
    setMessage("⚠️ Subscription failed. Try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <footer className="footer">
      {/* Main Footer Section */}
      <div className="footer-container">
        
        {/* Column 1 - Brand */}
        <div className="footer-col">
          <div className="footer-brand">
            <img src={logo} alt="MelAnu Logo" className="footer-logo" />
            <h3 className="brand-name">SILVLIGHT</h3>
          </div>
          <p className="tagline">Inspiring Bright Futures</p>
          <p className="footer-text">
            Providing quality education and holistic development for every student, 
            fostering excellence, creativity, and lifelong learning
          </p>

          {/* Social Icons */}
          <div className="footer-socials">
            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
          </div>
        </div>

        {/* Column 2 - Explore */}
        <div className="footer-col">
          <h4>Explore</h4>
          <ul>
            <li><a href="#">Admission</a></li>
            <li><a href="#">Gallery</a></li>
            <li><a href="#">Aboutus</a></li>
          </ul>
        </div>

        {/* Column 3 - Company */}
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Academics</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        {/* Column 4 - Newsletter */}
        <div className="footer-col">
          <h4>Newsletter</h4>
          <p>Subscribe to get the latest updates and offers.</p>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              aria-label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <button type="submit" disabled={loading}>
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
          {message && <p className="newsletter-msg">{message}</p>}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© 2025 Parker Development. All rights reserved.</p>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
