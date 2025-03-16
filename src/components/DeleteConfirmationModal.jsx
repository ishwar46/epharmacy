import React from "react";
import { IoClose } from "react-icons/io5";

const DeleteConfirmationModal = ({ open, handleClose, handleConfirm }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Confirm Deletion
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-red-500"
          >
            <IoClose size={20} />
          </button>
        </div>

        <p className="text-gray-700 dark:text-gray-300 mt-4">
          Are you sure you want to delete this product? This action cannot be
          undone.
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleClose}
            className="px-4 py-2 border rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
