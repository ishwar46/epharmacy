import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { updateProduct } from "../services/productService";
import toast from "react-hot-toast";

const EditProductModal = ({ open, product, handleClose, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(open);
  const [formData, setFormData] = useState(product);

  useEffect(() => {
    setIsModalOpen(open);
    setFormData(product);
  }, [open, product]);

  if (!isModalOpen || !product) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateProduct(product._id, formData);

      if (response.success) {
        toast.success(response.message || "Product updated successfully!");
      } else {
        toast.error("Failed to update product. Please try again.");
      }

      handleClose(); // Close the modal
      onUpdate(); // Refresh product list
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Error updating product. Please check the console.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-lg p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-300 dark:border-gray-700"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-xl">
          <h3 className="text-lg font-semibold text-white">Edit Product</h3>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition-all"
          >
            <IoClose size={22} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Product Name"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Brand"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Product Description"
            className="w-full p-2 border border-gray-300 rounded-lg"
          ></textarea>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="medicineType"
              value={formData.medicineType}
              onChange={handleChange}
              placeholder="Medicine Type"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
              placeholder="Dosage"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Stock"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2 bg-gray-500 text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
            >
              Update Product
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditProductModal;
