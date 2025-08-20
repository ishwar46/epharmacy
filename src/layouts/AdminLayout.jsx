import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getMe } from "../services/authService";
import { FaBars, FaTimes } from "react-icons/fa";
import { generateDynamicTitle, useDynamicTitle } from "../hooks/useDynamicTitle";

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminInfo, setAdminInfo] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Determine current page from URL path
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/admin/dashboard') return 'dashboard';
    if (path === '/admin/products') return 'products';
    if (path === '/admin/users') return 'users';
    if (path === '/admin/orders') return 'orders';
    if (path === '/admin/hero-banner') return 'hero-banner';
    if (path === '/admin/promo-banner') return 'promo-banner';
    if (path.startsWith('/admin/orders/')) return 'orderDetails';
    return 'dashboard';
  };

  const selectedPage = getCurrentPage();

  // Generate dynamic title based on selected page
  const dynamicTitle = generateDynamicTitle({
    page: "admin",
    productName: selectedPage === "orderDetails" ? `Order Details` : "",
    brand: selectedPage === "products" ? "Products Management" : 
           selectedPage === "users" ? "Users Management" : 
           selectedPage === "orders" ? "Orders Management" : 
           selectedPage === "orderDetails" ? "Order Details" : 
           selectedPage === "hero-banner" ? "Hero Banner Management" : 
           selectedPage === "promo-banner" ? "Promo Banner Management" : 
           selectedPage === "dashboard" ? "Dashboard" : ""
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

  // Handle page selection and navigation
  const handlePageSelect = (page) => {
    const routeMap = {
      dashboard: '/admin/dashboard',
      products: '/admin/products',
      users: '/admin/users',
      orders: '/admin/orders',
      'hero-banner': '/admin/hero-banner',
      'promo-banner': '/admin/promo-banner'
    };
    
    if (routeMap[page]) {
      navigate(routeMap[page]);
    }
    
    // Close mobile menu when navigating
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
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;