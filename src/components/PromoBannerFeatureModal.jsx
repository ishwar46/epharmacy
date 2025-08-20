import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { createFeature, updateFeature } from "../services/promoBannerService";
import toast from "react-hot-toast";
import {
  Truck,
  Clock,
  Shield,
  Heart,
  Award,
  Phone,
  Mail,
  MapPin,
  Package,
  Pill,
  Stethoscope,
  Percent,
} from "lucide-react";

const PromoBannerFeatureModal = ({
  isOpen,
  onClose,
  onSuccess,
  feature = null,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    icon: "Truck",
    bgColor: "from-slate-800 to-slate-900",
    ctaText: "",
    ctaAction: "",
    order: 0,
    isActive: true,
  });

  const [loading, setLoading] = useState(false);

  const iconOptions = [
    { value: "Truck", label: "Truck", component: Truck },
    { value: "Clock", label: "Clock", component: Clock },
    { value: "Shield", label: "Shield", component: Shield },
    { value: "Heart", label: "Heart", component: Heart },
    { value: "Award", label: "Award", component: Award },
    { value: "Phone", label: "Phone", component: Phone },
    { value: "Mail", label: "Mail", component: Mail },
    { value: "MapPin", label: "Map Pin", component: MapPin },
    { value: "Package", label: "Package", component: Package },
    { value: "Pill", label: "Pill", component: Pill },
    { value: "Stethoscope", label: "Stethoscope", component: Stethoscope },
    { value: "Percent", label: "Percent", component: Percent },
  ];

  const bgColorOptions = [
    { value: "from-slate-800 to-slate-900", label: "Slate", color: "bg-gradient-to-r from-slate-800 to-slate-900" },
    { value: "from-zinc-800 to-zinc-900", label: "Zinc", color: "bg-gradient-to-r from-zinc-800 to-zinc-900" },
    { value: "from-gray-800 to-gray-900", label: "Gray", color: "bg-gradient-to-r from-gray-800 to-gray-900" },
    { value: "from-blue-800 to-blue-900", label: "Blue", color: "bg-gradient-to-r from-blue-800 to-blue-900" },
    { value: "from-purple-800 to-purple-900", label: "Purple", color: "bg-gradient-to-r from-purple-800 to-purple-900" },
    { value: "from-green-800 to-green-900", label: "Green", color: "bg-gradient-to-r from-green-800 to-green-900" },
    { value: "from-red-800 to-red-900", label: "Red", color: "bg-gradient-to-r from-red-800 to-red-900" },
  ];

  useEffect(() => {
    if (feature && isEdit) {
      setFormData({
        title: feature.title || "",
        subtitle: feature.subtitle || "",
        description: feature.description || "",
        icon: feature.icon || "Truck",
        bgColor: feature.bgColor || "from-slate-800 to-slate-900",
        ctaText: feature.ctaText || "",
        ctaAction: feature.ctaAction || "",
        order: feature.order || 0,
        isActive: feature.isActive !== undefined ? feature.isActive : true,
      });
    } else if (!isEdit) {
      setFormData({
        title: "",
        subtitle: "",
        description: "",
        icon: "Truck",
        bgColor: "from-slate-800 to-slate-900",
        ctaText: "",
        ctaAction: "",
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

        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {isEdit ? "Edit Promo Feature" : "Create New Promo Feature"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="e.g., Free Delivery"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., On orders above Rs. 500"
                />
              </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CTA Text
                </label>
                <input
                  type="text"
                  name="ctaText"
                  value={formData.ctaText}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Shop Now"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CTA Action
                </label>
                <input
                  type="text"
                  name="ctaAction"
                  value={formData.ctaAction}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., / or tel:+977-1-4445566"
                />
              </div>
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon
              </label>
              <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2">
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

            {/* Background Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Color
              </label>
              <div className="grid grid-cols-4 gap-2">
                {bgColorOptions.map((option) => (
                  <label
                    key={option.value}
                    className="relative cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="bgColor"
                      value={option.value}
                      checked={formData.bgColor === option.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div
                      className={`p-3 rounded-lg border-2 flex flex-col items-center space-y-2 ${
                        formData.bgColor === option.value
                          ? "border-blue-500"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded ${option.color}`}
                      />
                      <span className="text-xs text-gray-600">
                        {option.label}
                      </span>
                    </div>
                  </label>
                ))}
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

export default PromoBannerFeatureModal;