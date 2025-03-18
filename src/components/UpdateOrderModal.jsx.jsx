import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { updateOrder } from "../services/orderService";
import toast from "react-hot-toast";
import { toNepalDateString } from "../utils/dateUtils";

const UpdateOrderModal = ({ open, order, handleClose, onOrderUpdated }) => {
  const [formData, setFormData] = useState({
    status: order ? order.status : "",
    paymentStatus: order ? order.paymentStatus : "",
    amountPaid: order ? order.finalPrice : 0,
    paymentDate: order?.paymentDate
      ? toNepalDateString(order.paymentDate)
      : toNepalDateString(new Date()),
    deliveryPersonName: order?.deliveryPersonName || "",
    deliveryPersonContact: order?.deliveryPersonContact || "",
    estimatedArrivalTime: order?.estimatedArrivalTime || "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (order) {
      setFormData({
        status: order.status,
        paymentStatus: order.paymentStatus,
        amountPaid: order.finalPrice,
        paymentDate: order.paymentDate
          ? toNepalDateString(order.paymentDate)
          : toNepalDateString(new Date()),
        deliveryPersonName: order.deliveryPersonName || "",
        deliveryPersonContact: order.deliveryPersonContact || "",
        estimatedArrivalTime: order.estimatedArrivalTime || "",
      });
    }
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await updateOrder(order._id, formData);
      toast.success(response.message || "Order updated successfully!");
      onOrderUpdated(response.data);
      handleClose();
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-lg p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl border border-gray-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-xl">
          <h3 className="text-lg font-semibold text-white">Update Order</h3>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Read-Only Order Details */}
        <div className="px-6 py-4 border-b border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm">Order Number:</label>
            <input
              type="text"
              value={order.orderNumber}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm">
              Customer Name:
            </label>
            <input
              type="text"
              value={order.user.name}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm">Total Price:</label>
            <input
              type="number"
              value={order.finalPrice}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Update Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Order Status */}
            <div>
              <label className="block text-gray-700 mb-1">Order Status:</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="out for delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Payment Status */}
            <div>
              <label className="block text-gray-700 mb-1">
                Payment Status:
              </label>
              <select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            {/* ✅ Customer Signature Upload */}
            {formData.status === "delivered" && (
              <div>
                <label className="block text-gray-700 mb-1">
                  Customer Signature:
                </label>
                <input
                  type="file"
                  name="customerSignature"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customerSignature: e.target.files[0],
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                />
              </div>
            )}

            {/* Amount Paid */}
            <div>
              <label className="block text-gray-700 mb-1">Amount Paid:</label>
              <input
                type="number"
                name="amountPaid"
                value={formData.amountPaid}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
              />
            </div>

            {/* Payment Date */}
            <div>
              <label className="block text-gray-700 mb-1">Payment Date:</label>
              <input
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
              />
            </div>

            {/* Delivery Person Name */}
            <div>
              <label className="block text-gray-700 mb-1">
                Delivery Person Name:
              </label>
              <input
                type="text"
                name="deliveryPersonName"
                value={formData.deliveryPersonName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
              />
            </div>

            {/* Delivery Person Contact */}
            <div>
              <label className="block text-gray-700 mb-1">
                Delivery Person Contact:
              </label>
              <input
                type="text"
                name="deliveryPersonContact"
                value={formData.deliveryPersonContact}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
              />
            </div>

            {/* Estimated Arrival Time */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-1">
                Estimated Arrival Time:
              </label>
              <input
                type="text"
                name="estimatedArrivalTime"
                value={formData.estimatedArrivalTime}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg text-white font-medium bg-green-500 hover:bg-green-600 transition"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Order"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default UpdateOrderModal;
