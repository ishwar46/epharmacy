// src/pages/AdminDashboard.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import PharmacyDashboard from "./PharmacyDashboard";
import { getMe } from "../services/authService";

const AdminDashboard = () => {
  const [selectedPage, setSelectedPage] = useState("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [adminInfo, setAdminInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const meResponse = await getMe();
        setAdminInfo(meResponse.data);
      } catch (error) {
        console.error("Error fetching admin info:", error);
      }
    };
    fetchAdmin();
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const sidebarWidth = isCollapsed ? "w-20" : "w-64";
  const contentMargin = isCollapsed ? "ml-20" : "ml-64";

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen z-50 transition-all duration-300 ${sidebarWidth}`}
      >
        <Sidebar
          adminInfo={adminInfo}
          onSelect={setSelectedPage}
          selectedPage={selectedPage}
          isCollapsed={isCollapsed}
          toggleCollapse={toggleCollapse}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content */}
      <div
        className={`${contentMargin} min-h-screen transition-all duration-300`}
      >
        <div className="p-6">
          {selectedPage === "dashboard" && <PharmacyDashboard />}
          {/* Render other pages based on selectedPage */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
