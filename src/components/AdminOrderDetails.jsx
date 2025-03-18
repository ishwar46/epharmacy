import React, { useEffect, useState, useCallback } from "react";
import {
  FaArrowLeft,
  FaBoxOpen,
  FaMapMarkerAlt,
  FaSyncAlt,
  FaTruck,
} from "react-icons/fa";
import { getOrder } from "../services/orderService";
import UpdateOrderModal from "../components/UpdateOrderModal.jsx";
import { formatDate } from "../utils/dateUtils";
import { getStatusColor } from "../utils/statusUtils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen bg-gray-100">
    <svg
      className="animate-spin text-indigo-500 h-8 w-8"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-label="Loading"
    >
      <circle
        className="opacity-25 stroke-current"
        cx="12"
        cy="12"
        r="10"
        strokeWidth="4"
      />
      <path
        className="opacity-75 fill-current"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  </div>
);

const ErrorMessage = ({ message, onRetry, actionLabel }) => (
  <div className="flex flex-col items-center justify-center p-6 bg-white rounded shadow">
    <p className="text-lg font-semibold text-gray-700">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-4 text-blue-600 hover:text-blue-800 inline-flex items-center gap-2"
        aria-label={actionLabel || "Retry"}
      >
        <FaArrowLeft />
        {actionLabel || "Retry"}
      </button>
    )}
  </div>
);

const AdminOrderDetails = ({ orderId, goBack }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [error, setError] = useState(null);

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
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={goBack}
            className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-2"
            aria-label="Back to Orders"
          >
            <FaArrowLeft />
            <span className="text-sm font-medium">Back to Orders</span>
          </button>
          <button
            onClick={fetchOrder}
            className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-2"
            aria-label="Refresh Order"
          >
            <FaSyncAlt />
            <span className="text-sm font-medium">Refresh</span>
          </button>
        </div>
        <button
          onClick={() => setUpdateModalOpen(true)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-md transition ${
            order.status === "cancelled"
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer"
          }`}
          disabled={order.status === "cancelled"}
          aria-label="Update Order"
        >
          Update Order
        </button>
      </div>

      {/* Order Summary */}
      <div className="border border-gray-200 rounded-md p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Order Number: {order.orderNumber}
          </h2>
          <span
            className={`px-3 py-1 text-xs text-white font-semibold rounded-full ${getStatusColor(
              order.status
            )}`}
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <strong>Customer:</strong> {order?.user?.name} ({order?.user?.email}
            )
          </p>
          <p>
            <strong>Total Price:</strong> Rs. {order.finalPrice}
          </p>
          <p>
            <strong>Order Date:</strong> {formatDate(order.createdAt)}
          </p>
          {order.amountPaid !== undefined && (
            <p>
              <strong>Amount Paid:</strong> Rs. {order.amountPaid}
            </p>
          )}
          {order.paymentDate && (
            <p>
              <strong>Payment Date:</strong> {formatDate(order.paymentDate)}
            </p>
          )}
          <p>
            <strong>Payment:</strong> {order.paymentMethod} (
            {order.paymentStatus})
          </p>
        </div>
      </div>

      {/* Order Items */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-2">
          <FaBoxOpen className="text-indigo-500" />
          Order Items
        </h3>
        <div className="border border-gray-200 rounded-md p-4 space-y-3">
          {order.orderItems.map((item, index) => (
            <div
              key={index}
              className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition"
            >
              <p className="text-sm font-medium text-gray-800">
                {item.productName} - {item.productDescription}
              </p>
              <p className="text-xs text-gray-500">
                Quantity: {item.quantity} | Price: Rs. {item.price}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Delivery Details */}
      {order.deliveryPersonName && (
        <div className="border border-gray-200 rounded-md p-4 space-y-3 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FaTruck className="text-orange-500" />
            Delivery Details
          </h3>
          <p>
            <strong>Delivery Person:</strong> {order.deliveryPersonName}
          </p>
          <p>
            <strong>Contact:</strong> {order.deliveryPersonContact}
          </p>
          <p>
            <strong>Estimated Arrival Time:</strong>{" "}
            {order.estimatedArrivalTime}
          </p>
        </div>
      )}

      {/* Show Customer Signature if available */}
      {order.customerSignature && (
        <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">
            Customer Signature
          </h3>
          <img
            src={`${API_BASE_URL}${order.customerSignature}`}
            alt="Customer Signature"
            className="max-w-xs max-h-40 object-contain mt-2 rounded-md"
          />
        </div>
      )}
      {/* Shipping Details */}
      <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FaMapMarkerAlt className="text-green-500" />
          Shipping Address
        </h3>
        <p>
          <strong>Address:</strong> {order.shippingAddress?.addressLine1},{" "}
          {order.shippingAddress?.city}, {order.shippingAddress?.state} -{" "}
          {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
        </p>
      </div>

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
  );
};

export default AdminOrderDetails;
