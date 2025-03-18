import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";

const UserModal = ({ open, user, handleClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(open);

  useEffect(() => {
    setIsModalOpen(open);
  }, [open]);

  if (!isModalOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md bg-white rounded-xl shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-indigo-500 rounded-t-xl">
          <h3 className="text-lg font-semibold text-white">User Details</h3>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition-all"
          >
            <IoClose size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone || "-"}
          </p>
          <p>
            <strong>Address:</strong> {user.address || "-"}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-5 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-600 text-white font-medium rounded-lg transition-all shadow-md"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UserModal;
