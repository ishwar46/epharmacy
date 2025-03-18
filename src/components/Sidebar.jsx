import React from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaBoxOpen,
  FaSignOutAlt,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
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
    { label: "Products", icon: <FaBoxOpen />, key: "products" },
    { label: "Users", icon: <FaUsers />, key: "users" },
    { label: "Orders", icon: <FaBoxOpen />, key: "orders" },
  ];

  return (
    <div
      className={`h-full bg-green-800 text-white flex flex-col transition-all duration-300 shadow-lg ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Section: Logo & Collapse Button */}
      <div className="flex items-center justify-between p-4 border-b border-green-700">
        <div className="flex items-center">
          <img
            src="https://i.ibb.co/RGtZpS0q/fixpharmacy.png"
            alt="Logo"
            className={`h-8 transition-opacity duration-300 ${
              isCollapsed ? "opacity-0" : "opacity-100"
            }`}
          />
        </div>
        <button
          onClick={toggleCollapse}
          className="focus:outline-none p-2 rounded-md hover:bg-green-700 transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <FaAngleDoubleRight className="w-5 h-5" />
          ) : (
            <FaAngleDoubleLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <ul className="flex-grow mt-2">
        {menuItems.map((item) => (
          <li
            key={item.key}
            onClick={() => onSelect(item.key)}
            className={`relative flex items-center p-4 cursor-pointer transition-colors duration-300 rounded-r-lg ${
              selectedPage === item.key ? "bg-green-900" : "hover:bg-green-700"
            }`}
            tabIndex={0}
          >
            <span className="text-lg">{item.icon}</span>
            {!isCollapsed && <span className="ml-3">{item.label}</span>}

            {/* Tooltip for Collapsed State */}
            {isCollapsed && (
              <span className="absolute left-16 bg-gray-900 text-white text-xs px-2 py-1 rounded-md opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ul>

      {/* Logout Button */}
      <div className="p-4 border-t border-green-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center p-3 text-white bg-red-600 hover:bg-red-700 transition-colors rounded-md focus:outline-none"
          aria-label="Logout"
        >
          <FaSignOutAlt className="mr-2 text-lg" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
