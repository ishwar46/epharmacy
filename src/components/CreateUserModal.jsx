import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
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
    } catch (error) {
      console.error("Error geocoding address:", error);
    }
  };

  // -- Draggable marker logic
  const onMarkerDragEnd = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    setFormData((prev) => ({ ...prev, lat, lng }));
    setMapCenter({ lat, lng });
  }, []);

  const handleGeocodeManualAddress = async () => {
    if (!formData.address) return;
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

  // -- Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await createUser(formData);
      if (resp.success) {
        toast.success(resp.message || "User created successfully!");
        onUserCreated(resp.data);
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

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-4xl bg-white rounded-xl shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-blue-500 rounded-t-xl">
          <h3 className="text-lg font-semibold text-white">Add New User</h3>
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
            <div className="flex flex-col gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Optional phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                  <option value="delivery">Delivery</option>
                </select>
              </div>
            </div>

            {/* Right Column: Address + Map */}
            <div className="flex flex-col gap-4">
              {/* Google Autocomplete */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Address (Autocomplete)
                </label>
                <GooglePlacesAutocomplete
                  apiKey={import.meta.env.VITE_GOOGLE_PLACES_API}
                  selectProps={{
                    placeholder: "Type address...",
                    value: addressSelection,
                    onChange: handleAddressSelect,
                    // isClearable: true,
                  }}
                />
              </div>

              {/* Manual Address Input */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Or Enter Address Manually
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="address"
                    placeholder="Manual address"
                    value={formData.address}
                    onChange={handleChange}
                    className="flex-1 p-2 border border-gray-300 rounded"
                  />
                  <button
                    type="button"
                    onClick={handleGeocodeManualAddress}
                    className="px-3 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Geocode
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  If Autocomplete doesn’t work, type your address manually here
                  and optionally click “Geocode”.
                </p>
              </div>

              {/* Map Section */}
              <div className="flex-1 border border-gray-200 rounded">
                <LoadScript
                  googleMapsApiKey={import.meta.env.VITE_GOOGLE_PLACES_API}
                  libraries={["places"]}
                >
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "300px" }}
                    center={mapCenter}
                    zoom={14}
                  >
                    {/* Draggable Marker */}
                    {formData.lat && formData.lng && (
                      <Marker
                        position={{ lat: formData.lat, lng: formData.lng }}
                        draggable
                        onDragEnd={onMarkerDragEnd}
                      />
                    )}
                  </GoogleMap>
                </LoadScript>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-4 rounded bg-green-600 text-white hover:bg-green-700 transition"
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateUserModal;
