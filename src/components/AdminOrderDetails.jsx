import React, { useEffect, useState, useCallback } from "react";
import {
  FaArrowLeft,
  FaBoxOpen,
  FaMapMarkerAlt,
  FaSyncAlt,
  FaTruck,
  FaUser,
  FaCreditCard,
  FaCalendarAlt,
  FaEdit,
  FaShoppingCart,
  FaSignature,
  FaCheckCircle,
  FaTimesCircle,
  FaTag,
  FaPercent,
  FaDollarSign,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { getOrder } from "../services/orderService";
import UpdateOrderModal from "../components/UpdateOrderModal.jsx";
import { formatDate } from "../utils/dateUtils";
import { getStatusColor } from "../utils/statusUtils";
import { useDynamicTitle } from "../hooks/useDynamicTitle";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600 font-medium">Loading order details...</p>
    </div>
  </div>
);

const ErrorMessage = ({ message, onRetry, actionLabel }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center"
    >
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FaTimesCircle className="text-red-500 text-2xl" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Error</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
        >
          <FaArrowLeft />
          {actionLabel || "Retry"}
        </button>
      )}
    </motion.div>
  </div>
);

const AdminOrderDetails = ({ orderId, goBack }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [error, setError] = useState(null);

  // Set dynamic title for order details
  useDynamicTitle(`Order #${orderId} | Order Details | Admin Dashboard | FixPharmacy`);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getOrder(orderId);
      if (response.success && response.data) {
        setOrder(response.data);
      } else {
        throw new Error("Invalid response structure.");
      }
    } catch (err) {
      console.error("Error fetching order:", err);
      setError("Failed to fetch order details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // Helper function to display value or N/A
  const displayValue = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      (typeof value === "string" && value.trim() === "")
    ) {
      return <span className="text-gray-400 italic">N/A</span>;
    }
    return value;
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <ErrorMessage message={error} onRetry={fetchOrder} actionLabel="Retry" />
    );
  if (!order)
    return (
      <ErrorMessage
        message="Order not found."
        onRetry={goBack}
        actionLabel="Back to Orders"
      />
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={goBack}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                <FaArrowLeft />
                <span>Back to Orders</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <button
                onClick={fetchOrder}
                className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors font-medium"
              >
                <FaSyncAlt />
                <span>Refresh</span>
              </button>
            </div>
            <button
              onClick={() => setUpdateModalOpen(true)}
              disabled={order.status === "cancelled"}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
                order.status === "cancelled"
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg"
              }`}
            >
              <FaEdit size={14} />
              Update Order
            </button>
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaShoppingCart className="text-blue-600" size={18} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
              <p className="text-sm text-gray-500">
                {order.orderNumber || order._id?.slice(-8)}
              </p>
            </div>
            <div className="ml-auto">
              <span
                className={`inline-flex px-3 py-1 text-sm font-medium rounded-full text-white ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status
                  ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
                  : "Unknown"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <FaUser className="text-blue-500" size={16} />
                <h4 className="font-semibold text-gray-800">
                  Customer Details
                </h4>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Name:</span>{" "}
                {displayValue(order.user?.name)}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Email:</span>{" "}
                {displayValue(order.user?.email)}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <FaCreditCard className="text-green-500" size={16} />
                <h4 className="font-semibold text-gray-800">Payment Details</h4>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Subtotal:</span> Rs.{" "}
                {order.totalPrice?.toLocaleString() || 0}
              </p>
              {order.discount > 0 && (
                <p className="text-sm text-green-600 mb-1">
                  <span className="font-medium">Discount:</span> -Rs.{" "}
                  {order.discount?.toLocaleString() || 0}
                </p>
              )}
              <p className="text-sm text-gray-900 mb-1 font-semibold">
                <span className="font-medium">Final Total:</span> Rs.{" "}
                {order.finalPrice?.toLocaleString() || 0}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Method:</span>{" "}
                {displayValue(order.paymentMethod)}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Status:</span>{" "}
                {displayValue(order.paymentStatus)}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <FaCalendarAlt className="text-purple-500" size={16} />
                <h4 className="font-semibold text-gray-800">Order Timeline</h4>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Ordered:</span>{" "}
                {formatDate(order.createdAt)}
              </p>
              {order.paymentDate && (
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Paid:</span>{" "}
                  {formatDate(order.paymentDate)}
                </p>
              )}
              {order.amountPaid !== undefined && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Amount Paid:</span> Rs.{" "}
                  {order.amountPaid}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Promo Code Details */}
        {(order.promoCodeUsed || order.discount > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FaTag className="text-yellow-600" size={18} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Promo Code Applied
                </h3>
                <p className="text-sm text-gray-500">Discount information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FaTag className="text-yellow-600" size={14} />
                  <p className="text-sm text-yellow-600 font-medium">
                    Promo Code
                  </p>
                </div>
                <p className="font-semibold text-gray-900 text-lg">
                  {order.promoCodeUsed || "DISCOUNT APPLIED"}
                </p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FaCheckCircle className="text-green-600" size={14} />
                  <p className="text-sm text-yellow-600 font-medium">
                    Description
                  </p>
                </div>
                <p className="font-semibold text-gray-900">
                  {order.promoDetails?.description || "Discount Applied"}
                </p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {order.promoDetails?.type === "percentage" ? (
                    <FaPercent className="text-yellow-600" size={14} />
                  ) : (
                    <FaDollarSign className="text-yellow-600" size={14} />
                  )}
                  <p className="text-sm text-yellow-600 font-medium">
                    Discount Type
                  </p>
                </div>
                <p className="font-semibold text-gray-900">
                  {order.promoDetails?.type === "percentage"
                    ? `${order.promoDetails?.value}% Off`
                    : order.promoDetails?.type === "fixed"
                    ? `Rs. ${order.promoDetails?.value} Off`
                    : "Fixed Amount"}
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FaCheckCircle className="text-green-600" size={14} />
                  <p className="text-sm text-green-600 font-medium">
                    Discount Applied
                  </p>
                </div>
                <p className="font-semibold text-green-700 text-lg">
                  -Rs. {order.discount?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FaBoxOpen className="text-green-600" size={18} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Order Items</h3>
              <p className="text-sm text-gray-500">
                {order.orderItems?.length || 0} item(s)
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {order.orderItems?.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {displayValue(item.productName)}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {displayValue(item.productDescription)}
                  </p>
                  {item.productBrand && (
                    <p className="text-xs text-gray-500 mt-1">
                      Brand: {item.productBrand}
                    </p>
                  )}
                  {item.productCategory && (
                    <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {item.productCategory}
                    </span>
                  )}
                </div>
                <div className="text-right ml-4">
                  <p className="font-medium text-gray-900">
                    Rs. {item.price?.toLocaleString() || 0}
                  </p>
                  <p className="text-sm text-gray-600">
                    Qty: {item.quantity || 0}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">
                    Total: Rs.{" "}
                    {(
                      (item.price || 0) * (item.quantity || 0)
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            )) || (
              <div className="text-center py-8">
                <p className="text-gray-500">No items found</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Delivery Details */}
        {order.deliveryPersonName && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <FaTruck className="text-orange-600" size={18} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Delivery Details
                </h3>
                <p className="text-sm text-gray-500">Delivery information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-orange-600 font-medium mb-1">
                  Delivery Person
                </p>
                <p className="font-semibold text-gray-900">
                  {displayValue(order.deliveryPersonName)}
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-orange-600 font-medium mb-1">
                  Contact
                </p>
                <p className="font-semibold text-gray-900">
                  {displayValue(order.deliveryPersonContact)}
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-orange-600 font-medium mb-1">
                  Estimated Arrival
                </p>
                <p className="font-semibold text-gray-900">
                  {displayValue(order.estimatedArrivalTime)}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Shipping Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <FaMapMarkerAlt className="text-red-600" size={18} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Shipping Address
              </h3>
              <p className="text-sm text-gray-500">Delivery location</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2">
              <p className="text-gray-800">
                <span className="font-medium">Address:</span>{" "}
                {displayValue(order.shippingAddress?.addressLine1)}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">City:</span>
                  <p className="text-gray-800">
                    {displayValue(order.shippingAddress?.city)}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">State:</span>
                  <p className="text-gray-800">
                    {displayValue(order.shippingAddress?.state)}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    Postal Code:
                  </span>
                  <p className="text-gray-800">
                    {displayValue(order.shippingAddress?.postalCode)}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Country:</span>
                  <p className="text-gray-800">
                    {displayValue(order.shippingAddress?.country)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Customer Signature */}
        {order.customerSignature && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaSignature className="text-purple-600" size={18} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Customer Signature
                </h3>
                <p className="text-sm text-gray-500">Delivery confirmation</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <img
                src={`${API_BASE_URL}${order.customerSignature}`}
                alt="Customer Signature"
                className="max-w-xs max-h-40 object-contain mx-auto rounded-lg border border-gray-200"
              />
            </div>
          </motion.div>
        )}

        {/* Update Order Modal */}
        {updateModalOpen && (
          <UpdateOrderModal
            open={updateModalOpen}
            order={order}
            handleClose={() => setUpdateModalOpen(false)}
            onOrderUpdated={(updatedOrder) => setOrder(updatedOrder)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminOrderDetails;
