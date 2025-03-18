// EditProductModal.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
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

  useEffect(() => {
    setIsModalOpen(open);
    if (product) {
      setFormData({
        sku: product.sku,
        name: product.name,
        brand: product.brand,
        description: product.description,
        dosage: product.dosage,
        price: product.price,
        stock: product.stock,
        category: product.category,
        medicineType: product.medicineType,
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
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Append newly selected files
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...newFiles] }));

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
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

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product?._id) return;
    setLoading(true);
    try {
      const resp = await updateProduct(product._id, formData);
      if (resp.success) {
        toast.success(resp.message || "Product updated!");
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

  if (!isModalOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-3xl bg-white rounded-xl shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-blue-500 rounded-t-xl">
          <h3 className="text-lg font-semibold text-white">Edit Product</h3>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition-all"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 2-Column Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="flex flex-col gap-4">
              <input
                type="text"
                name="sku"
                placeholder="SKU"
                value={formData.sku}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="brand"
                placeholder="Brand"
                value={formData.brand}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded h-24"
              />
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-4">
              <input
                type="text"
                name="dosage"
                placeholder="Dosage"
                value={formData.dosage}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded"
                />
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded"
                />
              </div>
              <select
                name="medicineType"
                value={formData.medicineType}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded"
              >
                <option value="OTC">OTC</option>
                <option value="Prescription">Prescription</option>
              </select>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Existing Images */}
          {product.images && product.images.length > 0 && (
            <div>
              <p className="text-gray-700 font-medium mb-2">Current Images:</p>
              <div className="flex flex-wrap gap-3">
                {product.images.map((imgPath, idx) => (
                  <img
                    key={idx}
                    src={
                      imgPath.startsWith("http")
                        ? imgPath
                        : `${API_BASE_URL}${imgPath}`
                    }
                    alt={`Existing-${idx}`}
                    className="w-20 h-20 object-cover border rounded"
                  />
                ))}
              </div>
            </div>
          )}

          {/* File input for new images */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Add More Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="border border-gray-300 p-2 rounded"
            />
            <p className="text-sm text-gray-500 mt-1">
              Selecting new files will be appended to your current selection
              (merge vs replace depends on API).
            </p>

            {previewUrls.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {previewUrls.map((url, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={url}
                      alt={`NewPreview-${idx}`}
                      className="w-20 h-20 object-cover border rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removePreview(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`w-full py-2 rounded text-white bg-green-600 hover:bg-green-700 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default EditProductModal;
