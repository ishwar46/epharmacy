import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../services/authService";

const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const meResponse = await getMe();
        // If user is not admin, redirect to home page (or any safe page).
        if (meResponse.data.role !== "admin") {
          navigate("/");
        } else {
          // Mark as admin
          setIsAdmin(true);
        }
      } catch (error) {
        // If not authenticated or there's any error, go to login
        navigate("/login");
      }
    };

    checkAdmin();
  }, [navigate]);

  // While checking admin status, show a loading indicator
  if (isAdmin === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return children;
};

export default AdminRoute;
