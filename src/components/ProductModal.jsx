import React from "react";
import { FaBox, FaTimes, FaEye } from "react-icons/fa";

const ProductModal = ({ open, product, handleClose }) => {
  if (!open || !product) return null;

  const getStockStatus = () => {
    const availableStock = product.stock - (product.reservedStock || 0);
    if (availableStock === 0)
      return { text: "Out of Stock", color: "text-red-600 bg-red-50" };
    if (availableStock <= 5)
      return { text: "Low Stock", color: "text-yellow-600 bg-yellow-50" };
    return { text: "In Stock", color: "text-green-600 bg-green-50" };
  };

  const stockStatus = getStockStatus();
  const availableStock = product.stock - (product.reservedStock || 0);

  const getPriceDisplay = () => {
    if (product.productType === "tablet" || product.productType === "capsule") {
      return `Rs. ${product.price} per strip (${product.unitsPerStrip || 10} ${
        product.productType
      }s)`;
    } else if (product.productType === "syrup") {
      return `Rs. ${product.price} per bottle`;
    }
    return `Rs. ${product.price} per unit`;
  };

  const getStockDisplay = () => {
    if (product.productType === "tablet" || product.productType === "capsule") {
      const totalUnits = availableStock * (product.unitsPerStrip || 10);
      return `${availableStock} strips (${totalUnits} ${product.productType}s)`;
    } else if (product.productType === "syrup") {
      return `${availableStock} bottles`;
    }
    return `${availableStock} units`;
  };

  const getUnitPrice = () => {
    if (product.productType === "tablet" || product.productType === "capsule") {
      const unitPrice = product.price / (product.unitsPerStrip || 10);
      return `Rs. ${unitPrice.toFixed(2)} per ${product.productType}`;
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-blue-50">
          <div className="flex items-center gap-2">
            <FaEye className="text-blue-500" size={18} />
            <h3 className="text-lg font-semibold text-gray-900">
              Product Details
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
          {/* Product Images */}
          {product.images && product.images.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Product Images
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {product.images.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={
                        img.startsWith("http")
                          ? img
                          : `${import.meta.env.VITE_API_BASE_URL}${img}`
                      }
                      alt={`Product ${index + 1}`}
                      className="w-full h-20 object-cover rounded border"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">
                Basic Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    Product Name
                  </p>
                  <p className="font-medium text-gray-900">{product.name}</p>
                </div>

                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-500 uppercase mb-1">Brand</p>
                  <p className="text-gray-900">{product.brand}</p>
                </div>

                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    Category
                  </p>
                  <p className="text-gray-900">{product.category}</p>
                </div>

                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    Medicine Type
                  </p>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                      product.medicineType === "Prescription"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {product.medicineType}
                  </span>
                </div>

                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    Product Type
                  </p>
                  <p className="text-gray-900 capitalize">
                    {product.productType}
                  </p>
                </div>

                {(product.productType === "tablet" ||
                  product.productType === "capsule") && (
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500 uppercase mb-1">
                      Units per Strip
                    </p>
                    <p className="text-gray-900">
                      {product.unitsPerStrip || 10}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">
                Description
              </h4>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-gray-700">{product.description}</p>
              </div>
            </div>

            {/* Pricing Information */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">
                Pricing
              </h4>
              <div className="bg-blue-50 p-4 rounded border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <FaBox className="text-blue-600" size={16} />
                  <p className="text-blue-600 font-medium">Price</p>
                </div>
                <p className="text-xl font-bold text-blue-700">
                  {getPriceDisplay()}
                </p>
                {getUnitPrice() && (
                  <p className="text-sm text-blue-600 mt-1">{getUnitPrice()}</p>
                )}
              </div>
            </div>

            {/* Stock Information */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">
                Stock Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    Available Stock
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {getStockDisplay()}
                  </p>
                </div>

                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-500 uppercase mb-1">Status</p>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded ${stockStatus.color}`}
                  >
                    {stockStatus.text}
                  </span>
                </div>

                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    Total Stock
                  </p>
                  <p className="text-gray-900">{product.stock}</p>
                </div>

                {product.reservedStock > 0 && (
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500 uppercase mb-1">
                      Reserved Stock
                    </p>
                    <p className="text-gray-900">{product.reservedStock}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information */}
            {(product.dosage ||
              product.activeIngredient ||
              product.manufacturer) && (
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">
                  Additional Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.dosage && (
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500 uppercase mb-1">
                        Dosage
                      </p>
                      <p className="text-gray-900">{product.dosage}</p>
                    </div>
                  )}

                  {product.activeIngredient && (
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500 uppercase mb-1">
                        Active Ingredient
                      </p>
                      <p className="text-gray-900">
                        {product.activeIngredient}
                      </p>
                    </div>
                  )}

                  {product.manufacturer && (
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500 uppercase mb-1">
                        Manufacturer
                      </p>
                      <p className="text-gray-900">{product.manufacturer}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* System Information */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">
                System Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.createdAt && (
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500 uppercase mb-1">
                      Created
                    </p>
                    <p className="text-sm text-gray-900">
                      {new Date(product.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                )}

                {product.updatedAt && (
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500 uppercase mb-1">
                      Last Updated
                    </p>
                    <p className="text-sm text-gray-900">
                      {new Date(product.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-3 border-t bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
