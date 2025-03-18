// CreateProductModal.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { createProduct } from "../services/productService";
import toast from "react-hot-toast";
import categories from "../constants/categories";

const CreateProductModal = ({ open, handleClose, onProductCreated }) => {
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

  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    setIsModalOpen(open);
  }, [open]);

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
    const combined = [...formData.images, ...newFiles];
    if (combined.length > 5) {
      toast.error("You cannot upload more than 5 images");
      return;
    }
    setFormData((prev) => ({ ...prev, images: combined }));

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  // Remove one preview
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
    setLoading(true);
    try {
      const resp = await createProduct(formData);
      if (resp.success) {
        onProductCreated(resp.data);
        toast.success(resp.message || "Product created successfully!");
        handleClose();
      } else {
        toast.error(resp.message || "Failed to create product.");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product.");
    } finally {
      setLoading(false);
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-3xl bg-white rounded-xl shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-blue-500 rounded-t-xl">
          <h3 className="text-lg font-semibold text-white">Create Product</h3>
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
                required
                className="p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="brand"
                placeholder="Brand"
                value={formData.brand}
                onChange={handleChange}
                required
                className="p-2 border border-gray-300 rounded"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
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
                required
                className="p-2 border border-gray-300 rounded"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="p-2 border border-gray-300 rounded"
                />
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
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
                required
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

          {/* Image Uploads */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Product Images (up to 5)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="border border-gray-300 p-2 rounded"
            />
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

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-2 rounded text-white bg-green-600 hover:bg-green-700 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Product"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateProductModal;
