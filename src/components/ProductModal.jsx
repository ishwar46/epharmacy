import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";

const ProductModal = ({ open, product, handleClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(open);

  useEffect(() => {
    setIsModalOpen(open);
  }, [open]);

  if (!isModalOpen || !product) return null;

  const placeholderImages = [
    "https://www.shutterstock.com/shutterstock/photos/1682021551/display_1500/stock-vector-medicine-icon-trendy-and-modern-placeholder-symbol-for-logo-web-app-ui-1682021551.jpg",
    "https://www.shutterstock.com/shutterstock/photos/1682021551/display_1500/stock-vector-medicine-icon-trendy-and-modern-placeholder-symbol-for-logo-web-app-ui-1682021551.jpg",
    "https://www.shutterstock.com/shutterstock/photos/1682021551/display_1500/stock-vector-medicine-icon-trendy-and-modern-placeholder-symbol-for-logo-web-app-ui-1682021551.jpg",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-300 dark:border-gray-700"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-xl">
          <h3 className="text-lg font-semibold text-white">Product Details</h3>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 focus:outline-none transition-all"
          >
            <IoClose size={22} />
          </button>
        </div>

        {/* Product Images */}
        <div className="p-6">
          <h4 className="text-gray-900 dark:text-gray-100 font-semibold mb-2">
            Product Images
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {placeholderImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Placeholder ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg shadow-sm border border-gray-200"
              />
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div className="p-6 space-y-4 max-h-[450px] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <p className="text-sm text-gray-800 dark:text-gray-300">
              <strong className="text-gray-900 dark:text-gray-100">
                Name:
              </strong>{" "}
              {product.name}
            </p>
            <p className="text-sm text-gray-800 dark:text-gray-300">
              <strong className="text-gray-900 dark:text-gray-100">
                Brand:
              </strong>{" "}
              {product.brand}
            </p>
            <p className="text-sm text-gray-800 dark:text-gray-300">
              <strong className="text-gray-900 dark:text-gray-100">
                Category:
              </strong>{" "}
              {product.category}
            </p>
            <p className="text-sm text-gray-800 dark:text-gray-300">
              <strong className="text-gray-900 dark:text-gray-100">
                Medicine Type:
              </strong>{" "}
              {product.medicineType}
            </p>
          </div>

          <p className="text-sm text-gray-800 dark:text-gray-300 leading-relaxed">
            <strong className="text-gray-900 dark:text-gray-100">
              Description:
            </strong>{" "}
            {product.description}
          </p>

          <div className="flex justify-between items-center px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-800 dark:text-gray-300">
              <strong className="text-gray-900 dark:text-gray-100">
                Dosage:
              </strong>{" "}
              {product.dosage}
            </p>
            <p className="text-sm text-gray-800 dark:text-gray-300">
              <strong className="text-gray-900 dark:text-gray-100">
                Stock:
              </strong>{" "}
              {product.stock}
            </p>
            <p className="text-sm text-gray-800 dark:text-gray-300">
              <strong className="text-gray-900 dark:text-gray-100">
                Price:
              </strong>{" "}
              Rs. {product.price}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-200 dark:border-gray-700">
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

export default ProductModal;
