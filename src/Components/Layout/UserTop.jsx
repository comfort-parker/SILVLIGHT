// src/Components/Layout/UserTop.jsx
import React, { useState, useEffect } from "react";
import { FaBell, FaUserCircle, FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../Cart/CartContext";
import logo from "../../assets/log.png";
import "./UserTop.css";

const UserTopbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const { cart } = useCart();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.firstName && user.lastName) {
      setUserName(`${user.firstName} ${user.lastName}`);
    } else if (user && user.fullName) {
      setUserName(user.fullName);
    } else {
      setUserName("");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // total items in cart
  const totalItems =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div className="topbar">
      {/* Left Section */}
      <div className="topbar-left">
        <img src={logo} alt="Logo" className="logo" />
        <h2 className="app-name">SILVLIGHT SHOP</h2>
      </div>

      {/* Middle Section (Menus) */}
      <div className="topbar-middle">
        <Link to="/landing" className="nav-link">Home</Link>
        <Link to="/dashboard/orders" className="nav-link">Orders</Link>
        <Link to="/blog" className="nav-link">Blog</Link>
        <Link to="/about" className="nav-link">About</Link>
      </div>

      {/* Right Section */}
      <div className="topbar-right">
        {/* Notifications */}
        <div className="notifications">
          <FaBell />
          <span className="badge">2</span>
        </div>

        {/* Cart Icon */}
        <div className="cart-icon" onClick={() => navigate("/cart")}>
          <FaShoppingCart />
          {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
        </div>

        {/* Profile Dropdown */}
        <div className="profile-dropdown">
          <div
            className="profile-container"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <FaUserCircle className="profile-icon" />
            <span className="user-name">{userName}</span>
          </div>

          {dropdownOpen && (
            <ul className="dropdown-menu">
              <li>
                <Link to="/dashboard/profile">Profile</Link>
              </li>
              <li>
                <Link to="/dashboard/settings">Settings</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserTopbar;
