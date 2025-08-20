import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../services/authService";
import {
  getAllSlides,
  getAllFeatures,
  getConfig,
  deleteSlide,
  deleteFeature,
  updateConfig,
  reorderSlides,
  reorderFeatures,
} from "../services/heroBannerService";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaEye,
  FaImage,
  FaCog,
  FaArrowUp,
  FaArrowDown,
  FaStar,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import toast from "react-hot-toast";
import Loading from "../components/Loading";
import { useDynamicTitle } from "../hooks/useDynamicTitle";
import HeroBannerSlideModal from "../components/HeroBannerSlideModal";
import HeroBannerFeatureModal from "../components/HeroBannerFeatureModal";

const HeroBannerDashboard = () => {
  useDynamicTitle("Hero Banner Management | Admin Dashboard | FixPharmacy");

  const navigate = useNavigate();
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Data states
  const [slides, setSlides] = useState([]);
  const [features, setFeatures] = useState([]);
  const [config, setConfig] = useState({});

  // UI states
  const [activeTab, setActiveTab] = useState("slides");
  const [showCreateSlideModal, setShowCreateSlideModal] = useState(false);
  const [showEditSlideModal, setShowEditSlideModal] = useState(false);
  const [showCreateFeatureModal, setShowCreateFeatureModal] = useState(false);
  const [showEditFeatureModal, setShowEditFeatureModal] = useState(false);
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
      toast.error("Failed to load hero banner data");
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
      toast.error("Failed to delete feature");
    }
  };

  const handleConfigUpdate = async (newConfig) => {
    try {
      await updateConfig(newConfig);
      setConfig(newConfig);
      toast.success("Configuration updated successfully");
    } catch (error) {
      toast.error("Failed to update configuration");
    }
  };

  const moveSlide = async (index, direction) => {
    const newSlides = [...slides];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= slides.length) return;

    [newSlides[index], newSlides[targetIndex]] = [
      newSlides[targetIndex],
      newSlides[index],
    ];

    const slideOrders = newSlides.map((slide, idx) => ({
      id: slide._id,
      order: idx,
    }));

    try {
      await reorderSlides(slideOrders);
      setSlides(newSlides);
      toast.success("Slides reordered successfully");
    } catch (error) {
      toast.error("Failed to reorder slides");
    }
  };

  const moveFeature = async (index, direction) => {
    const newFeatures = [...features];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= features.length) return;

    [newFeatures[index], newFeatures[targetIndex]] = [
      newFeatures[targetIndex],
      newFeatures[index],
    ];

    const featureOrders = newFeatures.map((feature, idx) => ({
      id: feature._id,
      order: idx,
    }));

    try {
      await reorderFeatures(featureOrders);
      setFeatures(newFeatures);
      toast.success("Features reordered successfully");
    } catch (error) {
      toast.error("Failed to reorder features");
    }
  };

  if (loading) {
    return <Loading />;
  }

  const gradientOptions = [
    "from-blue-600 to-blue-800",
    "from-green-600 to-green-800",
    "from-purple-600 to-purple-800",
    "from-red-600 to-red-800",
    "from-orange-600 to-orange-800",
    "from-teal-600 to-teal-800",
  ];

  const iconOptions = [
    "Shield",
    "Truck",
    "Clock",
    "Heart",
    "Award",
    "Phone",
    "Mail",
    "MapPin",
    "Package",
    "Pill",
    "Stethoscope",
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hero Banner Management
          </h1>
          <p className="text-gray-600">
            Manage slides, features, and configuration for the hero banner
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: "slides", label: "Slides", icon: FaImage },
                { id: "features", label: "Features", icon: FaStar },
                { id: "config", label: "Configuration", icon: FaCog },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "slides" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Banner Slides</h2>
                  <button
                    onClick={() => setShowCreateSlideModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <FaPlus />
                    <span>Add Slide</span>
                  </button>
                </div>

                <div className="grid gap-6">
                  {slides.map((slide, index) => (
                    <div
                      key={slide._id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex space-x-4 flex-1">
                          <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {slide.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-1">
                              {slide.subtitle}
                            </p>
                            <p className="text-sm text-gray-500 line-clamp-2">
                              {slide.description}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                CTA: {slide.ctaText}
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  slide.isActive
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {slide.isActive ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => moveSlide(index, "up")}
                            disabled={index === 0}
                            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          >
                            <FaArrowUp />
                          </button>
                          <button
                            onClick={() => moveSlide(index, "down")}
                            disabled={index === slides.length - 1}
                            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          >
                            <FaArrowDown />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedSlide(slide);
                              setShowEditSlideModal(true);
                            }}
                            className="p-2 text-blue-600 hover:text-blue-800"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteSlide(slide._id)}
                            className="p-2 text-red-600 hover:text-red-800"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {slides.length === 0 && (
                    <div className="text-center py-12">
                      <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No slides
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Get started by creating a new slide.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "features" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Banner Features</h2>
                  <button
                    onClick={() => setShowCreateFeatureModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <FaPlus />
                    <span>Add Feature</span>
                  </button>
                </div>

                <div className="grid gap-4">
                  {features.map((feature, index) => (
                    <div
                      key={feature._id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {feature.icon.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {feature.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {feature.description}
                            </p>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              feature.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {feature.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => moveFeature(index, "up")}
                            disabled={index === 0}
                            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          >
                            <FaArrowUp />
                          </button>
                          <button
                            onClick={() => moveFeature(index, "down")}
                            disabled={index === features.length - 1}
                            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          >
                            <FaArrowDown />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedFeature(feature);
                              setShowEditFeatureModal(true);
                            }}
                            className="p-2 text-blue-600 hover:text-blue-800"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteFeature(feature._id)}
                            className="p-2 text-red-600 hover:text-red-800"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {features.length === 0 && (
                    <div className="text-center py-12">
                      <FaStar className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No features
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Get started by creating a new feature.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "config" && (
              <div>
                <h2 className="text-xl font-semibold mb-6">
                  Banner Configuration
                </h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Slide Duration (ms)
                      </label>
                      <input
                        type="number"
                        min="2000"
                        max="10000"
                        value={config.slideDuration || 5000}
                        onChange={(e) =>
                          handleConfigUpdate({
                            ...config,
                            slideDuration: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Autoplay
                        </span>
                        <button
                          onClick={() =>
                            handleConfigUpdate({
                              ...config,
                              autoplay: !config.autoplay,
                            })
                          }
                          className={`flex items-center ${
                            config.autoplay ? "text-green-600" : "text-gray-400"
                          }`}
                        >
                          {config.autoplay ? (
                            <FaToggleOn size={24} />
                          ) : (
                            <FaToggleOff size={24} />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Show Arrows
                        </span>
                        <button
                          onClick={() =>
                            handleConfigUpdate({
                              ...config,
                              showArrows: !config.showArrows,
                            })
                          }
                          className={`flex items-center ${
                            config.showArrows
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          {config.showArrows ? (
                            <FaToggleOn size={24} />
                          ) : (
                            <FaToggleOff size={24} />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Show Indicators
                        </span>
                        <button
                          onClick={() =>
                            handleConfigUpdate({
                              ...config,
                              showIndicators: !config.showIndicators,
                            })
                          }
                          className={`flex items-center ${
                            config.showIndicators
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          {config.showIndicators ? (
                            <FaToggleOn size={24} />
                          ) : (
                            <FaToggleOff size={24} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <HeroBannerSlideModal
        isOpen={showCreateSlideModal}
        onClose={() => setShowCreateSlideModal(false)}
        onSuccess={fetchAllData}
        isEdit={false}
      />

      <HeroBannerSlideModal
        isOpen={showEditSlideModal}
        onClose={() => {
          setShowEditSlideModal(false);
          setSelectedSlide(null);
        }}
        onSuccess={fetchAllData}
        slide={selectedSlide}
        isEdit={true}
      />

      <HeroBannerFeatureModal
        isOpen={showCreateFeatureModal}
        onClose={() => setShowCreateFeatureModal(false)}
        onSuccess={fetchAllData}
        isEdit={false}
      />

      <HeroBannerFeatureModal
        isOpen={showEditFeatureModal}
        onClose={() => {
          setShowEditFeatureModal(false);
          setSelectedFeature(null);
        }}
        onSuccess={fetchAllData}
        feature={selectedFeature}
        isEdit={true}
      />
    </div>
  );
};

export default HeroBannerDashboard;
