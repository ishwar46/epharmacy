import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  IoClose,
  IoCheckmarkCircle,
  IoCheckmark,
  IoWarning,
  IoBarcode,
  IoCheckbox,
  IoSquareOutline,
} from "react-icons/io5";
import { FaBoxOpen, FaWeight, FaTruck } from "react-icons/fa";
import { formatDate } from "../utils/dateUtils";
import { updateOrder } from "../services/orderService";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const OrderPackingModal = ({ open, order, handleClose, onOrderUpdated }) => {
  const [packingData, setPackingData] = useState({
    packedItems: [],
    packingNotes: "",
    packageWeight: "",
    packageDimensions: {
      length: "",
      width: "",
      height: "",
    },
    specialInstructions: "",
    fragileItems: false,
    coldStorage: false,
  });

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState("items"); // 'items', 'packaging', 'confirm'

  useEffect(() => {
    if (order && order.items) {
      // Initialize packed items checklist
      const packedItems = order.items.map((item) => ({
        itemId: item._id,
        productName: item.productSnapshot?.name || "Unknown Item",
        quantity: item.quantity,
        packedQuantity: 0,
        checked: false,
        batchNumber: "",
        expiryDate: "",
        notes: "",
      }));

      setPackingData((prev) => ({
        ...prev,
        packedItems,
      }));
    }
  }, [order]);

  if (!open || !order) return null;

  const handleItemCheck = (itemId, checked) => {
    setPackingData((prev) => ({
      ...prev,
      packedItems: prev.packedItems.map((item) =>
        item.itemId === itemId
          ? { ...item, checked, packedQuantity: checked ? item.quantity : 0 }
          : item
      ),
    }));
  };

  const handleItemUpdate = (itemId, field, value) => {
    setPackingData((prev) => ({
      ...prev,
      packedItems: prev.packedItems.map((item) =>
        item.itemId === itemId ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handlePackingComplete = async () => {
    const unpackedItems = packingData.packedItems.filter(
      (item) => !item.checked
    );

    if (unpackedItems.length > 0) {
      toast.error("Please check all items before completing packing");
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        status: "packed",
        packingDetails: {
          packedAt: new Date().toISOString(),
          packedItems: packingData.packedItems,
          packingNotes: packingData.packingNotes,
          packageWeight: packingData.packageWeight,
          packageDimensions: packingData.packageDimensions,
          specialInstructions: packingData.specialInstructions,
          fragileItems: packingData.fragileItems,
          coldStorage: packingData.coldStorage,
        },
      };

      const response = await updateOrder(order._id, updateData);
      toast.success("Order packed successfully!");

      if (onOrderUpdated) {
        onOrderUpdated(response.data);
      }

      handleClose();
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to complete packing");
    } finally {
      setLoading(false);
    }
  };

  const allItemsChecked = packingData.packedItems.every((item) => item.checked);
  const totalItems = packingData.packedItems.length;
  const checkedItems = packingData.packedItems.filter(
    (item) => item.checked
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-xl shadow-xl border border-gray-300 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          <div className="flex items-center gap-3">
            <FaBoxOpen className="text-xl" />
            <div>
              <h3 className="text-lg font-semibold">Order Packing</h3>
              <p className="text-green-100 text-sm">
                Order #{order.orderNumber}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-green-100">Progress</p>
              <p className="font-semibold">
                {checkedItems}/{totalItems} items
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-green-200 focus:outline-none"
            >
              <IoClose size={24} />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row h-full max-h-[calc(90vh-80px)]">
          {/* Left Panel - Order Information */}
          <div className="lg:w-1/3 border-r border-gray-200 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Order Details */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <IoCheckmark className="text-green-500" />
                  Order Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-medium">
                      {order.customer?.user?.name || "Guest"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items:</span>
                    <span className="font-medium">{totalItems} items</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-medium">
                      Rs. {order.pricing?.total}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Delivery Address
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
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

              {/* Package Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Package Details
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      <FaWeight className="inline mr-1" /> Weight (grams)
                    </label>
                    <input
                      type="number"
                      value={packingData.packageWeight}
                      onChange={(e) =>
                        setPackingData((prev) => ({
                          ...prev,
                          packageWeight: e.target.value,
                        }))
                      }
                      placeholder="e.g. 250"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Dimensions (cm)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        value={packingData.packageDimensions.length}
                        onChange={(e) =>
                          setPackingData((prev) => ({
                            ...prev,
                            packageDimensions: {
                              ...prev.packageDimensions,
                              length: e.target.value,
                            },
                          }))
                        }
                        placeholder="L"
                        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      />
                      <input
                        type="number"
                        value={packingData.packageDimensions.width}
                        onChange={(e) =>
                          setPackingData((prev) => ({
                            ...prev,
                            packageDimensions: {
                              ...prev.packageDimensions,
                              width: e.target.value,
                            },
                          }))
                        }
                        placeholder="W"
                        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      />
                      <input
                        type="number"
                        value={packingData.packageDimensions.height}
                        onChange={(e) =>
                          setPackingData((prev) => ({
                            ...prev,
                            packageDimensions: {
                              ...prev.packageDimensions,
                              height: e.target.value,
                            },
                          }))
                        }
                        placeholder="H"
                        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={packingData.fragileItems}
                        onChange={(e) =>
                          setPackingData((prev) => ({
                            ...prev,
                            fragileItems: e.target.checked,
                          }))
                        }
                        className="rounded"
                      />
                      <span className="text-gray-700">
                        Contains fragile items
                      </span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={packingData.coldStorage}
                        onChange={(e) =>
                          setPackingData((prev) => ({
                            ...prev,
                            coldStorage: e.target.checked,
                          }))
                        }
                        className="rounded"
                      />
                      <span className="text-gray-700">
                        Requires cold storage
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Packing Notes
                    </label>
                    <textarea
                      value={packingData.packingNotes}
                      onChange={(e) =>
                        setPackingData((prev) => ({
                          ...prev,
                          packingNotes: e.target.value,
                        }))
                      }
                      placeholder="Special packing instructions..."
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Items Checklist */}
          <div className="lg:w-2/3 p-6 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">Items to Pack</h4>
                <div className="flex items-center gap-2 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      allItemsChecked
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {checkedItems}/{totalItems} completed
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {packingData.packedItems.map((item, index) => (
                  <div
                    key={item.itemId}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() =>
                          handleItemCheck(item.itemId, !item.checked)
                        }
                        className={`mt-1 p-1 rounded ${
                          item.checked ? "text-green-600" : "text-gray-400"
                        }`}
                      >
                        {item.checked ? (
                          <IoCheckbox size={24} />
                        ) : (
                          <IoSquareOutline size={24} />
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h5
                              className={`font-medium ${
                                item.checked
                                  ? "text-green-700 line-through"
                                  : "text-gray-900"
                              }`}
                            >
                              {item.productName}
                            </h5>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                        </div>

                        {item.checked && (
                          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                <IoBarcode className="inline mr-1" /> Batch
                                Number
                              </label>
                              <input
                                type="text"
                                value={item.batchNumber}
                                onChange={(e) =>
                                  handleItemUpdate(
                                    item.itemId,
                                    "batchNumber",
                                    e.target.value
                                  )
                                }
                                placeholder="e.g. BT001234"
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Expiry Date
                              </label>
                              <input
                                type="date"
                                value={item.expiryDate}
                                onChange={(e) =>
                                  handleItemUpdate(
                                    item.itemId,
                                    "expiryDate",
                                    e.target.value
                                  )
                                }
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Complete Packing Button */}
              <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200">
                <button
                  onClick={handlePackingComplete}
                  disabled={!allItemsChecked || loading}
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    allItemsChecked && !loading
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {loading ? "Completing..." : "Complete Packing"}
                </button>
                {!allItemsChecked && (
                  <p className="text-center text-sm text-gray-500 mt-2">
                    Please check all items to complete packing
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

export default OrderPackingModal;
