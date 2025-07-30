import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUserTag,
  FaCalendarAlt,
} from "react-icons/fa";

const UserModal = ({ open, user, handleClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(open);

  useEffect(() => {
    setIsModalOpen(open);
  }, [open]);

  if (!isModalOpen || !user) return null;

  // Helper function to display value or N/A
  const displayValue = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      (typeof value === "string" && value.trim() === "")
    ) {
      return <span className="text-gray-400 italic">N/A</span>;
    }
    return value;
  };

  // Format date if available
  const formatDate = (dateString) => {
    if (!dateString) return <span className="text-gray-400 italic">N/A</span>;
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return <span className="text-gray-400 italic">Invalid Date</span>;
    }
  };

  // Get role color
  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-red-100 text-red-700";
      case "delivery":
        return "bg-blue-100 text-blue-700";
      case "customer":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 border-b border-blue-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <FaUser className="text-white" size={16} />
            </div>
            <h3 className="text-lg font-semibold text-white">User Details</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-red-200 hover:bg-white/10 p-2 rounded-lg focus:outline-none transition-all cursor-pointer"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* User Avatar Section */}
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-900">
                  {displayValue(user.name)}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  {user.role && (
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getRoleColor(
                        user.role
                      )}`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="p-6">
            <div className="space-y-6">
              {/* Contact Information */}
              <div>
                <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <FaEnvelope className="text-blue-500" size={14} />
                  Contact Information
                </h5>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FaEnvelope className="text-blue-600" size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          Email Address
                        </p>
                        <p className="text-sm font-medium text-gray-900 break-all">
                          {displayValue(user.email)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <FaPhone className="text-green-600" size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          Phone Number
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {displayValue(user.phone)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-500" size={14} />
                  Address Information
                </h5>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <FaMapMarkerAlt className="text-red-600" size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        Full Address
                      </p>
                      <p className="text-sm font-medium text-gray-900 leading-relaxed">
                        {displayValue(user.address)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div>
                <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <FaUserTag className="text-purple-500" size={14} />
                  Account Information
                </h5>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
                        <FaUserTag className="text-purple-700" size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-purple-600 uppercase tracking-wide mb-1 font-semibold">
                          User Role
                        </p>
                        <p className="text-lg font-bold text-purple-700">
                          {user.role
                            ? user.role.charAt(0).toUpperCase() +
                              user.role.slice(1)
                            : displayValue(user.role)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Dates */}
              {(user.createdAt || user.updatedAt) && (
                <div>
                  <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <FaCalendarAlt className="text-indigo-500" size={14} />
                    Account Timeline
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user.createdAt && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          Account Created
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(user.createdAt)}
                        </p>
                      </div>
                    )}
                    {user.updatedAt && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          Last Updated
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(user.updatedAt)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* User ID */}
              {user._id && (
                <div>
                  <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                    System Information
                  </h5>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      User ID
                    </p>
                    <p className="text-xs font-mono text-gray-600 break-all">
                      {user._id}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-medium rounded-lg transition-all shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UserModal;
