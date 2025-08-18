import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  IoClose,
  IoCheckmarkCircle,
  IoDocumentTextOutline,
  IoCashOutline,
  IoCalendarOutline,
  IoPersonOutline,
  IoCallOutline,
  IoTimeOutline,
} from "react-icons/io5";
import { FaEdit, FaFileSignature } from "react-icons/fa";
import { updateOrder } from "../services/orderService";
import toast from "react-hot-toast";

const UpdateOrderModal = ({ open, order, handleClose, onOrderUpdated }) => {
  const [formData, setFormData] = useState({
    status: order ? order.status : "",
    paymentStatus: order ? order.payment?.status : "",
    amountPaid: order ? order.pricing?.total : 0,
    paymentDate: order?.payment?.paidAt
      ? new Date(order.payment.paidAt).toISOString().slice(0, 10)
      : "",
    deliveryPersonName:
      order?.dispatchDetails?.deliveryPersonName ||
      order?.delivery?.assignedTo?.name ||
      "",
    deliveryPersonContact:
      order?.dispatchDetails?.deliveryPersonPhone ||
      order?.delivery?.assignedTo?.phone ||
      "",
    estimatedDeliveryTime:
      order?.dispatchDetails?.estimatedDeliveryTime ||
      order?.delivery?.estimatedDeliveryTime ||
      "",
    notes: "",
    customerSignature: null,
  });

  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState("status");

  useEffect(() => {
    if (order) {
      setFormData({
        status: order.status,
        paymentStatus: order.payment?.status || "pending",
        amountPaid: order.pricing?.total || 0,
        paymentDate: order.payment?.paidAt
          ? new Date(order.payment.paidAt).toISOString().slice(0, 10)
          : "",
        deliveryPersonName:
          order.dispatchDetails?.deliveryPersonName ||
          order.delivery?.assignedTo?.name ||
          "",
        deliveryPersonContact:
          order.dispatchDetails?.deliveryPersonPhone ||
          order.delivery?.assignedTo?.phone ||
          "",
        estimatedDeliveryTime:
          order.dispatchDetails?.estimatedDeliveryTime ||
          order.delivery?.estimatedDeliveryTime ||
          "",
        notes: "",
        customerSignature: null,
      });
    }
  }, [order]);

  if (!open || !order) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      customerSignature: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("=== UPDATE ORDER MODAL SUBMIT ===");
    console.log("Form data:", formData);
    console.log("Original order:", order);

    setLoading(true);
    try {
      // Prepare update data - only send changed/important fields
      const updateData = {};

      // Only add status if it has changed
      if (formData.status !== order.status) {
        console.log("Status has changed, adding to update");
        updateData.status = formData.status;
        updateData.notes =
          formData.notes || `Order status updated to ${formData.status}`;
      } else if (formData.notes && formData.notes.trim()) {
        console.log("Status same, but notes provided");
        updateData.notes = formData.notes;
      }

      // Add payment data if changed
      if (
        formData.paymentStatus !== (order.payment?.status || "pending") ||
        formData.paymentDate
      ) {
        updateData.payment = {
          status: formData.paymentStatus,
          paidAt: formData.paymentDate
            ? new Date(formData.paymentDate).toISOString()
            : null,
        };
      }

      // Add delivery data if provided
      if (
        formData.deliveryPersonName ||
        formData.deliveryPersonContact ||
        formData.estimatedDeliveryTime
      ) {
        updateData.delivery = {
          assignedTo: {
            name: formData.deliveryPersonName,
            phone: formData.deliveryPersonContact,
          },
          estimatedDeliveryTime: formData.estimatedDeliveryTime
            ? new Date(formData.estimatedDeliveryTime).toISOString()
            : null,
        };
      }

      console.log("Sending update data:", updateData);

      // Check if there's anything to update
      if (Object.keys(updateData).length === 0 && !formData.customerSignature) {
        toast.info("No changes detected");
        handleClose();
        return;
      }

      // Handle file upload for customer signature
      let response;
      if (formData.customerSignature) {
        const formDataWithFile = new FormData();
        formDataWithFile.append(
          "customerSignature",
          formData.customerSignature
        );

        // Add other update data
        Object.keys(updateData).forEach((key) => {
          if (typeof updateData[key] === "object") {
            formDataWithFile.append(key, JSON.stringify(updateData[key]));
          } else {
            formDataWithFile.append(key, updateData[key]);
          }
        });

        response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/orders/${order._id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: formDataWithFile,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update order");
        }

        response = await response.json();
      } else {
        response = await updateOrder(order._id, updateData);
      }

      toast.success(response.message || "Order updated successfully!");
      onOrderUpdated(response.data);
      handleClose();
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update order"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      prescription_verified: "bg-green-100 text-green-800",
      packed: "bg-indigo-100 text-indigo-800",
      out_for_delivery: "bg-orange-100 text-orange-800",
      delivered: "bg-emerald-100 text-emerald-800",
      cancelled: "bg-red-100 text-red-800",
      returned: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const tabs = [
    { id: "status", label: "Status & Notes", icon: IoCheckmarkCircle },
    { id: "payment", label: "Payment", icon: IoCashOutline },
    { id: "delivery", label: "Delivery", icon: IoPersonOutline },
  ];

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
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
          <div className="flex items-center gap-3">
            <FaEdit className="text-xl" />
            <div>
              <h3 className="text-lg font-semibold">Update Order</h3>
              <p className="text-purple-100 text-sm">
                Order #{order.orderNumber}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-purple-200 focus:outline-none"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row h-full max-h-[calc(90vh-80px)]">
          {/* Left Panel - Order Summary */}
          <div className="lg:w-1/3 border-r border-gray-200 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Current Status */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Current Status
                </h4>
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                </div>
              </div>

              {/* Order Details */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Order Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-medium">
                      {order.customer?.user?.name ||
                        order.customer?.guestDetails?.name ||
                        "Guest"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items:</span>
                    <span className="font-medium">
                      {order.items?.length} items
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-medium text-green-600">
                      Rs. {order.pricing?.total}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        order.payment?.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.payment?.method?.toUpperCase()} -{" "}
                      {(order.payment?.status || "pending").toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Delivery Address
                </h4>
                <div className="text-sm text-gray-600 space-y-1 bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-900">
                    {order.deliveryAddress?.name}
                  </p>
                  <p>{order.deliveryAddress?.street}</p>
                  <p>
                    {order.deliveryAddress?.area}, {order.deliveryAddress?.city}
                  </p>
                  <p>Phone: {order.deliveryAddress?.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Update Form */}
          <div className="lg:w-2/3 flex flex-col">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 px-6">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      currentTab === tab.id
                        ? "border-purple-500 text-purple-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 p-6 overflow-y-auto"
            >
              {currentTab === "status" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <IoCheckmarkCircle className="inline mr-2" />
                      Order Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="prescription_verified">
                        Prescription Verified
                      </option>
                      <option value="confirmed">Confirmed</option>
                      <option value="packed">Packed</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="returned">Returned</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <IoDocumentTextOutline className="inline mr-2" />
                      Admin Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Add notes about the order update..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  </div>

                  {/* Customer Signature Upload - Only for delivered status */}
                  {formData.status === "delivered" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaFileSignature className="inline mr-2" />
                        Customer Signature
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Upload customer signature image (optional)
                      </p>
                    </div>
                  )}
                </div>
              )}

              {currentTab === "payment" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <IoCashOutline className="inline mr-2" />
                        Payment Status
                      </label>
                      <select
                        name="paymentStatus"
                        value={formData.paymentStatus}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <IoCalendarOutline className="inline mr-2" />
                        Payment Date
                      </label>
                      <input
                        type="date"
                        name="paymentDate"
                        value={formData.paymentDate}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount Paid
                    </label>
                    <input
                      type="number"
                      name="amountPaid"
                      value={formData.amountPaid}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      readOnly
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Amount is read-only based on order total
                    </p>
                  </div>
                </div>
              )}

              {currentTab === "delivery" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <IoPersonOutline className="inline mr-2" />
                        Delivery Person Name
                      </label>
                      <input
                        type="text"
                        name="deliveryPersonName"
                        value={formData.deliveryPersonName}
                        onChange={handleChange}
                        placeholder="Enter delivery person name"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <IoCallOutline className="inline mr-2" />
                        Delivery Person Contact
                      </label>
                      <input
                        type="tel"
                        name="deliveryPersonContact"
                        value={formData.deliveryPersonContact}
                        onChange={handleChange}
                        placeholder="Enter contact number"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <IoTimeOutline className="inline mr-2" />
                      Estimated Delivery Time
                    </label>
                    <input
                      type="datetime-local"
                      name="estimatedDeliveryTime"
                      value={
                        formData.estimatedDeliveryTime
                          ? new Date(formData.estimatedDeliveryTime)
                              .toISOString()
                              .slice(0, 16)
                          : ""
                      }
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="sticky bottom-0 bg-white pt-6 border-t border-gray-200 mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-purple-500 hover:bg-purple-600"
                  } text-white`}
                >
                  {loading ? "Updating..." : "Update Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UpdateOrderModal;
