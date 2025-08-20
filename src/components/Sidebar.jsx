import React, { useState, useEffect } from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaSignOutAlt,
  FaBox,
  FaBars,
  FaTimes,
  FaImage,
} from "react-icons/fa";
import { FaCartFlatbed } from "react-icons/fa6";

const Sidebar = ({
  onSelect,
  selectedPage,
  isCollapsed,
  toggleCollapse,
  onLogout,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const menuItems = [
    { label: "Dashboard", icon: <FaTachometerAlt />, key: "dashboard" },
    { label: "Products", icon: <FaBox />, key: "products" },
    { label: "Users", icon: <FaUsers />, key: "users" },
    { label: "Orders", icon: <FaCartFlatbed />, key: "orders" },
    { label: "Hero Banner", icon: <FaImage />, key: "hero-banner" },
  ];

  const handleMenuItemClick = (key) => {
    onSelect(key);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  // Mobile Menu Button (Fixed position)
  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="fixed top-4 left-4 z-50 lg:hidden bg-white shadow-lg rounded-xl p-3 border border-gray-200"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <FaTimes className="w-5 h-5 text-gray-600" />
          ) : (
            <FaBars className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="https://i.ibb.co/RGtZpS0q/fixpharmacy.png"
                  alt="Logo"
                  className="h-8"
                />
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <FaTimes className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="px-4 py-6 flex-1">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.key}>
                  <button
                    onClick={() => handleMenuItemClick(item.key)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      selectedPage === item.key
                        ? "bg-blue-50 text-blue-600 border border-blue-100"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 p-4 text-white bg-red-500 hover:bg-red-600 transition-colors rounded-xl font-medium"
            >
              <FaSignOutAlt className="text-lg" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <div
      className={`hidden lg:flex h-full bg-white border-r border-gray-200 flex-col transition-all duration-300 shadow-sm ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://i.ibb.co/RGtZpS0q/fixpharmacy.png"
              alt="Logo"
              className={`h-8 transition-all duration-300 ${
                isCollapsed ? "opacity-0 w-0" : "opacity-100"
              }`}
            />
          </div>
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors group"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <div
              className={`transform transition-transform duration-300 ${
                isCollapsed ? "rotate-180" : ""
              }`}
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="px-4 py-6 flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.key} className="relative group">
              <button
                onClick={() => onSelect(item.key)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  selectedPage === item.key
                    ? "bg-blue-50 text-blue-600 border border-blue-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                } ${isCollapsed ? "justify-center" : ""}`}
              >
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                  <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 p-4 text-white bg-red-500 hover:bg-red-600 transition-colors rounded-xl font-medium ${
            isCollapsed ? "justify-center" : ""
          }`}
          aria-label="Logout"
        >
          <FaSignOutAlt className="text-lg flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
