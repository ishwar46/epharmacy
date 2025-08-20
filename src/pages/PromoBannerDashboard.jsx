import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../services/authService";
import {
  getAllSlides,
  getAllFeatures,
  getConfig,
  deleteSlide,
  deleteFeature,
} from "../services/promoBannerService";
import toast from "react-hot-toast";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCog,
  FaEye,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { useDynamicTitle } from "../hooks/useDynamicTitle";
import PromoBannerSlideModal from "../components/PromoBannerSlideModal";
import PromoBannerFeatureModal from "../components/PromoBannerFeatureModal";
import PromoBannerConfigModal from "../components/PromoBannerConfigModal";

const PromoBannerDashboard = () => {
  useDynamicTitle("Promo Banner Management | Admin Dashboard | FixPharmacy");

  const navigate = useNavigate();
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("slides");

  // Data state
  const [slides, setSlides] = useState([]);
  const [features, setFeatures] = useState([]);
  const [config, setConfig] = useState({});

  // Modal states
  const [showSlideModal, setShowSlideModal] = useState(false);
  const [showEditSlideModal, setShowEditSlideModal] = useState(false);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [showEditFeatureModal, setShowEditFeatureModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const meResponse = await getMe();
        setAdminInfo(meResponse.data);
      } catch (error) {
        console.error("Error fetching admin info:", error);
        navigate("/login");
        return;
      }
    };

    fetchAdminInfo();
  }, [navigate]);

  useEffect(() => {
    if (adminInfo) {
      fetchAllData();
    }
  }, [adminInfo]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [slidesRes, featuresRes, configRes] = await Promise.all([
        getAllSlides(),
        getAllFeatures(),
        getConfig(),
      ]);

      setSlides(slidesRes.data || []);
      setFeatures(featuresRes.data || []);
      setConfig(configRes.data || {});
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load promo banner data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSlide = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slide?")) return;

    try {
      await deleteSlide(id);
      toast.success("Slide deleted successfully");
      fetchAllData();
    } catch (error) {
      console.error("Error deleting slide:", error);
      toast.error("Failed to delete slide");
    }
  };

  const handleDeleteFeature = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feature?"))
      return;

    try {
      await deleteFeature(id);
      toast.success("Feature deleted successfully");
      fetchAllData();
    } catch (error) {
      console.error("Error deleting feature:", error);
      toast.error("Failed to delete feature");
    }
  };

  const handleEditSlide = (slide) => {
    setSelectedSlide(slide);
    setShowEditSlideModal(true);
  };

  const handleEditFeature = (feature) => {
    setSelectedFeature(feature);
    setShowEditFeatureModal(true);
  };

  const handleModalSuccess = () => {
    fetchAllData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!adminInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">!</span>
          </div>
          <p className="text-gray-600">Failed to load admin information</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "slides", label: "Slides", count: slides.length },
    { id: "features", label: "Features", count: features.length },
    { id: "config", label: "Configuration", count: 1 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Promo Banner Management
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage promotional slides, features and banner configuration
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {adminInfo.name}
                </p>
                <p className="text-xs text-gray-500">{adminInfo.email}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {adminInfo.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}{" "}
                  <span
                    className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      activeTab === tab.id
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "slides" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Promo Slides
                  </h2>
                  <button
                    onClick={() => setShowSlideModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                  >
                    <FaPlus size={14} />
                    Add Slide
                  </button>
                </div>

                <div className="space-y-4">
                  {slides.map((slide) => (
                    <div
                      key={slide._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`px-2 py-1 text-xs rounded-full font-medium ${slide.badgeClass}`}
                            >
                              {slide.badgeText}
                            </span>
                            {!slide.isActive && (
                              <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600 font-medium">
                                Inactive
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {slide.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {slide.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Order: {slide.order}</span>
                            <span>Emoji: {slide.accentEmoji}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handleEditSlide(slide)}
                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit slide"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteSlide(slide._id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete slide"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {slides.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>
                        No slides found. Add your first slide to get started.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "features" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Feature Cards
                  </h2>
                  <button
                    onClick={() => setShowFeatureModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                  >
                    <FaPlus size={14} />
                    Add Feature
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {features.map((feature) => (
                    <div
                      key={feature._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-1">
                            {feature.subtitle}
                          </p>
                          <p className="text-xs text-gray-500">
                            {feature.description}
                          </p>
                        </div>
                        {!feature.isActive && (
                          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600 font-medium">
                            Inactive
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          <span>Order: {feature.order}</span>
                          <span className="ml-4">Icon: {feature.icon}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEditFeature(feature)}
                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit feature"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteFeature(feature._id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete feature"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {features.length === 0 && (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      <p>
                        No features found. Add your first feature to get
                        started.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "config" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Banner Configuration
                  </h2>
                  <button
                    onClick={() => setShowConfigModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                  >
                    <FaCog size={14} />
                    Configure
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">
                        Autoplay Speed
                      </h3>
                      <p className="text-lg font-semibold text-blue-600">
                        {config.autoplayMs || 5500}ms
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">
                        Show Arrows
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          config.showArrows !== false
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {config.showArrows !== false ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">
                        Show Dots
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          config.showDots !== false
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {config.showDots !== false ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">
                        Touch Enabled
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          config.enableTouch !== false
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {config.enableTouch !== false ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showSlideModal && (
        <PromoBannerSlideModal
          isOpen={showSlideModal}
          onClose={() => setShowSlideModal(false)}
          onSuccess={handleModalSuccess}
          isEdit={false}
        />
      )}

      {showEditSlideModal && selectedSlide && (
        <PromoBannerSlideModal
          isOpen={showEditSlideModal}
          onClose={() => {
            setShowEditSlideModal(false);
            setSelectedSlide(null);
          }}
          onSuccess={handleModalSuccess}
          slide={selectedSlide}
          isEdit={true}
        />
      )}

      {showFeatureModal && (
        <PromoBannerFeatureModal
          isOpen={showFeatureModal}
          onClose={() => setShowFeatureModal(false)}
          onSuccess={handleModalSuccess}
          isEdit={false}
        />
      )}

      {showEditFeatureModal && selectedFeature && (
        <PromoBannerFeatureModal
          isOpen={showEditFeatureModal}
          onClose={() => {
            setShowEditFeatureModal(false);
            setSelectedFeature(null);
          }}
          onSuccess={handleModalSuccess}
          feature={selectedFeature}
          isEdit={true}
        />
      )}

      {showConfigModal && (
        <PromoBannerConfigModal
          isOpen={showConfigModal}
          onClose={() => setShowConfigModal(false)}
          onSuccess={handleModalSuccess}
          config={config}
        />
      )}
    </div>
  );
};

export default PromoBannerDashboard;
