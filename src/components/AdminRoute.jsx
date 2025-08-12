import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { getMe, isAuthenticated } from "../services/authService";

const AdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // First check if token exists
        if (!isAuthenticated()) {
          setLoading(false);
          return;
        }

        // Then verify with server
        const response = await getMe();

        if (response.success && response.data.role === "admin") {
          setIsAdmin(true);
        } else {
          setError("Admin access required");
        }
      } catch (error) {
        console.error("Admin check failed:", error);
        setError("Authentication failed");
        // Clear invalid token
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userId");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  // Show loading spinner while checking
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Show error if admin check failed
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // Render children if admin
  return children;
};

export default AdminRoute;
