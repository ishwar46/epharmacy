import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createProduct } from "../services/productService";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import categories from "../constants/categories";

const CreateProductModal = ({ open, handleClose, onProductCreated }) => {
  const [isModalOpen, setIsModalOpen] = useState(open);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dosage: "",
    images: [
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/150",
    ],
    price: "",
    stock: "",
    category: "",
    brand: "",
    medicineType: "OTC",
  });

  useEffect(() => {
    setIsModalOpen(open);
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newProduct = await createProduct(formData);
      toast.success("Product added successfully!");
      handleClose();
      onProductCreated(newProduct.data);
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-300 dark:border-gray-700"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-xl">
          <h3 className="text-lg font-semibold text-white">Add New Product</h3>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 focus:outline-none transition-all"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 max-h-[550px] overflow-y-auto"
        >
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300"
            />
            <input
              type="text"
              name="brand"
              placeholder="Brand"
              value={formData.brand}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300"
            />
          </div>

          <textarea
            name="description"
            placeholder="Product Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="dosage"
              placeholder="Dosage Information"
              value={formData.dosage}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300"
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300"
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300"
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock Quantity"
              value={formData.stock}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300"
            />
            <select
              name="medicineType"
              value={formData.medicineType}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300"
            >
              <option value="OTC">OTC</option>
              <option value="Prescription">Prescription</option>
            </select>
          </div>

          {/* Image Preview Section */}
          <div className="flex justify-center gap-4">
            {formData.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Product Preview ${index + 1}`}
                className="w-24 h-24 object-cover border rounded-lg"
              />
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 text-white font-semibold rounded-lg transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateProductModal;
