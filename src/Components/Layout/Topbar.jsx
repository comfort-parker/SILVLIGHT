import React, { useState, useEffect } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../../assets/log.png";
import "./Topbar.css";

const Topbar = ({ toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
  const admin = JSON.parse(localStorage.getItem("admin"));
  const user = JSON.parse(localStorage.getItem("user"));

  if (admin && admin.firstName && admin.lastName) {
    setUserName(`${admin.firstName} ${admin.lastName}`);
  } else if (user && user.firstName && user.lastName) {
    setUserName(`${user.firstName} ${user.lastName}`);
  } else {
    setUserName(""); 
  }
}, []);


  return (
    <div className="topbar">
      <div className="topbar-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          &#9776;
        </button>
        <img src={logo} alt="Logo" className="logo" />
        <h2 className="app-name">Dashboard</h2>
      </div>

      <div className="topbar-right">
        <div className="notifications">
          <FaBell />
          <span className="badge">3</span>
        </div>

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
                <Link to={localStorage.getItem("role") === "admin" ? "/admin/profile" : "/dashboard/profile"}>
                  Profile
                </Link>
              </li>
              <li>
                <Link to={localStorage.getItem("role") === "admin" ? "/admin/settings" : "/dashboard/settings"}>
                  Settings
                </Link>
              </li>
              <li>
                <Link to="/landing">Logout</Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
