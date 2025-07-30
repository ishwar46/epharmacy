import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import {
  FaEdit,
  FaBox,
  FaTag,
  FaImage,
  FaTimes,
  FaUpload,
  FaTrash,
} from "react-icons/fa";
import { updateProduct } from "../services/productService";
import toast from "react-hot-toast";
import categories from "../constants/categories";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditProductModal = ({ open, product, handleClose, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(open);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    brand: "",
    description: "",
    dosage: "",
    price: "",
    stock: "",
    category: "",
    medicineType: "OTC",
    images: [],
  });

  // Local previews for newly selected files
  const [previewUrls, setPreviewUrls] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    setIsModalOpen(open);
    if (product) {
      setFormData({
        sku: product.sku || "",
        name: product.name || "",
        brand: product.brand || "",
        description: product.description || "",
        dosage: product.dosage || "",
        price: product.price || "",
        stock: product.stock || "",
        category: product.category || "",
        medicineType: product.medicineType || "OTC",
        images: [],
      });
      setPreviewUrls([]);
    }
  }, [open, product]);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  // Text input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    processFiles(newFiles);
  };

  // Process files (for both file input and drag-drop)
  const processFiles = (newFiles) => {
    const combined = [...formData.images, ...newFiles];
    if (combined.length > 5) {
      toast.error("You cannot upload more than 5 images");
      return;
    }
    setFormData((prev) => ({ ...prev, images: combined }));

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  // Drag handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );
      if (files.length > 0) {
        processFiles(files);
      }
    }
  };

  // Remove a preview
  const removePreview = (index) => {
    setPreviewUrls((prev) => {
      const updated = [...prev];
      const [removedUrl] = updated.splice(index, 1);
      URL.revokeObjectURL(removedUrl);
      return updated;
    });
    setFormData((prev) => {
      const updatedFiles = [...prev.images];
      updatedFiles.splice(index, 1);
      return { ...prev, images: updatedFiles };
    });
  };

  // Reset form
  const resetForm = () => {
    if (product) {
      setFormData({
        sku: product.sku || "",
        name: product.name || "",
        brand: product.brand || "",
        description: product.description || "",
        dosage: product.dosage || "",
        price: product.price || "",
        stock: product.stock || "",
        category: product.category || "",
        medicineType: product.medicineType || "OTC",
        images: [],
      });
    }
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviewUrls([]);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product?._id) return;
    setLoading(true);
    try {
      const resp = await updateProduct(product._id, formData);
      if (resp.success) {
        toast.success(resp.message || "Product updated successfully!");
        resetForm();
        onUpdate();
        handleClose();
      } else {
        toast.error(resp.message || "Failed to update product.");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Error updating product.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    resetForm();
    handleClose();
  };

  if (!isModalOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 border-b border-blue-700 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <FaEdit className="text-white" size={16} />
            </div>
            <h3 className="text-lg font-semibold text-white">Edit Product</h3>
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
            {/* Basic Information Section */}
            <div>
              <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                <FaBox className="text-blue-500" size={14} />
                Basic Information
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter product name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand *
                    </label>
                    <input
                      type="text"
                      name="brand"
                      placeholder="Enter brand name"
                      value={formData.brand}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKU *
                    </label>
                    <input
                      type="text"
                      name="sku"
                      placeholder="Enter SKU"
                      value={formData.sku}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medicine Type *
                    </label>
                    <select
                      name="medicineType"
                      value={formData.medicineType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="OTC">OTC (Over The Counter)</option>
                      <option value="Prescription">Prescription</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dosage *
                    </label>
                    <input
                      type="text"
                      name="dosage"
                      placeholder="e.g., 500mg, 10ml"
                      value={formData.dosage}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div>
              <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                Description
              </h5>
              <textarea
                name="description"
                placeholder="Enter detailed product description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical"
              />
            </div>

            {/* Pricing & Inventory Section */}
            <div>
              <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                <FaTag className="text-green-500" size={14} />
                Pricing & Inventory
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (Rs.) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    placeholder="0"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Current Images Section */}
            {product.images && product.images.length > 0 && (
              <div>
                <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                  <FaImage className="text-purple-500" size={14} />
                  Current Images
                </h5>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {product.images.map((imgPath, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={
                            imgPath.startsWith("http")
                              ? imgPath
                              : `${API_BASE_URL}${imgPath}`
                          }
                          alt={`Current image ${idx + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-300 shadow-sm"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors" />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-3 italic">
                    Current product images. Add new images below to append to
                    existing ones.
                  </p>
                </div>
              </div>
            )}

            {/* Add New Images Section */}
            <div>
              <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                <FaUpload className="text-orange-500" size={14} />
                Add New Images
              </h5>

              {/* Drag and Drop Area */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <FaUpload className="text-gray-500" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Drop new images here or click to browse
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Support JPG, PNG, GIF up to 10MB each (max 5 total)
                    </p>
                  </div>
                </div>
              </div>

              {/* New Image Previews */}
              {previewUrls.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    New Images to Add ({previewUrls.length}/5)
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {previewUrls.map((url, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={url}
                          alt={`New preview ${idx + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removePreview(idx)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                        >
                          <FaTimes size={10} />
                        </button>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                  Update Product
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditProductModal;
