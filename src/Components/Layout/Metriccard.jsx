import React from "react";
import "./MetricCard.css"; // Import the CSS file
import { FaUsers, FaBox, FaShoppingCart, FaDollarSign } from "react-icons/fa";

const MetricCard = ({ title, value }) => {
  const getIcon = () => {
    switch (title) {
      case "Total Users":
        return <FaUsers className="metric-icon users" />;
      case "Total Products":
        return <FaBox className="metric-icon products" />;
      case "Total Orders":
        return <FaShoppingCart className="metric-icon orders" />;
      case "Revenue":
        return <FaDollarSign className="metric-icon revenue" />;
      default:
        return null;
    }
  };

  return (
    <div className="metric-card">
      <div className="metric-content">
        {getIcon()}
        <div>
          <h3>{title}</h3>
          <p>{value}</p>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
