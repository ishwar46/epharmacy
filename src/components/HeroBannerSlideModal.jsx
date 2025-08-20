import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { createSlide, updateSlide } from '../services/heroBannerService';
import toast from 'react-hot-toast';

const HeroBannerSlideModal = ({ isOpen, onClose, onSuccess, slide = null, isEdit = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    ctaText: '',
    ctaLink: '',
    bgGradient: 'from-blue-600 to-blue-800',
    order: 0,
    isActive: true
  });
  
  const [loading, setLoading] = useState(false);

  const gradientOptions = [
    { value: 'from-blue-600 to-blue-800', label: 'Blue', preview: 'bg-gradient-to-r from-blue-600 to-blue-800' },
    { value: 'from-green-600 to-green-800', label: 'Green', preview: 'bg-gradient-to-r from-green-600 to-green-800' },
    { value: 'from-purple-600 to-purple-800', label: 'Purple', preview: 'bg-gradient-to-r from-purple-600 to-purple-800' },
    { value: 'from-red-600 to-red-800', label: 'Red', preview: 'bg-gradient-to-r from-red-600 to-red-800' },
    { value: 'from-orange-600 to-orange-800', label: 'Orange', preview: 'bg-gradient-to-r from-orange-600 to-orange-800' },
    { value: 'from-teal-600 to-teal-800', label: 'Teal', preview: 'bg-gradient-to-r from-teal-600 to-teal-800' },
  ];

  useEffect(() => {
    if (slide && isEdit) {
      setFormData({
        title: slide.title || '',
        subtitle: slide.subtitle || '',
        description: slide.description || '',
        image: slide.image || '',
        ctaText: slide.ctaText || '',
        ctaLink: slide.ctaLink || '',
        bgGradient: slide.bgGradient || 'from-blue-600 to-blue-800',
        order: slide.order || 0,
        isActive: slide.isActive !== undefined ? slide.isActive : true
      });
    } else if (!isEdit) {
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        image: '',
        ctaText: '',
        ctaLink: '',
        bgGradient: 'from-blue-600 to-blue-800',
        order: 0,
        isActive: true
      });
    }
  }, [slide, isEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit && slide) {
        await updateSlide(slide._id, formData);
        toast.success('Slide updated successfully');
      } else {
        await createSlide(formData);
        toast.success('Slide created successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(isEdit ? 'Failed to update slide' : 'Failed to create slide');
      console.error('Slide operation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        
        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {isEdit ? 'Edit Slide' : 'Create New Slide'}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter slide title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter slide subtitle"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter image URL"
              />
              {formData.image && (
                <div className="mt-2">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="h-20 w-32 object-cover rounded-lg border"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link</label>
                <input
                  type="text"
                  name="ctaLink"
                  value={formData.ctaLink}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., /products or #products"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Background Gradient</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {gradientOptions.map((option) => (
                  <label key={option.value} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="bgGradient"
                      value={option.value}
                      checked={formData.bgGradient === option.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`h-12 rounded-lg border-2 ${option.preview} ${
                      formData.bgGradient === option.value ? 'border-blue-500' : 'border-gray-200'
                    }`}>
                      <div className="h-full w-full rounded-lg bg-black bg-opacity-20 flex items-center justify-center">
                        <span className="text-white text-xs font-medium">{option.label}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
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
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
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
                {loading ? 'Saving...' : (isEdit ? 'Update Slide' : 'Create Slide')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HeroBannerSlideModal;