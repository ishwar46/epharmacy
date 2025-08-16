import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FaTimes,
  FaExclamationTriangle,
  FaEye,
  FaEyeSlash,
  FaTrash,
  FaShieldAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { deleteUserAccount } from "../services/userService";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const DeleteAccountModal = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Warning, 2: Confirmation, 3: Password
  const [password, setPassword] = useState("");
  const [reason, setReason] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [understood, setUnderstood] = useState(false);

  const resetModal = () => {
    setStep(1);
    setPassword("");
    setReason("");
    setConfirmText("");
    setUnderstood(false);
    setShowPassword(false);
    setLoading(false);
  };

  const handleClose = () => {
    if (!loading) {
      resetModal();
      onClose();
    }
  };

  const handleDeleteAccount = async () => {
    if (!password.trim()) {
      toast.error("Please enter your password");
      return;
    }

    try {
      setLoading(true);
      const data = await deleteUserAccount(password, reason);

      if (data.success) {
        toast.success("Account deleted successfully");

        // Close modal
        handleClose();

        // Logout user and redirect
        setTimeout(async () => {
          await logout();
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      console.error("Delete account error:", error);
      toast.error(error.response?.data?.message || "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  const reasons = [
    { value: "privacy_concerns", label: "Privacy concerns" },
    { value: "too_many_emails", label: "Too many emails" },
    { value: "not_useful", label: "Not useful anymore" },
    { value: "switching_service", label: "Switching to another service" },
    { value: "technical_issues", label: "Technical issues" },
    { value: "other", label: "Other reason" },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <FaTrash className="text-red-600" size={16} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Delete Account
                </h2>
                <p className="text-sm text-gray-500">Step {step} of 3</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Step 1: Warning */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <FaExclamationTriangle
                      className="text-red-600 mt-1"
                      size={20}
                    />
                    <div>
                      <h3 className="font-semibold text-red-800 mb-2">
                        This action cannot be undone
                      </h3>
                      <p className="text-red-700 text-sm">
                        Deleting your account will permanently remove all your
                        data, including your profile, order history, and
                        preferences.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <FaInfoCircle className="text-blue-600" size={16} />
                    What happens when you delete your account:
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      Your profile and personal information will be permanently
                      removed
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      You will lose access to your order history and preferences
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      Any active orders must be completed or cancelled first
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      Your data will be archived for legal compliance purposes
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <FaShieldAlt className="text-blue-600 mt-1" size={16} />
                    <div>
                      <h4 className="font-medium text-blue-800 mb-1">
                        Data Privacy
                      </h4>
                      <p className="text-blue-700 text-sm">
                        Your data will be anonymized and archived for legal
                        compliance. No personal information will be accessible
                        after deletion.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="understood"
                    checked={understood}
                    onChange={(e) => setUnderstood(e.target.checked)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <label htmlFor="understood" className="text-sm text-gray-700">
                    I understand that this action cannot be undone
                  </label>
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    disabled={!understood}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Reason */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">
                    Help us improve (Optional)
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    We'd like to understand why you're leaving to help us
                    improve our service.
                  </p>

                  <div className="space-y-3">
                    {reasons.map((reasonOption) => (
                      <label
                        key={reasonOption.value}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="reason"
                          value={reasonOption.value}
                          checked={reason === reasonOption.value}
                          onChange={(e) => setReason(e.target.value)}
                          className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-700">
                          {reasonOption.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional comments (Optional)
                  </label>
                  <textarea
                    value={reason === "other" ? reason : ""}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Tell us more about your decision..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-800 mb-2">
                    Final Confirmation
                  </h3>
                  <p className="text-red-700 text-sm">
                    Please enter your password to confirm account deletion.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type "DELETE" to confirm
                  </label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="Type DELETE"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your current password"
                      className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <FaEyeSlash size={16} />
                      ) : (
                        <FaEye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setStep(2)}
                    disabled={loading}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={
                      loading || confirmText !== "DELETE" || !password.trim()
                    }
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <FaTrash size={14} />
                        Delete Account
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DeleteAccountModal;
