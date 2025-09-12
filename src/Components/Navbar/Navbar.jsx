import React, { useEffect, useState } from "react";
import "./Navbar.css";
import logo from "../../assets/log.png";
import menu from "../../assets/menu.png";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../Cart/CartContext";

const Navbar = ({ solid = false }) => {
  const [sticky, setSticky] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart();

  // Sticky navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setMobileMenu((prev) => !prev);
  };

  // ✅ Cart click handler (always go to /cart, ProtectedRoute handles redirect)
  const handleCartClick = () => {
    navigate("/cart");
  };

  // Total items in cart
  const totalItems =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <nav
      className={`container ${sticky ? "dark-nav" : ""} ${
        solid ? "solid-nav" : ""
      }`}
    >
      {/* Logo */}
      <RouterLink to="/home">
        <img src={logo} alt="logo" className="logo" />
      </RouterLink>

      {/* Menu */}
      <ul className={mobileMenu ? "mobile-menu" : "hide-menu"}>
        <li>
          {location.pathname === "/home" ? (
            <ScrollLink to="hero" smooth offset={0} duration={600}>
              Home
            </ScrollLink>
          ) : (
            <RouterLink to="/landing">Home</RouterLink>
          )}
        </li>
        <li>
          {location.pathname === "/landing" ? (
            <ScrollLink to="category" smooth offset={-260} duration={600}>
              Categories
            </ScrollLink>
          ) : (
            <RouterLink to="/blog">Blog</RouterLink>
          )}
        </li>
        <li>
          {location.pathname === "/landing" ? (
            <ScrollLink to="about" smooth offset={-150} duration={600}>
              About Us
            </ScrollLink>
          ) : (
            <RouterLink to="/aboutus">About Us</RouterLink>
          )}
        </li>
        <li>
          <RouterLink to="/products">Products</RouterLink>
        </li>
        <li>
          {location.pathname === "/landing" ? (
            <ScrollLink to="contact" smooth offset={-260} duration={600}>
              Contact Us
            </ScrollLink>
          ) : (
            <RouterLink to="/contactus">Contact Us</RouterLink>
          )}
        </li>
        <li>
          {location.pathname === "/home" ? (
            <ScrollLink
              to="testimonial"
              smooth
              offset={-260}
              duration={600}
            >
              Testimonial
            </ScrollLink>
          ) : (
            <RouterLink to="/testimonial">Testimonial</RouterLink>
          )}
        </li>
        <li>
          {location.pathname === "/home" ? (
            <ScrollLink
              className="btn"
              to="hero"
              smooth
              offset={0}
              duration={600}
            >
              Get Started
            </ScrollLink>
          ) : (
            <RouterLink className="btn" to="/signup">
              Sign up
            </RouterLink>
          )}
        </li>
      </ul>

      {/* Cart Icon */}
      <div className="cart-icon" onClick={handleCartClick}>
        <FaShoppingCart />
        {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
      </div>

      {/* Mobile Menu Icon */}
      <img src={menu} alt="menu" className="menu-icon" onClick={toggleMenu} />
    </nav>
  );
};

export default Navbar;
