import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  IoClose,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoDownload,
  IoEye,
  IoWarning,
} from "react-icons/io5";
import { FaPrescriptionBottleAlt, FaUserMd } from "react-icons/fa";
import { formatDate } from "../utils/dateUtils";
import { updateOrder } from "../services/orderService";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PrescriptionVerificationModal = ({
  open,
  order,
  handleClose,
  onOrderUpdated,
}) => {
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [verificationAction, setVerificationAction] = useState(null); // 'approve' or 'reject'
  const [verificationNotes, setVerificationNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  if (!open || !order) return null;

  const handleVerification = async (action, prescription) => {
    if (action === "reject" && !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    setLoading(true);
    try {
      // Update the prescription verification status
      const updateData = {
        prescriptionVerification: {
          action: action,
          prescriptionId: prescription._id,
          notes: verificationNotes,
          rejectionReason: action === "reject" ? rejectionReason : undefined,
        },
      };

      // Also update order status based on verification
      if (action === "approve") {
        updateData.status = "prescription_verified";
      }

      const response = await updateOrder(order._id, updateData);
      toast.success(
        `Prescription ${
          action === "approve" ? "approved" : "rejected"
        } successfully!`
      );

      if (onOrderUpdated) {
        onOrderUpdated(response.data);
      }

      handleClose();
    } catch (error) {
      console.error("Error updating prescription:", error);
      toast.error("Failed to update prescription status");
    } finally {
      setLoading(false);
    }
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  const downloadPrescription = (imageUrl, fileName) => {
    const link = document.createElement("a");
    link.href = `${API_BASE_URL}${imageUrl}`;
    link.download = fileName || "prescription.jpg";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const prescriptions = order.prescriptions || [];

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-xl shadow-xl border border-gray-300 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
            <div className="flex items-center gap-3">
              <FaPrescriptionBottleAlt className="text-xl" />
              <div>
                <h3 className="text-lg font-semibold">
                  Prescription Verification
                </h3>
                <p className="text-blue-100 text-sm">
                  Order #{order.orderNumber}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-blue-200 focus:outline-none"
            >
              <IoClose size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col lg:flex-row h-full max-h-[calc(90vh-80px)]">
            {/* Left Panel - Order Info */}
            <div className="lg:w-1/3 border-r border-gray-200 p-6 overflow-y-auto">
              <div className="space-y-6">
                {/* Order Details */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FaUserMd className="text-blue-500" />
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
                      <span className="text-gray-600">Date:</span>
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          order.prescriptionStatus === "pending_verification"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.prescriptionStatus === "verified"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.prescriptionStatus
                          ?.replace("_", " ")
                          .toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Prescription Items */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Prescription Items
                  </h4>
                  <div className="space-y-2">
                    {order.items
                      ?.filter((item) => item.prescriptionRequired)
                      .map((item, index) => (
                        <div
                          key={index}
                          className="p-3 bg-red-50 rounded-lg border border-red-200"
                        >
                          <p className="font-medium text-gray-900">
                            {item.productSnapshot?.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity}
                          </p>
                          <span className="inline-block mt-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                            Prescription Required
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Verification Actions */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Verification Notes
                  </h4>
                  <textarea
                    value={verificationNotes}
                    onChange={(e) => setVerificationNotes(e.target.value)}
                    placeholder="Add verification notes..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Right Panel - Prescriptions */}
            <div className="lg:w-2/3 p-6 overflow-y-auto">
              <div className="space-y-6">
                {prescriptions.length > 0 ? (
                  prescriptions.map((prescription, index) => (
                    <div
                      key={prescription._id || index}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      {/* Prescription Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h5 className="font-semibold text-gray-900">
                            Prescription {index + 1}
                          </h5>
                          <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                            <div>
                              <span className="text-gray-600">Doctor:</span>
                              <p className="font-medium">
                                {prescription.doctorName}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600">Hospital:</span>
                              <p className="font-medium">
                                {prescription.hospitalName || "N/A"}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600">Date:</span>
                              <p>{formatDate(prescription.prescriptionDate)}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Status:</span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  prescription.verified
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {prescription.verified ? "Verified" : "Pending"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Prescription Image */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h6 className="font-medium text-gray-900">
                            Prescription Document
                          </h6>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                openImageModal(prescription.imageUrl)
                              }
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Full Size"
                            >
                              <IoEye size={18} />
                            </button>
                            <button
                              onClick={() =>
                                downloadPrescription(
                                  prescription.imageUrl,
                                  prescription.fileName
                                )
                              }
                              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                              title="Download"
                            >
                              <IoDownload size={18} />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-center">
                          <img
                            src={`${API_BASE_URL}${prescription.imageUrl}`}
                            alt={`Prescription ${index + 1}`}
                            className="max-w-full max-h-80 object-contain rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() =>
                              openImageModal(prescription.imageUrl)
                            }
                          />
                        </div>
                      </div>

                      {/* Verification Actions */}
                      {!prescription.verified && (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setSelectedPrescription(prescription);
                              setVerificationAction("approve");
                              handleVerification("approve", prescription);
                            }}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                          >
                            <IoCheckmarkCircle size={18} />
                            {loading && verificationAction === "approve"
                              ? "Approving..."
                              : "Approve"}
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPrescription(prescription);
                              setVerificationAction("reject");
                            }}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                          >
                            <IoCloseCircle size={18} />
                            Reject
                          </button>
                        </div>
                      )}

                      {/* Show rejection reason if exists */}
                      {prescription.rejectionReason && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <IoWarning className="text-red-500" size={16} />
                            <span className="text-sm font-medium text-red-800">
                              Rejection Reason
                            </span>
                          </div>
                          <p className="text-sm text-red-700">
                            {prescription.rejectionReason}
                          </p>
                        </div>
                      )}

                      {/* Show verification notes if exists */}
                      {prescription.verificationNotes && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <span className="text-sm font-medium text-blue-800">
                            Verification Notes:
                          </span>
                          <p className="text-sm text-blue-700 mt-1">
                            {prescription.verificationNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FaPrescriptionBottleAlt className="text-4xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No prescriptions uploaded</p>
                  </div>
                )}
              </div>

              {/* Rejection Confirmation */}
              {verificationAction === "reject" && selectedPrescription && (
                <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-10">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Confirm Rejection
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Please provide a reason for rejecting this prescription:
                    </p>
                    
                    <div className="mb-4">
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Enter rejection reason..."
                        className="w-full p-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                        rows={3}
                        required
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          handleVerification("reject", selectedPrescription)
                        }
                        disabled={loading || !rejectionReason.trim()}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "Rejecting..." : "Yes, Reject"}
                      </button>
                      <button
                        onClick={() => {
                          setVerificationAction(null);
                          setSelectedPrescription(null);
                          setRejectionReason("");
                        }}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Image Modal */}
      {imageModalOpen && selectedImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative max-w-7xl max-h-[95vh] w-full h-full flex items-center justify-center"
          >
            <button
              onClick={() => {
                setImageModalOpen(false);
                setSelectedImage(null);
              }}
              className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none z-10 bg-black/50 rounded-full p-2"
            >
              <IoClose size={24} />
            </button>
            <img
              src={`${API_BASE_URL}${selectedImage}`}
              alt="Prescription Full Size"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </motion.div>
        </div>
      )}
    </>
  );
};

export default PrescriptionVerificationModal;
