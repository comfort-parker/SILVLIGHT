import React from "react";
import { NavLink } from "react-router-dom";
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaBoxOpen, 
  FaShoppingCart, 
  FaChartBar, 
  FaFileAlt, 
  FaCog, 
  FaLifeRing, 
  FaSignOutAlt
} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({ isCollapsed }) => {
  const mainMenuItems = [
    { name: "Dashboard", path: "/admin", icon: <FaTachometerAlt /> },
    { name: "Users", path: "/admin/users", icon: <FaUsers /> },
    { name: "Products", path: "/admin/products", icon: <FaBoxOpen /> },
    { name: "Orders", path: "/admin/orders", icon: <FaShoppingCart /> },
    { name: "Analytics", path: "/admin/analytics", icon: <FaChartBar /> },
    { name: "Content Management", path: "/admin/content", icon: <FaFileAlt /> },
  ];

  const bottomMenuItems = [
    { name: "Settings", path: "/admin/settings", icon: <FaCog /> },
    { name: "Support", path: "/admin/support", icon: <FaLifeRing /> },
    { name: "Logout", path: "/logout", icon: <FaSignOutAlt /> },
  ];

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Main menu */}
      <div className="menu-wrapper">
        <ul className="sidebar-menu">
          {mainMenuItems.map((item, index) => (
            <li key={index}>
              <NavLink to={item.path} className={({ isActive }) => (isActive ? "active" : "")}>
                <span className="icon">{item.icon}</span>
                {!isCollapsed && <span className="text">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Bottom menu */}
        <ul className="sidebar-menu bottom-menu">
          {bottomMenuItems.map((item, index) => (
            <li key={index}>
              <NavLink to={item.path} className={({ isActive }) => (isActive ? "active" : "")}>
                <span className="icon">{item.icon}</span>
                {!isCollapsed && <span className="text">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
