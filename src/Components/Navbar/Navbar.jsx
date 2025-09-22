import React, { useEffect, useState } from "react";
import "./Navbar.css";
import logo from "../../assets/log.png";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { useCart } from "../Cart/CartContext";

const Navbar = ({ solid = false }) => {
  const [sticky, setSticky] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart();

  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Disable body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const toggleMenu = () => setMobileOpen((s) => !s);
  const closeMenu = () => setMobileOpen(false);

  const handleCartClick = () => navigate("/cart");

  const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <>
      <nav className={`navbar ${sticky ? "dark-nav" : ""} ${solid ? "solid-nav" : ""}`}>
        <RouterLink to="/home" className="brand" onClick={closeMenu}>
          <img src={logo} alt="logo" className="logo" />
        </RouterLink>

        {/* Desktop / centered links */}
        <ul className={`nav-links ${mobileOpen ? "open" : ""}`} role="menu">
          <li>
            {location.pathname === "/home" ? (
              <ScrollLink to="hero" smooth offset={0} duration={600} onClick={closeMenu}>
                Home
              </ScrollLink>
            ) : (
              <RouterLink to="/landing" onClick={closeMenu}>Home</RouterLink>
            )}
          </li>

          <li>
            {location.pathname === "/landing" ? (
              <ScrollLink to="category" smooth offset={-260} duration={600} onClick={closeMenu}>
                Categories
              </ScrollLink>
            ) : (
              <RouterLink to="/blog" onClick={closeMenu}>Blog</RouterLink>
            )}
          </li>

          <li>
            {location.pathname === "/landing" ? (
              <ScrollLink to="about" smooth offset={-150} duration={600} onClick={closeMenu}>
                About Us
              </ScrollLink>
            ) : (
              <RouterLink to="/aboutus" onClick={closeMenu}>About Us</RouterLink>
            )}
          </li>

          <li>
            <RouterLink to="/products" onClick={closeMenu}>Products</RouterLink>
          </li>

          <li>
            {location.pathname === "/landing" ? (
              <ScrollLink to="contact" smooth offset={-260} duration={600} onClick={closeMenu}>
                Contact Us
              </ScrollLink>
            ) : (
              <RouterLink to="/contactus" onClick={closeMenu}>Contact Us</RouterLink>
            )}
          </li>

          <li>
            {location.pathname === "/home" ? (
              <ScrollLink className="cta" to="testimonial" smooth offset={-260} duration={600} onClick={closeMenu}>
                Testimonial
              </ScrollLink>
            ) : (
              <RouterLink className="cta" to="/testimonial" onClick={closeMenu}>
                Testimonial
              </RouterLink>
            )}
          </li>

          <li>
            {location.pathname === "/home" ? (
              <ScrollLink className="cta" to="hero" smooth offset={0} duration={600} onClick={closeMenu}>
                Get Started
              </ScrollLink>
            ) : (
              <RouterLink className="cta" to="/signup" onClick={closeMenu}>
                Sign up
              </RouterLink>
            )}
          </li>
        </ul>

        {/* Right side actions */}
        <div className="nav-actions">
          <button className="cart-icon" onClick={handleCartClick} aria-label="Cart">
            <FaShoppingCart />
            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </button>

          <button
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </nav>

      {/* Backdrop when mobile menu is open (click to close) */}
      <div
        className={`mobile-backdrop ${mobileOpen ? "visible" : ""}`}
        onClick={closeMenu}
        aria-hidden={!mobileOpen}
      />
    </>
  );
};

export default Navbar;
