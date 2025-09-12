import React, { useState } from "react";
import Sidebar from "../Components/Layout/Sidebar";
import Topbar from "../Components/Layout/Topbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  return (
    <div>
      {/* Topbar */}
      <Topbar toggleSidebar={toggleSidebar} />

      {/* Sidebar */}
      <Sidebar isCollapsed={isSidebarCollapsed} />

      {/* Main content */}
      <div
        style={{
          marginLeft: isSidebarCollapsed ? "60px" : "220px",
          padding: "20px",
          marginTop: "60px",
          transition: "margin-left 0.3s",
        }}
      >
        {/* 👇 Child routes will render here */}
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
