import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import AdminOrders from "../pages/AdminOrders";
import AdminOrderDetails from "../components/AdminOrderDetails";
import AdminRoute from "../components/AdminRoute";
import NotFound from "../pages/NotFound";
import ProductsDashboard from "../pages/ProductsDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Login />} />

      {/* Protected Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <AdminRoute>
            <AdminOrders />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/orders/:id"
        element={
          <AdminRoute>
            <AdminOrderDetails />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <AdminRoute>
            <ProductsDashboard />
          </AdminRoute>
        }
      />
      {/* Fallback route for non-existing pages */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
