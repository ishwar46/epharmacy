import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import PharmacyDashboard from "./PharmacyDashboard";
import AdminOrders from "./AdminOrders";
import AdminOrderDetails from "../components/AdminOrderDetails";
import { getMe } from "../services/authService";
import ProductsDashboard from "./ProductsDashboard";
import UsersDashboard from "./UsersDashboard";
import { FaBars, FaTimes } from "react-icons/fa";
import { generateDynamicTitle, useDynamicTitle } from "../hooks/useDynamicTitle";

const AdminDashboard = () => {
  const [selectedPage, setSelectedPage] = useState("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminInfo, setAdminInfo] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const navigate = useNavigate();

  // Generate dynamic title based on selected page
  const dynamicTitle = generateDynamicTitle({
    page: selectedPage === "dashboard" ? "admin" : selectedPage === "orderDetails" ? "admin" : "admin",
    productName: selectedPage === "orderDetails" ? `Order #${selectedOrderId}` : "",
    brand: selectedPage === "products" ? "Products Management" : 
           selectedPage === "users" ? "Users Management" : 
           selectedPage === "orders" ? "Orders Management" : 
           selectedPage === "orderDetails" ? "Order Details" : ""
  });

  // Update document title in real-time
  useDynamicTitle(dynamicTitle);

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

  // Close mobile menu when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  // Handle order selection
  const handleOrderSelect = (orderId) => {
    setSelectedOrderId(orderId);
    setSelectedPage("orderDetails");
    // Close mobile menu when navigating
    setIsMobileMenuOpen(false);
  };

  // Handle going back from order details to orders list
  const handleBackToOrders = () => {
    setSelectedOrderId(null);
    setSelectedPage("orders");
  };

  // Handle page selection and close mobile menu
  const handlePageSelect = (page) => {
    setSelectedPage(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-50">
        <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
        <button
          onClick={toggleMobileMenu}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen z-50 transition-all duration-300
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "lg:w-20" : "lg:w-64"}
          lg:translate-x-0 w-64
        `}
      >
        <Sidebar
          adminInfo={adminInfo}
          onSelect={handlePageSelect}
          selectedPage={selectedPage}
          isCollapsed={isCollapsed}
          toggleCollapse={toggleCollapse}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content */}
      <div
        className={`
          min-h-screen transition-all duration-300 pt-16 lg:pt-0
          ${isCollapsed ? "lg:ml-20" : "lg:ml-64"}
        `}
      >
        <div className="p-4 lg:p-6">
          {selectedPage === "dashboard" && <PharmacyDashboard />}
          {selectedPage === "products" && <ProductsDashboard />}
          {selectedPage === "users" && <UsersDashboard />}
          {selectedPage === "orders" && (
            <AdminOrders onOrderSelect={handleOrderSelect} />
          )}
          {selectedPage === "orderDetails" && selectedOrderId && (
            <AdminOrderDetails
              orderId={selectedOrderId}
              goBack={handleBackToOrders}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
