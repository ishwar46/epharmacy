import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { FaBox, FaTag, FaCalendarAlt, FaCapsules } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProductModal = ({ open, product, handleClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(open);

  useEffect(() => {
    setIsModalOpen(open);
  }, [open]);

  if (!isModalOpen || !product) return null;

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

  // Helper function for price display
  const displayPrice = (price) => {
    if (price === null || price === undefined || price === "" || price === 0) {
      return <span className="text-gray-400 italic">N/A</span>;
    }
    return `Rs. ${price}`;
  };

  // Helper function for stock display with color coding
  const displayStock = (stock) => {
    if (stock === null || stock === undefined || stock === "") {
      return <span className="text-gray-400 italic">N/A</span>;
    }
    const stockNum = Number(stock);
    const colorClass =
      stockNum < 10
        ? "text-red-600"
        : stockNum < 50
        ? "text-yellow-600"
        : "text-green-600";
    return <span className={`font-medium ${colorClass}`}>{stockNum}</span>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 border-b border-blue-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <FaBox className="text-white" size={16} />
            </div>
            <h3 className="text-lg font-semibold text-white">
              Product Details
            </h3>
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
          {/* Product Images */}
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <FaTag className="text-gray-500" size={16} />
              <h4 className="text-gray-900 font-semibold">Product Images</h4>
            </div>
            {product.images && product.images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={
                        img.startsWith("http") ? img : `${API_BASE_URL}${img}`
                      }
                      alt={`Product image ${idx + 1}`}
                      className="w-full h-24 object-cover rounded-lg shadow-sm border border-gray-200 group-hover:shadow-md transition-shadow"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-sm text-gray-500 italic">
                  No images available
                </p>
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="p-6">
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <FaBox className="text-blue-500" size={14} />
                  Basic Information
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Product Name
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {displayValue(product.name)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Brand
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {displayValue(product.brand)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      SKU
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {displayValue(product.sku)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Category
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {displayValue(product.category)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Medicine Information */}
              <div>
                <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <FaCapsules className="text-green-500" size={14} />
                  Medicine Information
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Medicine Type
                    </p>
                    <div className="flex items-center gap-2">
                      {product.medicineType ? (
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-lg ${
                            product.medicineType === "Prescription"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {product.medicineType}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic text-sm">
                          N/A
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Dosage
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {displayValue(product.dosage)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Description
                </h5>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {displayValue(product.description)}
                  </p>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div>
                <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <FaCalendarAlt className="text-purple-500" size={14} />
                  Pricing & Inventory
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-600 uppercase tracking-wide mb-1 font-semibold">
                      Price
                    </p>
                    <p className="text-xl font-bold text-blue-700">
                      {displayPrice(product.price)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                    <p className="text-xs text-green-600 uppercase tracking-wide mb-1 font-semibold">
                      Stock Quantity
                    </p>
                    <p className="text-xl font-bold">
                      {displayStock(product.stock)}
                      {product.stock !== null &&
                        product.stock !== undefined &&
                        product.stock !== "" && (
                          <span className="text-sm font-normal text-gray-500 ml-1">
                            units
                          </span>
                        )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              {(product.manufacturingDate ||
                product.expiryDate ||
                product.batchNumber) && (
                <div>
                  <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                    Additional Information
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {product.manufacturingDate && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          Manufacturing Date
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {displayValue(product.manufacturingDate)}
                        </p>
                      </div>
                    )}
                    {product.expiryDate && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          Expiry Date
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {displayValue(product.expiryDate)}
                        </p>
                      </div>
                    )}
                    {product.batchNumber && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          Batch Number
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {displayValue(product.batchNumber)}
                        </p>
                      </div>
                    )}
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

export default ProductModal;
