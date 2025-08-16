import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import AdminOrders from "../pages/AdminOrders";
import AdminOrderDetails from "../components/AdminOrderDetails";
import AdminRoute from "../components/AdminRoute";
import NotFound from "../pages/NotFound";
import ProductsDashboard from "../pages/ProductsDashboard";
import UsersDashboard from "../pages/UsersDashboard";
import ProductCatalog from "../pages/customer/ProductCatalog";
import ProductDetail from "../pages/customer/ProductDetail";
import MainLayout from "../layouts/MainLayout";
import PlainLayout from "../layouts/PlainLayout";
import ScrollToTop from "../components/common/ScrollToTop";

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
      {/* Public routes with navbar */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<ProductCatalog />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Auth routes (no navbar) */}
      <Route element={<PlainLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Admin routes (no navbar) */}
      <Route
        element={
          <AdminRoute>
            <PlainLayout />
          </AdminRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
        <Route path="/admin/products" element={<ProductsDashboard />} />
        <Route path="/admin/users" element={<UsersDashboard />} />
      </Route>
    </Routes>
    </>
  );
};

export default AppRoutes;
