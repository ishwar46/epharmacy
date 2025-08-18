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
import PrescriptionVerificationModal from "../components/PrescriptionVerificationModal";
import OrderPackingModal from "../components/OrderPackingModal";
import DispatchOrderModal from "../components/DispatchOrderModal";
import { formatDate } from "../utils/dateUtils";
import { getStatusColor, getStatusLabel } from "../utils/statusUtils";
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
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [packingModalOpen, setPackingModalOpen] = useState(false);
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [error, setError] = useState(null);

  // Set dynamic title for order details
  useDynamicTitle(
    `Order #${orderId} | Order Details | Admin Dashboard | FixPharmacy`
  );

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
            <div className="flex items-center gap-3">
              {(order.hasPrescriptionItems || order.prescriptionStatus === 'pending_verification') && (
                <button
                  onClick={() => setPrescriptionModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                >
                  <FaSignature size={14} />
                  Verify Prescription
                </button>
              )}
              
              {(order.status === 'confirmed' || order.status === 'prescription_verified') && (
                <button
                  onClick={() => setPackingModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                >
                  <FaBoxOpen size={14} />
                  Pack Order
                </button>
              )}

              {order.status === 'packed' && (
                <button
                  onClick={() => setDispatchModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                >
                  <FaTruck size={14} />
                  Dispatch Order
                </button>
              )}
              
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
                {getStatusLabel(order.status)}
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
                {displayValue(order.customer?.user?.name || order.customer?.guestDetails?.name)}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Email:</span>{" "}
                {displayValue(order.customer?.user?.email || order.customer?.guestDetails?.email)}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Phone:</span>{" "}
                {displayValue(order.customer?.user?.phone || order.customer?.guestDetails?.phone)}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Account Type:</span>{" "}
                <span className={`px-2 py-1 text-xs rounded-full ${
                  order.customer?.isGuest ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                }`}>
                  {order.customer?.isGuest ? 'Guest' : 'Registered'}
                </span>
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <FaCreditCard className="text-green-500" size={16} />
                <h4 className="font-semibold text-gray-800">Payment Details</h4>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Subtotal:</span> Rs.{" "}
                {order.pricing?.subtotal?.toLocaleString() || 0}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Delivery Fee:</span> Rs.{" "}
                {order.pricing?.deliveryFee?.toLocaleString() || 0}
              </p>
              {order.pricing?.discount > 0 && (
                <p className="text-sm text-green-600 mb-1">
                  <span className="font-medium">Discount:</span> -Rs.{" "}
                  {order.pricing?.discount?.toLocaleString() || 0}
                </p>
              )}
              {order.pricing?.tax > 0 && (
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Tax:</span> Rs.{" "}
                  {order.pricing?.tax?.toLocaleString() || 0}
                </p>
              )}
              <p className="text-sm text-gray-900 mb-1 font-semibold">
                <span className="font-medium">Total Amount:</span> Rs.{" "}
                {order.pricing?.total?.toLocaleString() || 0}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Method:</span>{" "}
                {displayValue(order.payment?.method?.toUpperCase())}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Status:</span>{" "}
                <span className={`px-2 py-1 text-xs rounded-full ${
                  order.payment?.status === 'paid' ? 'bg-green-100 text-green-800' :
                  order.payment?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.payment?.status === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.payment?.status?.charAt(0).toUpperCase() + order.payment?.status?.slice(1) || 'N/A'}
                </span>
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
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Last Updated:</span>{" "}
                {formatDate(order.updatedAt)}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Estimated Delivery:</span>{" "}
                {order.delivery?.estimatedDeliveryTime ? formatDate(order.delivery.estimatedDeliveryTime) : 'TBD'}
              </p>
              {order.delivery?.actualDeliveryTime && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Delivered:</span>{" "}
                  {formatDate(order.delivery.actualDeliveryTime)}
                </p>
              )}
              {order.payment?.paidAt && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Paid:</span>{" "}
                  {formatDate(order.payment.paidAt)}
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

        {/* Prescription Verification Section */}
        {(order.hasPrescriptionItems || order.prescriptions?.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                order.prescriptionStatus === 'verified' ? 'bg-green-100' :
                order.prescriptionStatus === 'pending_verification' ? 'bg-yellow-100' :
                order.prescriptionStatus === 'rejected' ? 'bg-red-100' :
                'bg-gray-100'
              }`}>
                <FaSignature className={`${
                  order.prescriptionStatus === 'verified' ? 'text-green-600' :
                  order.prescriptionStatus === 'pending_verification' ? 'text-yellow-600' :
                  order.prescriptionStatus === 'rejected' ? 'text-red-600' :
                  'text-gray-600'
                } text-lg`} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Prescription Verification</h3>
                <p className="text-sm text-gray-500">
                  Status: <span className={`font-medium ${
                    order.prescriptionStatus === 'verified' ? 'text-green-600' :
                    order.prescriptionStatus === 'pending_verification' ? 'text-yellow-600' :
                    order.prescriptionStatus === 'rejected' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {order.prescriptionStatus?.replace('_', ' ').toUpperCase()}
                  </span>
                </p>
              </div>
            </div>

            {order.prescriptions?.length > 0 ? (
              <div className="space-y-4">
                {order.prescriptions.map((prescription, index) => (
                  <div key={prescription._id || index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Doctor:</span> {prescription.doctorName}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Hospital:</span> {prescription.hospitalName || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Date:</span> {formatDate(prescription.prescriptionDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Verified:</span>
                          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                            prescription.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {prescription.verified ? 'Yes' : 'Pending'}
                          </span>
                        </p>
                        {prescription.verifiedBy && (
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Verified By:</span> {prescription.verifiedBy}
                          </p>
                        )}
                        {prescription.verifiedAt && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Verified At:</span> {formatDate(prescription.verifiedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Prescription Image */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">Prescription Document:</p>
                      <div className="flex items-center justify-center">
                        <img
                          src={`${API_BASE_URL}${prescription.imageUrl}`}
                          alt={`Prescription ${index + 1}`}
                          className="max-w-full max-h-96 object-contain rounded-lg border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
                          onClick={() => window.open(`${API_BASE_URL}${prescription.imageUrl}`, '_blank')}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Click image to view full size
                      </p>
                    </div>

                    {prescription.verificationNotes && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <span className="font-medium">Verification Notes:</span> {prescription.verificationNotes}
                        </p>
                      </div>
                    )}

                    {prescription.rejectionReason && (
                      <div className="mt-4 p-3 bg-red-50 rounded-lg">
                        <p className="text-sm text-red-800">
                          <span className="font-medium">Rejection Reason:</span> {prescription.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No prescriptions uploaded</p>
              </div>
            )}
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
                {order.items?.length || 0} item(s)
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {order.items?.map((item, index) => (
              <div
                key={item._id || index}
                className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1">
                  {item.productSnapshot?.image && (
                    <img
                      src={`${API_BASE_URL}${item.productSnapshot.image}`}
                      alt={item.productSnapshot.name}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {displayValue(item.productSnapshot?.name || item.product?.name)}
                    </h4>
                    <div className="flex items-center gap-4 mt-1">
                      {item.productSnapshot?.brand && (
                        <p className="text-xs text-gray-500">
                          Brand: {item.productSnapshot.brand}
                        </p>
                      )}
                      {item.productSnapshot?.category && (
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {item.productSnapshot.category}
                        </span>
                      )}
                      {item.prescriptionRequired && (
                        <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          Prescription Required
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-gray-600">
                        Medicine Type: <span className="font-medium">{item.productSnapshot?.medicineType || 'N/A'}</span>
                      </span>
                      <span className="text-gray-600">
                        Product Type: <span className="font-medium">{item.productSnapshot?.productType || 'N/A'}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="font-medium text-gray-900">
                    Rs. {item.pricePerItem?.toLocaleString() || 0}
                  </p>
                  <p className="text-sm text-gray-600">
                    Qty: {item.quantity || 0} ({item.purchaseType})
                  </p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">
                    Total: Rs. {item.totalPrice?.toLocaleString() || 0}
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

        {/* Packing Details */}
        {order.packingDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FaBoxOpen className="text-green-600" size={18} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Packing Details</h3>
                <p className="text-sm text-gray-500">Order packing information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Packing Info</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Packed At:</span> {formatDate(order.packingDetails.packedAt)}</p>
                  {order.packingDetails.packageWeight && (
                    <p><span className="font-medium">Weight:</span> {order.packingDetails.packageWeight}g</p>
                  )}
                  {order.packingDetails.packageDimensions && (
                    <p><span className="font-medium">Dimensions:</span> {order.packingDetails.packageDimensions.length}×{order.packingDetails.packageDimensions.width}×{order.packingDetails.packageDimensions.height} cm</p>
                  )}
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Special Handling</h4>
                <div className="space-y-2">
                  {order.packingDetails.fragileItems && (
                    <span className="inline-block px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                      Fragile Items
                    </span>
                  )}
                  {order.packingDetails.coldStorage && (
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full ml-1">
                      Cold Storage
                    </span>
                  )}
                  {!order.packingDetails.fragileItems && !order.packingDetails.coldStorage && (
                    <span className="text-sm text-gray-500">No special handling required</span>
                  )}
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Items Packed</h4>
                <div className="text-sm text-gray-700">
                  {order.packingDetails.packedItems ? (
                    <span>{order.packingDetails.packedItems.length} items verified and packed</span>
                  ) : (
                    <span>All order items packed</span>
                  )}
                </div>
              </div>
            </div>

            {order.packingDetails.packingNotes && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <span className="font-medium">Packing Notes:</span> {order.packingDetails.packingNotes}
                </p>
              </div>
            )}

            {order.packingDetails.specialInstructions && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Special Instructions:</span> {order.packingDetails.specialInstructions}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Dispatch Details */}
        {order.dispatchDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaTruck className="text-blue-600" size={18} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Dispatch Details</h3>
                <p className="text-sm text-gray-500">Order dispatch information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium mb-1">Delivery Person</p>
                <p className="font-semibold text-gray-900">{order.dispatchDetails.deliveryPersonName}</p>
                <p className="text-sm text-gray-600">{order.dispatchDetails.deliveryPersonPhone}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium mb-1">Vehicle</p>
                <p className="font-semibold text-gray-900">{order.dispatchDetails.vehicleNumber || 'N/A'}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium mb-1">Tracking Number</p>
                <p className="font-mono font-semibold text-gray-900">{order.dispatchDetails.trackingNumber}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium mb-1">Priority</p>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  order.dispatchDetails.priorityDelivery 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {order.dispatchDetails.priorityDelivery ? 'High Priority' : 'Standard'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Timeline</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Dispatched At:</span> {formatDate(order.dispatchDetails.dispatchedAt)}</p>
                  {order.dispatchDetails.estimatedDeliveryTime && (
                    <p><span className="font-medium">Est. Delivery:</span> {formatDate(order.dispatchDetails.estimatedDeliveryTime)}</p>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Route Info</h4>
                <p className="text-sm text-gray-700">
                  {order.dispatchDetails.routeInstructions || 'No specific route instructions'}
                </p>
              </div>
            </div>

            {order.dispatchDetails.dispatchNotes && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Dispatch Notes:</span> {order.dispatchDetails.dispatchNotes}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Legacy Delivery Details */}
        {order.deliveryPersonName && !order.dispatchDetails && (
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
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-600">Recipient:</span>
                  <p className="text-gray-800">
                    {displayValue(order.deliveryAddress?.name)}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Phone:</span>
                  <p className="text-gray-800">
                    {displayValue(order.deliveryAddress?.phone)}
                  </p>
                </div>
              </div>
              
              <div>
                <span className="font-medium text-gray-600">Street Address:</span>
                <p className="text-gray-800">
                  {displayValue(order.deliveryAddress?.street)}
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Area:</span>
                  <p className="text-gray-800">
                    {displayValue(order.deliveryAddress?.area)}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">City:</span>
                  <p className="text-gray-800">
                    {displayValue(order.deliveryAddress?.city)}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Landmark:</span>
                  <p className="text-gray-800">
                    {displayValue(order.deliveryAddress?.landmark)}
                  </p>
                </div>
              </div>
              
              {order.deliveryAddress?.deliveryInstructions && (
                <div>
                  <span className="font-medium text-gray-600">Delivery Instructions:</span>
                  <p className="text-gray-800 bg-blue-50 p-2 rounded text-sm mt-1">
                    {order.deliveryAddress.deliveryInstructions}
                  </p>
                </div>
              )}

              {order.notes?.customerNotes && (
                <div>
                  <span className="font-medium text-gray-600">Customer Notes:</span>
                  <p className="text-gray-800 bg-yellow-50 p-2 rounded text-sm mt-1">
                    {order.notes.customerNotes}
                  </p>
                </div>
              )}
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

        {/* Prescription Verification Modal */}
        {prescriptionModalOpen && (
          <PrescriptionVerificationModal
            open={prescriptionModalOpen}
            order={order}
            handleClose={() => setPrescriptionModalOpen(false)}
            onOrderUpdated={(updatedOrder) => setOrder(updatedOrder)}
          />
        )}

        {/* Order Packing Modal */}
        {packingModalOpen && (
          <OrderPackingModal
            open={packingModalOpen}
            order={order}
            handleClose={() => setPackingModalOpen(false)}
            onOrderUpdated={(updatedOrder) => setOrder(updatedOrder)}
          />
        )}

        {/* Dispatch Order Modal */}
        {dispatchModalOpen && (
          <DispatchOrderModal
            open={dispatchModalOpen}
            order={order}
            handleClose={() => setDispatchModalOpen(false)}
            onOrderUpdated={(updatedOrder) => setOrder(updatedOrder)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminOrderDetails;
