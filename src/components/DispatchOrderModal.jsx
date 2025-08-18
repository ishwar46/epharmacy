import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  IoClose, 
  IoSend, 
  IoPersonOutline,
  IoCallOutline,
  IoCarOutline,
  IoMapOutline,
  IoTimeOutline
} from "react-icons/io5";
import { FaTruck, FaRoute, FaMapMarkerAlt } from "react-icons/fa";
import { formatDate } from "../utils/dateUtils";
import { updateOrder } from "../services/orderService";
import toast from "react-hot-toast";

const DispatchOrderModal = ({ open, order, handleClose, onOrderUpdated }) => {
  const [dispatchData, setDispatchData] = useState({
    deliveryPersonName: "",
    deliveryPersonPhone: "",
    vehicleNumber: "",
    estimatedDeliveryTime: "",
    routeInstructions: "",
    dispatchNotes: "",
    priorityDelivery: false,
    trackingNumber: ""
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (order) {
      // Generate tracking number if not exists
      const trackingNumber = `TRK${Date.now().toString().slice(-8)}`;
      
      // Pre-populate with existing delivery info if available
      setDispatchData(prev => ({
        ...prev,
        deliveryPersonName: order.delivery?.assignedTo?.name || "",
        deliveryPersonPhone: order.delivery?.assignedTo?.phone || "",
        trackingNumber: order.trackingNumber || trackingNumber,
        estimatedDeliveryTime: order.delivery?.estimatedDeliveryTime 
          ? new Date(order.delivery.estimatedDeliveryTime).toISOString().slice(0, 16)
          : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16) // Default: 24 hours from now
      }));
    }
  }, [order]);

  if (!open || !order) return null;

  const handleDispatch = async () => {
    if (!dispatchData.deliveryPersonName.trim() || !dispatchData.deliveryPersonPhone.trim()) {
      toast.error("Please provide delivery person details");
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        status: 'out_for_delivery',
        dispatchDetails: {
          dispatchedAt: new Date().toISOString(),
          deliveryPersonName: dispatchData.deliveryPersonName,
          deliveryPersonPhone: dispatchData.deliveryPersonPhone,
          vehicleNumber: dispatchData.vehicleNumber,
          estimatedDeliveryTime: dispatchData.estimatedDeliveryTime,
          routeInstructions: dispatchData.routeInstructions,
          dispatchNotes: dispatchData.dispatchNotes,
          priorityDelivery: dispatchData.priorityDelivery,
          trackingNumber: dispatchData.trackingNumber
        },
        // Update delivery fields for backward compatibility
        deliveryPersonName: dispatchData.deliveryPersonName,
        deliveryPersonContact: dispatchData.deliveryPersonPhone,
        estimatedArrivalTime: dispatchData.estimatedDeliveryTime,
        trackingNumber: dispatchData.trackingNumber
      };

      const response = await updateOrder(order._id, updateData);
      toast.success("Order dispatched successfully!");
      
      if (onOrderUpdated) {
        onOrderUpdated(response.data);
      }
      
      handleClose();
    } catch (error) {
      console.error("Error dispatching order:", error);
      toast.error("Failed to dispatch order");
    } finally {
      setLoading(false);
    }
  };

  const isPackedOrder = order.status === 'packed';
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-xl border border-gray-300 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
          <div className="flex items-center gap-3">
            <FaTruck className="text-xl" />
            <div>
              <h3 className="text-lg font-semibold">Dispatch Order</h3>
              <p className="text-blue-100 text-sm">Order #{order.orderNumber}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-blue-200 focus:outline-none"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row h-full max-h-[calc(90vh-80px)]">
          {/* Left Panel - Order Summary */}
          <div className="lg:w-1/3 border-r border-gray-200 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Order Details */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <IoMapOutline className="text-blue-500" />
                  Order Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-medium">{order.customer?.user?.name || 'Guest'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items:</span>
                    <span className="font-medium">{order.items?.length} items</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-medium">Rs. {order.pricing?.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.payment?.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.payment?.method?.toUpperCase()} - {order.payment?.status?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-500" />
                  Delivery Address
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-medium text-gray-900">{order.deliveryAddress?.name}</p>
                  <p>{order.deliveryAddress?.street}</p>
                  <p>{order.deliveryAddress?.area}, {order.deliveryAddress?.city}</p>
                  <p>Phone: {order.deliveryAddress?.phone}</p>
                  {order.deliveryAddress?.deliveryInstructions && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                      <strong>Instructions:</strong> {order.deliveryAddress.deliveryInstructions}
                    </div>
                  )}
                </div>
              </div>

              {/* Package Details */}
              {order.packingDetails && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Package Info</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    {order.packingDetails.packageWeight && (
                      <p>Weight: {order.packingDetails.packageWeight}g</p>
                    )}
                    {order.packingDetails.fragileItems && (
                      <span className="inline-block px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                        Fragile Items
                      </span>
                    )}
                    {order.packingDetails.coldStorage && (
                      <span className="inline-block ml-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Cold Storage
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Dispatch Details */}
          <div className="lg:w-2/3 p-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">Dispatch Information</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Tracking:</span>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {dispatchData.trackingNumber}
                  </span>
                </div>
              </div>

              {/* Delivery Person Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <IoPersonOutline className="inline mr-1" /> Delivery Person Name *
                  </label>
                  <input
                    type="text"
                    value={dispatchData.deliveryPersonName}
                    onChange={(e) => setDispatchData(prev => ({ ...prev, deliveryPersonName: e.target.value }))}
                    placeholder="Enter delivery person name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <IoCallOutline className="inline mr-1" /> Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={dispatchData.deliveryPersonPhone}
                    onChange={(e) => setDispatchData(prev => ({ ...prev, deliveryPersonPhone: e.target.value }))}
                    placeholder="Enter phone number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <IoCarOutline className="inline mr-1" /> Vehicle Number
                  </label>
                  <input
                    type="text"
                    value={dispatchData.vehicleNumber}
                    onChange={(e) => setDispatchData(prev => ({ ...prev, vehicleNumber: e.target.value }))}
                    placeholder="e.g. BA 1 KHA 1234"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <IoTimeOutline className="inline mr-1" /> Estimated Delivery Time
                  </label>
                  <input
                    type="datetime-local"
                    value={dispatchData.estimatedDeliveryTime}
                    onChange={(e) => setDispatchData(prev => ({ ...prev, estimatedDeliveryTime: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Route Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaRoute className="inline mr-1" /> Route Instructions
                </label>
                <textarea
                  value={dispatchData.routeInstructions}
                  onChange={(e) => setDispatchData(prev => ({ ...prev, routeInstructions: e.target.value }))}
                  placeholder="Provide route instructions or directions..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
              </div>

              {/* Dispatch Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dispatch Notes</label>
                <textarea
                  value={dispatchData.dispatchNotes}
                  onChange={(e) => setDispatchData(prev => ({ ...prev, dispatchNotes: e.target.value }))}
                  placeholder="Any additional notes for the delivery person..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
              </div>

              {/* Priority Delivery */}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={dispatchData.priorityDelivery}
                    onChange={(e) => setDispatchData(prev => ({ ...prev, priorityDelivery: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Priority Delivery</span>
                </label>
                {dispatchData.priorityDelivery && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                    High Priority
                  </span>
                )}
              </div>

              {/* Dispatch Button */}
              <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200">
                <button
                  onClick={handleDispatch}
                  disabled={!dispatchData.deliveryPersonName.trim() || !dispatchData.deliveryPersonPhone.trim() || loading}
                  className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    dispatchData.deliveryPersonName.trim() && dispatchData.deliveryPersonPhone.trim() && !loading
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <IoSend size={18} />
                  {loading ? 'Dispatching...' : 'Dispatch Order'}
                </button>
                {(!dispatchData.deliveryPersonName.trim() || !dispatchData.deliveryPersonPhone.trim()) && (
                  <p className="text-center text-sm text-gray-500 mt-2">
                    Please provide delivery person details to dispatch
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DispatchOrderModal;