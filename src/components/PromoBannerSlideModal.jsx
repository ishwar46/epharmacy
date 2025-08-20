import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { createSlide, updateSlide } from "../services/promoBannerService";
import toast from "react-hot-toast";
import {
  Percent,
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
} from "lucide-react";

const PromoBannerSlideModal = ({
  isOpen,
  onClose,
  onSuccess,
  slide = null,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState({
    badgeIcon: "Percent",
    badgeText: "",
    title: "",
    description: "",
    primaryCta: {
      label: "",
      link: "",
    },
    secondaryCta: {
      label: "",
      link: "",
    },
    bgGradient: "from-purple-700 to-purple-900",
    badgeClass: "bg-amber-300 text-purple-900",
    accentEmoji: "💊",
    footNote: "",
    order: 0,
    isActive: true,
  });

  const [loading, setLoading] = useState(false);

  const iconOptions = [
    { value: "Percent", label: "Percent", component: Percent },
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
  ];

  const gradientOptions = [
    { value: "from-purple-700 to-purple-900", label: "Purple", color: "bg-gradient-to-r from-purple-700 to-purple-900" },
    { value: "from-blue-700 to-blue-900", label: "Blue", color: "bg-gradient-to-r from-blue-700 to-blue-900" },
    { value: "from-emerald-700 to-emerald-800", label: "Green", color: "bg-gradient-to-r from-emerald-700 to-emerald-800" },
    { value: "from-red-700 to-red-900", label: "Red", color: "bg-gradient-to-r from-red-700 to-red-900" },
    { value: "from-indigo-700 to-indigo-900", label: "Indigo", color: "bg-gradient-to-r from-indigo-700 to-indigo-900" },
    { value: "from-pink-700 to-pink-900", label: "Pink", color: "bg-gradient-to-r from-pink-700 to-pink-900" },
    { value: "from-sky-700 to-indigo-800", label: "Sky", color: "bg-gradient-to-r from-sky-700 to-indigo-800" },
  ];

  const badgeOptions = [
    { value: "bg-amber-300 text-purple-900", label: "Amber", color: "bg-amber-300 text-purple-900" },
    { value: "bg-emerald-200 text-emerald-900", label: "Emerald", color: "bg-emerald-200 text-emerald-900" },
    { value: "bg-sky-200 text-sky-900", label: "Sky", color: "bg-sky-200 text-sky-900" },
    { value: "bg-pink-200 text-pink-900", label: "Pink", color: "bg-pink-200 text-pink-900" },
    { value: "bg-blue-200 text-blue-900", label: "Blue", color: "bg-blue-200 text-blue-900" },
  ];

  useEffect(() => {
    if (slide && isEdit) {
      setFormData({
        badgeIcon: slide.badgeIcon || "Percent",
        badgeText: slide.badgeText || "",
        title: slide.title || "",
        description: slide.description || "",
        primaryCta: {
          label: slide.primaryCta?.label || "",
          link: slide.primaryCta?.link || "",
        },
        secondaryCta: {
          label: slide.secondaryCta?.label || "",
          link: slide.secondaryCta?.link || "",
        },
        bgGradient: slide.bgGradient || "from-purple-700 to-purple-900",
        badgeClass: slide.badgeClass || "bg-amber-300 text-purple-900",
        accentEmoji: slide.accentEmoji || "💊",
        footNote: slide.footNote || "",
        order: slide.order || 0,
        isActive: slide.isActive !== undefined ? slide.isActive : true,
      });
    }
  }, [slide, isEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit && slide) {
        await updateSlide(slide._id, formData);
        toast.success("Slide updated successfully");
      } else {
        await createSlide(formData);
        toast.success("Slide created successfully");
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(
        isEdit ? "Failed to update slide" : "Failed to create slide"
      );
      console.error("Slide operation error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {isEdit ? "Edit Promo Slide" : "Create New Promo Slide"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">Basic Information</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Badge Text
                  </label>
                  <input
                    type="text"
                    name="badgeText"
                    value={formData.badgeText}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Special Offer"
                  />
                </div>

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
                    placeholder="e.g., Get Up to 20% Off"
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
                    placeholder="Enter slide description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Foot Note
                  </label>
                  <input
                    type="text"
                    name="footNote"
                    value={formData.footNote}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Trusted by 1000+ customers"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Accent Emoji
                  </label>
                  <input
                    type="text"
                    name="accentEmoji"
                    value={formData.accentEmoji}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="💊"
                  />
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">Call to Actions</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary CTA Label
                  </label>
                  <input
                    type="text"
                    name="primaryCta.label"
                    value={formData.primaryCta.label}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Upload Prescription"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary CTA Link
                  </label>
                  <input
                    type="text"
                    name="primaryCta.link"
                    value={formData.primaryCta.link}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., /prescriptions"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Secondary CTA Label
                  </label>
                  <input
                    type="text"
                    name="secondaryCta.label"
                    value={formData.secondaryCta.label}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Browse Medicines"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Secondary CTA Link
                  </label>
                  <input
                    type="text"
                    name="secondaryCta.link"
                    value={formData.secondaryCta.link}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., /"
                  />
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
              </div>
            </div>

            {/* Styling Options */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">Styling Options</h4>
              
              {/* Badge Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Badge Icon
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {iconOptions.map((option) => {
                    const IconComponent = option.component;
                    return (
                      <label
                        key={option.value}
                        className="relative cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="badgeIcon"
                          value={option.value}
                          checked={formData.badgeIcon === option.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div
                          className={`p-3 rounded-lg border-2 flex flex-col items-center space-y-1 ${
                            formData.badgeIcon === option.value
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <IconComponent
                            size={20}
                            className={
                              formData.badgeIcon === option.value
                                ? "text-blue-600"
                                : "text-gray-600"
                            }
                          />
                          <span
                            className={`text-xs ${
                              formData.badgeIcon === option.value
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

              {/* Background Gradient */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Gradient
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {gradientOptions.map((option) => (
                    <label
                      key={option.value}
                      className="relative cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="bgGradient"
                        value={option.value}
                        checked={formData.bgGradient === option.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className={`p-3 rounded-lg border-2 flex flex-col items-center space-y-2 ${
                          formData.bgGradient === option.value
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

              {/* Badge Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Badge Style
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {badgeOptions.map((option) => (
                    <label
                      key={option.value}
                      className="relative cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="badgeClass"
                        value={option.value}
                        checked={formData.badgeClass === option.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className={`p-3 rounded-lg border-2 flex flex-col items-center space-y-2 ${
                          formData.badgeClass === option.value
                            ? "border-blue-500"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${option.color}`}
                        >
                          Badge
                        </div>
                        <span className="text-xs text-gray-600">
                          {option.label}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
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
                  ? "Update Slide"
                  : "Create Slide"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PromoBannerSlideModal;