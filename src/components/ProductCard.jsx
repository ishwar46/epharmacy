import React from "react";
import { FaTag, FaPills, FaExclamationTriangle } from "react-icons/fa";

const ProductCard = ({ product, onEdit, onDelete, onViewDetails }) => {
  const {
    name,
    brand,
    category,
    medicineType,
    dosage,
    pricing,
    packaging,
    inventory,
    stockStatus,
    images,
    prescriptionRequired,
  } = product;

  const getStatusColor = (status) => {
    switch (status) {
      case "in_stock":
        return "bg-green-100 text-green-800";
      case "low_stock":
        return "bg-yellow-100 text-yellow-800";
      case "out_of_stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatPrice = (price) => {
    return `Rs. ${parseFloat(price).toFixed(2)}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-200">
      {/* Image */}
      <div className="h-48 bg-gray-100 relative">
        {images && images[0] ? (
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}${images[0]}`}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FaPills size={32} className="text-gray-400" />
          </div>
        )}

        {/* Medicine Type Badge */}
        <div className="absolute top-2 left-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              medicineType === "OTC"
                ? "bg-green-100 text-green-800"
                : "bg-orange-100 text-orange-800"
            }`}
          >
            {medicineType}
          </span>
        </div>

        {/* Stock Status Badge */}
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              stockStatus
            )}`}
          >
            {stockStatus.replace("_", " ").toUpperCase()}
          </span>
        </div>

        {/* Prescription Required Warning */}
        {prescriptionRequired && (
          <div className="absolute bottom-2 left-2">
            <FaExclamationTriangle
              className="text-red-500"
              size={16}
              title="Prescription Required"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">
            {name}
          </h3>
          <p className="text-sm text-gray-600">{brand}</p>
          <p className="text-xs text-gray-500">{category}</p>
        </div>

        {/* Dosage Info */}
        <div className="mb-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
            {dosage?.strength} {dosage?.form}
          </span>
        </div>

        {/* Pricing Options */}
        <div className="mb-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Per {packaging?.baseUnit}
            </span>
            <span className="font-semibold text-green-600">
              {formatPrice(pricing?.pricePerUnit)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Per {packaging?.packageType}
            </span>
            <span className="font-semibold text-green-600">
              {formatPrice(pricing?.pricePerPackage)}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {packaging?.unitsPerPackage} {packaging?.baseUnit}s per{" "}
            {packaging?.packageType}
          </div>
        </div>

        {/* Stock Info */}
        <div className="mb-4 p-2 bg-gray-50 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Available Units:</span>
            <span className="font-medium">
              {inventory?.availableUnits || 0}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Complete Packages:</span>
            <span className="font-medium">
              {Math.floor(
                (inventory?.availableUnits || 0) /
                  (packaging?.unitsPerPackage || 1)
              )}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(product)}
            className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
          >
            View Details
          </button>
          <button
            onClick={() => onEdit(product)}
            className="px-3 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(product._id)}
            className="px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
