import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import UserProfile from "../pages/UserProfile";
import AdminDashboard from "../pages/AdminDashboard";
import AdminOrders from "../pages/AdminOrders";
import AdminOrderDetails from "../components/AdminOrderDetails";
import AdminRoute from "../components/AdminRoute";
import ProtectedRoute from "../components/ProtectedRoute";
import NotFound from "../pages/NotFound";
import ProductsDashboard from "../pages/ProductsDashboard";
import UsersDashboard from "../pages/UsersDashboard";
import HeroBannerDashboard from "../pages/HeroBannerDashboard";
import ProductCatalog from "../pages/customer/ProductCatalog";
import ProductDetail from "../pages/customer/ProductDetail";
import LandingPage from "../pages/LandingPage";
import Cart from "../pages/customer/Cart";
import Checkout from "../pages/customer/Checkout";
import OrderConfirmation from "../pages/customer/OrderConfirmation";
import OrderHistory from "../pages/customer/OrderHistory";
import OrderTracking from "../pages/customer/OrderTracking";
import MainLayout from "../layouts/MainLayout";
import PlainLayout from "../layouts/PlainLayout";
import AdminLayout from "../layouts/AdminLayout";
import ScrollToTop from "../components/common/ScrollToTop";

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
      {/* Public routes with navbar */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<ProductCatalog />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
        <Route path="/track" element={<OrderTracking />} />
        <Route path="/track/:orderNumber" element={<OrderTracking />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Auth routes (no navbar) */}
      <Route element={<PlainLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected user routes (with navbar) */}
      <Route element={<MainLayout />}>
        <Route path="/profile" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute>
            <OrderHistory />
          </ProtectedRoute>
        } />
      </Route>

      {/* Admin routes (with admin layout) */}
      <Route
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
        <Route path="/admin/products" element={<ProductsDashboard />} />
        <Route path="/admin/users" element={<UsersDashboard />} />
        <Route path="/admin/hero-banner" element={<HeroBannerDashboard />} />
      </Route>
    </Routes>
    </>
  );
};

export default AppRoutes;
