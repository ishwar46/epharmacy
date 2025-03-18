import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProductModal = ({ open, product, handleClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(open);

  useEffect(() => {
    setIsModalOpen(open);
  }, [open]);

  if (!isModalOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-lg bg-white rounded-xl shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-blue-500 rounded-t-xl">
          <h3 className="text-lg font-semibold text-white">Product Details</h3>
          <button
            onClick={handleClose}
            className="text-white hover:text-red-200 focus:outline-none transition-all cursor-pointer"
          >
            <IoClose size={22} />
          </button>
        </div>

        {/* Product Images */}
        <div className="p-6">
          <h4 className="text-gray-900 font-semibold mb-2">Product Images</h4>
          {product.images && product.images.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.startsWith("http") ? img : `${API_BASE_URL}${img}`}
                  alt={`ProductImg-${idx}`}
                  className="w-full h-24 object-cover rounded-lg shadow-sm border border-gray-200"
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No images available</p>
          )}
        </div>

        {/* Product Information */}
        <div className="p-6 space-y-4 max-h-[450px] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <p className="text-sm text-gray-800">
              <strong className="text-gray-900">Name:</strong> {product.name}
            </p>
            <p className="text-sm text-gray-800">
              <strong className="text-gray-900">Brand:</strong> {product.brand}
            </p>
            <p className="text-sm text-gray-800">
              <strong className="text-gray-900">SKU:</strong> {product.sku}
            </p>
            <p className="text-sm text-gray-800">
              <strong className="text-gray-900">Category:</strong>{" "}
              {product.category}
            </p>
            <p className="text-sm text-gray-800">
              <strong className="text-gray-900">Medicine Type:</strong>{" "}
              {product.medicineType}
            </p>
          </div>

          <p className="text-sm text-gray-800 leading-relaxed">
            <strong className="text-gray-900">Description:</strong>{" "}
            {product.description}
          </p>

          <div className="flex justify-between items-center px-4 py-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-800">
              <strong className="text-gray-900">Dosage:</strong>{" "}
              {product.dosage}
            </p>
            <p className="text-sm text-gray-800">
              <strong className="text-gray-900">Stock:</strong> {product.stock}
            </p>
            <p className="text-sm text-gray-800">
              <strong className="text-gray-900">Price:</strong> Rs.{" "}
              {product.price}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-5 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-600 text-white font-medium rounded-lg transition-all shadow-md cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductModal;
