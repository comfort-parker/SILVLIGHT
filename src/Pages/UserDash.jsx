// src/Pages/UserDashboard.jsx
import React from "react";
import UserTopbar from "../Components/Layout/UserTop";
import ProductsPage from "./ViewProduct";
import "./UserrDash.css";

const UserDashboard = () => {
  return (
    <div className="user-dashboard">
      {/* Topbar */}
      <UserTopbar />

      {/* ✅ ProductsPage in dashboard mode (no navbar, hero text customized) */}
      <ProductsPage hideNavbar={true} dashboardMode={true} />
    </div>
  );
};

export default UserDashboard;
