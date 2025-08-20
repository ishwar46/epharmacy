import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { updateConfig } from "../services/promoBannerService";
import toast from "react-hot-toast";

const PromoBannerConfigModal = ({
  isOpen,
  onClose,
  onSuccess,
  config = {},
}) => {
  const [formData, setFormData] = useState({
    autoplayMs: 5500,
    showArrows: true,
    showDots: true,
    enableTouch: true,
    isActive: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (config && isOpen) {
      setFormData({
        autoplayMs: config.autoplayMs || 5500,
        showArrows: config.showArrows !== undefined ? config.showArrows : true,
        showDots: config.showDots !== undefined ? config.showDots : true,
        enableTouch: config.enableTouch !== undefined ? config.enableTouch : true,
        isActive: config.isActive !== undefined ? config.isActive : true,
      });
    }
  }, [config, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateConfig(formData);
      toast.success("Configuration updated successfully");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to update configuration");
      console.error("Config update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? parseInt(value) : value,
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
              Promo Banner Configuration
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
                Autoplay Speed (milliseconds)
              </label>
              <input
                type="number"
                name="autoplayMs"
                value={formData.autoplayMs}
                onChange={handleChange}
                min="1000"
                max="10000"
                step="500"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Time in milliseconds between automatic slide changes (1000-10000)
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="showArrows"
                  id="showArrows"
                  checked={formData.showArrows}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div>
                  <label
                    htmlFor="showArrows"
                    className="text-sm font-medium text-gray-700"
                  >
                    Show Navigation Arrows
                  </label>
                  <p className="text-xs text-gray-500">
                    Display left/right arrow buttons for manual navigation
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="showDots"
                  id="showDots"
                  checked={formData.showDots}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div>
                  <label
                    htmlFor="showDots"
                    className="text-sm font-medium text-gray-700"
                  >
                    Show Dot Indicators
                  </label>
                  <p className="text-xs text-gray-500">
                    Display dot indicators at the bottom of the slider
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="enableTouch"
                  id="enableTouch"
                  checked={formData.enableTouch}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div>
                  <label
                    htmlFor="enableTouch"
                    className="text-sm font-medium text-gray-700"
                  >
                    Enable Touch/Swipe Navigation
                  </label>
                  <p className="text-xs text-gray-500">
                    Allow users to swipe on mobile devices to change slides
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isActive"
                  id="configIsActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div>
                  <label
                    htmlFor="configIsActive"
                    className="text-sm font-medium text-gray-700"
                  >
                    Banner Active
                  </label>
                  <p className="text-xs text-gray-500">
                    Enable or disable the entire promo banner
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
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
                {loading ? "Saving..." : "Update Configuration"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PromoBannerConfigModal;