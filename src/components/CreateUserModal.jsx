import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import {
  FaUserPlus,
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
  FaMap,
  FaSearch,
} from "react-icons/fa";
import { createUser } from "../services/userService";
import toast from "react-hot-toast";

// Google Autocomplete
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";

// Google Maps
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";

const CreateUserModal = ({ open, handleClose, onUserCreated }) => {
  const [isModalOpen, setIsModalOpen] = useState(open);
  const [loading, setLoading] = useState(false);

  // We'll store the place selection so the Autocomplete can show it in the dropdown
  const [addressSelection, setAddressSelection] = useState(null);

  // Default center for the map (e.g. Kathmandu)
  const [mapCenter, setMapCenter] = useState({ lat: 27.700769, lng: 85.30014 });

  // Our user form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "customer",
    lat: null,
    lng: null,
  });

  // Style for the map container
  const mapContainerStyle = {
    width: "100%",
    height: "300px",
  };

  useEffect(() => {
    setIsModalOpen(open);
  }, [open]);

  // -- Basic text fields
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddressSelect = async (val) => {
    setAddressSelection(val);
    try {
      const results = await geocodeByAddress(val.label);
      const { lat, lng } = await getLatLng(results[0]);

      setFormData((prev) => ({
        ...prev,
        address: val.label,
        lat,
        lng,
      }));

      setMapCenter({ lat, lng });
      toast.success("Address located successfully!");
    } catch (error) {
      console.error("Error geocoding address:", error);
      toast.error("Unable to locate this address");
    }
  };

  // -- Draggable marker logic
  const onMarkerDragEnd = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    setFormData((prev) => ({ ...prev, lat, lng }));
    setMapCenter({ lat, lng });
    toast.success("Location updated!");
  }, []);

  const handleGeocodeManualAddress = async () => {
    if (!formData.address) {
      toast.error("Please enter an address first");
      return;
    }
    try {
      const results = await geocodeByAddress(formData.address);
      const { lat, lng } = await getLatLng(results[0]);
      setFormData((prev) => ({
        ...prev,
        lat,
        lng,
      }));
      setMapCenter({ lat, lng });
      toast.success("Address geocoded successfully!");
    } catch (error) {
      toast.error("Unable to geocode that address.");
      console.error("Error geocoding manual address:", error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      role: "customer",
      lat: null,
      lng: null,
    });
    setAddressSelection(null);
    setMapCenter({ lat: 27.700769, lng: 85.30014 });
  };

  // -- Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await createUser(formData);
      if (resp.success) {
        toast.success(resp.message || "User created successfully!");
        onUserCreated(resp.data);
        resetForm();
        handleClose();
      } else {
        toast.error(resp.message || "Failed to create user.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    resetForm();
    handleClose();
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-5xl bg-white rounded-xl shadow-2xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 border-b border-blue-700 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <FaUserPlus className="text-white" size={16} />
            </div>
            <h3 className="text-lg font-semibold text-white">
              Create New User
            </h3>
          </div>
          <button
            onClick={handleModalClose}
            className="text-white hover:text-red-200 hover:bg-white/10 p-2 rounded-lg focus:outline-none transition-all cursor-pointer"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Form - Now wraps everything including footer */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          {/* Form Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Basic Information Section */}
            <div>
              <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                <FaUser className="text-blue-500" size={14} />
                Basic Information
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FaUser className="text-gray-500" size={12} />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                      <FaEnvelope className="text-gray-500" size={12} />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                      <FaLock className="text-gray-500" size={12} />
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                      <FaPhone className="text-gray-500" size={12} />
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      placeholder="Enter phone number (optional)"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                      <FaUser className="text-gray-500" size={12} />
                      User Role *
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                      <option value="delivery">Delivery</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information Section */}
            <div>
              <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-green-500" size={14} />
                Address Information
              </h5>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Address Input Column */}
                <div className="space-y-4">
                  {/* Google Autocomplete */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                      <FaSearch className="text-gray-500" size={12} />
                      Search Address
                    </label>
                    <div className="relative">
                      <GooglePlacesAutocomplete
                        apiKey={import.meta.env.VITE_GOOGLE_PLACES_API}
                        selectProps={{
                          placeholder: "Type to search address...",
                          value: addressSelection,
                          onChange: handleAddressSelect,
                          styles: {
                            control: (provided) => ({
                              ...provided,
                              padding: "8px",
                              borderRadius: "12px",
                              border: "1px solid #d1d5db",
                              boxShadow: "none",
                              "&:hover": {
                                border: "1px solid #d1d5db",
                              },
                            }),
                            placeholder: (provided) => ({
                              ...provided,
                              color: "#9ca3af",
                            }),
                          },
                        }}
                      />
                    </div>
                  </div>

                  {/* Manual Address Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                      <FaMapMarkerAlt className="text-gray-500" size={12} />
                      Or Enter Manually
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="address"
                        placeholder="Enter address manually"
                        value={formData.address}
                        onChange={handleChange}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={handleGeocodeManualAddress}
                        className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors flex items-center gap-2 border border-gray-300"
                      >
                        <FaSearch size={12} />
                        Locate
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      If autocomplete doesn't work, enter your address manually
                      and click "Locate"
                    </p>
                  </div>

                  {/* Coordinates Display */}
                  {formData.lat && formData.lng && (
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                      <h6 className="text-sm font-medium text-green-800 mb-2">
                        Location Coordinates
                      </h6>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-green-600 font-medium">
                            Latitude:
                          </span>
                          <p className="text-green-800 font-mono">
                            {formData.lat.toFixed(6)}
                          </p>
                        </div>
                        <div>
                          <span className="text-green-600 font-medium">
                            Longitude:
                          </span>
                          <p className="text-green-800 font-mono">
                            {formData.lng.toFixed(6)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Map Column */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                    <FaMap className="text-gray-500" size={12} />
                    Location Map
                  </label>
                  <div className="border border-gray-300 rounded-xl overflow-hidden shadow-sm">
                    <LoadScript
                      googleMapsApiKey={import.meta.env.VITE_GOOGLE_PLACES_API}
                      libraries={["places"]}
                    >
                      <GoogleMap
                        mapContainerStyle={{ width: "100%", height: "300px" }}
                        center={mapCenter}
                        zoom={14}
                        options={{
                          styles: [
                            {
                              featureType: "poi",
                              elementType: "labels",
                              stylers: [{ visibility: "off" }],
                            },
                          ],
                        }}
                      >
                        {/* Draggable Marker */}
                        {formData.lat && formData.lng && (
                          <Marker
                            position={{ lat: formData.lat, lng: formData.lng }}
                            draggable
                            onDragEnd={onMarkerDragEnd}
                            title="Drag to adjust location"
                          />
                        )}
                      </GoogleMap>
                    </LoadScript>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    {formData.lat && formData.lng
                      ? "Drag the marker to fine-tune the location"
                      : "Search or enter an address to show location on map"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Now inside form */}
          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <button
              type="button"
              onClick={handleModalClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FaUserPlus size={14} />
                  Create User
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateUserModal;
