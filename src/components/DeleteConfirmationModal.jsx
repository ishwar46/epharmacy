import React from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { FaExclamationTriangle, FaTrash } from "react-icons/fa";

const DeleteConfirmationModal = ({
  open,
  handleClose,
  handleConfirm,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmText = "Yes, Delete",
  cancelText = "Cancel",
  loading = false,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 border-b border-red-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <FaExclamationTriangle className="text-white" size={16} />
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-red-200 hover:bg-white/10 p-2 rounded-lg focus:outline-none transition-all cursor-pointer"
            disabled={loading}
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Warning Icon */}
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <FaExclamationTriangle className="text-red-600" size={32} />
            </div>
          </div>

          {/* Message */}
          <div className="text-center mb-6">
            <p className="text-gray-700 leading-relaxed">{message}</p>
            <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-700 font-medium flex items-center justify-center gap-2">
                <FaExclamationTriangle size={14} />
                This action cannot be undone
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-lg transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center gap-2 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <FaTrash size={14} />
                {confirmText}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteConfirmationModal;
