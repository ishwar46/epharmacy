import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import {
  FaEdit,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUserTag,
} from "react-icons/fa";
import { updateUser } from "../services/userService";
import toast from "react-hot-toast";

const EditUserModal = ({ open, user, handleClose, onUpdated }) => {
  const [isModalOpen, setIsModalOpen] = useState(open);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "customer",
  });

  useEffect(() => {
    setIsModalOpen(open);
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        role: user.role || "customer",
      });
    }
  }, [open, user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Reset form
  const resetForm = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        role: user.role || "customer",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) return;
    setLoading(true);
    try {
      const resp = await updateUser(user._id, formData);
      if (resp.success) {
        toast.success(resp.message || "User updated successfully!");
        resetForm();
        onUpdated(); // re-fetch user list
        handleClose();
      } else {
        toast.error(resp.message || "Failed to update user.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error updating user.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    resetForm();
    handleClose();
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

  if (!isModalOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 border-b border-blue-700 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <FaEdit className="text-white" size={16} />
            </div>
            <h3 className="text-lg font-semibold text-white">Edit User</h3>
          </div>
          <button
            onClick={handleModalClose}
            className="text-white hover:text-red-200 hover:bg-white/10 p-2 rounded-lg focus:outline-none transition-all cursor-pointer"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Form - Now wraps everything including footer */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          {/* Form Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* User Info Header */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {user.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getRoleColor(
                        user.role
                      )}`}
                    >
                      {user.role
                        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                        : "Customer"}
                    </span>
                    <span className="text-sm text-gray-500">
                      ID: {user._id}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Information Section */}
            <div>
              <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                <FaUser className="text-blue-500" size={14} />
                Basic Information
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaUser className="text-gray-500" size={12} />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaUserTag className="text-gray-500" size={12} />
                    User Role *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                    <option value="delivery">Delivery</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div>
              <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                <FaEnvelope className="text-green-500" size={14} />
                Contact Information
              </h5>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaEnvelope className="text-gray-500" size={12} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Email address cannot be changed for security reasons
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaPhone className="text-gray-500" size={12} />
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Enter phone number (optional)"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Address Information Section */}
            <div>
              <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-purple-500" size={14} />
                Address Information
              </h5>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-gray-500" size={12} />
                  Full Address
                </label>
                <textarea
                  name="address"
                  placeholder="Enter full address (optional)"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical"
                />
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <h6 className="text-sm font-medium text-blue-800 mb-3 flex items-center gap-2">
                <FaUser className="text-blue-600" size={12} />
                Account Information
              </h6>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-600 font-medium">User ID:</span>
                  <p className="text-blue-800 font-mono text-xs break-all">
                    {user._id}
                  </p>
                </div>
                <div>
                  <span className="text-blue-600 font-medium">
                    Current Role:
                  </span>
                  <p className="text-blue-800">
                    {user.role
                      ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                      : "Customer"}
                  </p>
                </div>
                {user.createdAt && (
                  <div className="sm:col-span-2">
                    <span className="text-blue-600 font-medium">
                      Member Since:
                    </span>
                    <p className="text-blue-800">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer - Now inside form */}
          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <button
              type="button"
              onClick={handleModalClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-lg transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center gap-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <FaEdit size={14} />
                  Update User
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditUserModal;
