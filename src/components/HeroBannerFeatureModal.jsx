import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { createFeature, updateFeature } from "../services/heroBannerService";
import toast from "react-hot-toast";
import {
  Shield,
  Truck,
  Clock,
  Heart,
  Award,
  Phone,
  Mail,
  MapPin,
  Package,
  Pill,
  Stethoscope,
} from "lucide-react";

const HeroBannerFeatureModal = ({
  isOpen,
  onClose,
  onSuccess,
  feature = null,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "Shield",
    order: 0,
    isActive: true,
  });

  const [loading, setLoading] = useState(false);

  const iconOptions = [
    { value: "Shield", label: "Shield", component: Shield },
    { value: "Truck", label: "Truck", component: Truck },
    { value: "Clock", label: "Clock", component: Clock },
    { value: "Heart", label: "Heart", component: Heart },
    { value: "Award", label: "Award", component: Award },
    { value: "Phone", label: "Phone", component: Phone },
    { value: "Mail", label: "Mail", component: Mail },
    { value: "MapPin", label: "Map Pin", component: MapPin },
    { value: "Package", label: "Package", component: Package },
    { value: "Pill", label: "Pill", component: Pill },
    { value: "Stethoscope", label: "Stethoscope", component: Stethoscope },
  ];

  useEffect(() => {
    if (feature && isEdit) {
      setFormData({
        title: feature.title || "",
        description: feature.description || "",
        icon: feature.icon || "Shield",
        order: feature.order || 0,
        isActive: feature.isActive !== undefined ? feature.isActive : true,
      });
    } else if (!isEdit) {
      setFormData({
        title: "",
        description: "",
        icon: "Shield",
        order: 0,
        isActive: true,
      });
    }
  }, [feature, isEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit && feature) {
        await updateFeature(feature._id, formData);
        toast.success("Feature updated successfully");
      } else {
        await createFeature(formData);
        toast.success("Feature created successfully");
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(
        isEdit ? "Failed to update feature" : "Failed to create feature"
      );
      console.error("Feature operation error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {isEdit ? "Edit Feature" : "Create New Feature"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter feature title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter feature description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon
              </label>
              <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2">
                {iconOptions.map((option) => {
                  const IconComponent = option.component;
                  return (
                    <label
                      key={option.value}
                      className="relative cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="icon"
                        value={option.value}
                        checked={formData.icon === option.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className={`p-3 rounded-lg border-2 flex flex-col items-center space-y-1 ${
                          formData.icon === option.value
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <IconComponent
                          size={20}
                          className={
                            formData.icon === option.value
                              ? "text-blue-600"
                              : "text-gray-600"
                          }
                        />
                        <span
                          className={`text-xs ${
                            formData.icon === option.value
                              ? "text-blue-600"
                              : "text-gray-600"
                          }`}
                        >
                          {option.label}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center space-x-3 mt-6">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium text-gray-700"
                >
                  Active
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : isEdit
                  ? "Update Feature"
                  : "Create Feature"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HeroBannerFeatureModal;
