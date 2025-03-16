// src/components/Sidebar.jsx
import React from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaBoxOpen,
  FaSignOutAlt,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaDelicious,
} from "react-icons/fa";

const Sidebar = ({
  onSelect,
  selectedPage,
  isCollapsed,
  toggleCollapse,
  onLogout,
}) => {
  const menuItems = [
    { label: "Dashboard", icon: <FaTachometerAlt />, key: "dashboard" },
    { label: "Users", icon: <FaUsers />, key: "users" },
    { label: "Products", icon: <FaBoxOpen />, key: "products" },
  ];

  return (
    <div
      className={`h-full bg-green-800 text-white flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Section: Logo and Collapse Button */}
      <div className="flex items-center justify-between p-4 border-b border-green-700">
        <div className="flex items-center">
          <img
            src="https://i.ibb.co/RGtZpS0q/fixpharmacy.png"
            alt="Logo"
            className="h-8 w-auto"
          />
        </div>
        <button onClick={toggleCollapse} className="focus:outline-none">
          {isCollapsed ? (
            <FaAngleDoubleRight className="w-6 h-6" />
          ) : (
            <FaAngleDoubleLeft className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <ul className="flex-grow">
        {menuItems.map((item) => (
          <li
            key={item.key}
            onClick={() => onSelect(item.key)}
            className={`flex items-center p-4 cursor-pointer transition-colors ${
              selectedPage === item.key ? "bg-green-900" : "hover:bg-green-700"
            }`}
          >
            <span className="mr-2">{item.icon}</span>
            {!isCollapsed && <span>{item.label}</span>}
          </li>
        ))}
      </ul>

      {/* Logout Button */}
      <div className="p-4 border-t border-green-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center hover:bg-green-700 transition-colors focus:outline-none"
        >
          <FaSignOutAlt className="mr-2" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
