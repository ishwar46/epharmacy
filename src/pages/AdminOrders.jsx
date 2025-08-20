import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../services/authService";
import { getOrders } from "../services/orderService";
import { ORDER_STATUS } from "../constants/status";
import {
  FaEye,
  FaClipboardList,
  FaCheckCircle,
  FaShoppingCart,
  FaSearch,
  FaFilter,
  FaPrescriptionBottleAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import Pagination from "../components/Paginations";
import Lottie from "react-lottie";
import noDataAnimation from "../assets/animations/nodata.json";
import { formatDate } from "../utils/dateUtils";
import { getStatusColor, getStatusLabel } from "../utils/statusUtils";
import Loading from "../components/Loading";
import { useDynamicTitle } from "../hooks/useDynamicTitle";

const AdminOrders = () => {
  // Set dynamic title for orders dashboard
  useDynamicTitle("Orders Management | Admin Dashboard | FixPharmacy");

  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  // Filter/search states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [prescriptionFilter, setPrescriptionFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination state
  const [startIndex, setStartIndex] = useState(0);

  const navigate = useNavigate();

  // Fetch admin info and orders
  const fetchData = async () => {
    try {
      // 1) Get admin info
      const meResponse = await getMe();
      setAdminInfo(meResponse.data);

      // 2) Get orders
      const ordersResponse = await getOrders();
      console.log("Orders API response:", ordersResponse.data);
      const fetchedOrders = ordersResponse.data.data || ordersResponse.data;
      setOrders(fetchedOrders);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle order click - navigate to order details
  const handleOrderClick = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  // Filters
  const filteredOrders = orders.filter((order) => {
    // Safe search with null checks - Fixed data structure
    const orderNumber = order.orderNumber || order._id || "";
    const customerName = order.customer?.user?.name || order.customer?.guestDetails?.name || "";
    const customerEmail = order.customer?.user?.email || order.customer?.guestDetails?.email || "";

    const matchesSearch =
      orderNumber
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;
      
    const matchesPrescription =
      prescriptionFilter === "All" ||
      (prescriptionFilter === "Required" && (order.hasPrescriptionItems || order.prescriptionStatus === 'pending_verification')) ||
      (prescriptionFilter === "Pending" && order.prescriptionStatus === 'pending_verification') ||
      (prescriptionFilter === "Verified" && order.prescriptionStatus === 'verified') ||
      (prescriptionFilter === "OTC" && !order.hasPrescriptionItems && order.prescriptionStatus === 'not_required');
      
    return matchesSearch && matchesStatus && matchesPrescription;
  });

  // Pagination
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + 10);

  // Quick stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;
  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered"
  ).length;
  const prescriptionOrders = orders.filter(
    (order) => order.hasPrescriptionItems || order.prescriptionStatus === "pending_verification"
  ).length;
  const totalRevenue = orders.reduce(
    (acc, order) => acc + (order.pricing?.total || 0),
    0
  );

  // Loading + error handling
  if (loading) {
    return <Loading />;
  }

  if (!adminInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">!</span>
          </div>
          <p className="text-gray-600">Failed to load admin information</p>
        </div>
      </div>
    );
  }

  // For "no data" animation
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: noDataAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="min-h-screen">
      <div className="max px-4 sm:px-6 lg:px-4 py-0 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-sm p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage customer orders and delivery status
              </p>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {adminInfo.name}
                </p>
                <p className="text-xs text-gray-500">{adminInfo.email}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {adminInfo.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total Orders */}
          <div className="bg-white rounded-sm p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {totalOrders}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <FaShoppingCart className="text-blue-500" size={20} />
              </div>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white rounded-sm p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Pending Orders
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {pendingOrders}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                <FaClipboardList className="text-yellow-500" size={20} />
              </div>
            </div>
          </div>

          {/* Delivered Orders */}
          <div className="bg-white rounded-sm p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Delivered</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {deliveredOrders}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <FaCheckCircle className="text-green-500" size={20} />
              </div>
            </div>
          </div>

          {/* Prescription Orders */}
          <div className="bg-white rounded-sm p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  RX Required
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {prescriptionOrders}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <FaPrescriptionBottleAlt className="text-red-500" size={20} />
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-sm p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  Rs. {totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <FaShoppingCart className="text-purple-500" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-sm shadow-sm border border-gray-100">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900">Orders List</h2>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs font-medium">
                  {filteredOrders.length}
                </span>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="mt-4 space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <FaSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search orders, customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filter Toggle Button (Mobile) */}
              <div className="flex items-center justify-between sm:hidden">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 text-gray-600 font-medium"
                >
                  <FaFilter size={14} />
                  Filters
                </button>
                {(statusFilter !== "All" || prescriptionFilter !== "All") && (
                  <button
                    onClick={() => {
                      setStatusFilter("All");
                      setPrescriptionFilter("All");
                    }}
                    className="text-xs text-blue-500"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Filters */}
              <div
                className={`flex flex-col sm:flex-row gap-3 ${
                  showFilters ? "block" : "hidden sm:flex"
                }`}
              >
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All Status</option>
                  {ORDER_STATUS.map((status) => (
                    <option key={status} value={status}>
                      {getStatusLabel(status)}
                    </option>
                  ))}
                </select>
                
                <select
                  value={prescriptionFilter}
                  onChange={(e) => setPrescriptionFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="All">All Types</option>
                  <option value="Required">RX Required</option>
                  <option value="Pending">Pending Verification</option>
                  <option value="Verified">RX Verified</option>
                  <option value="OTC">OTC Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="p-6">
            {paginatedOrders.length > 0 ? (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                          #
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                          Order
                        </th>
                        <th className="text-center py-3 px-2 text-sm font-medium text-gray-500">
                          Type
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                          Customer
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                          Status
                        </th>
                        <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">
                          Amount
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                          Date
                        </th>
                        <th className="text-center py-3 px-2 text-sm font-medium text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {paginatedOrders.map((order, index) => (
                        <tr key={order._id} className="hover:bg-gray-25">
                          <td className="py-4 px-2 text-sm text-gray-500">
                            {startIndex + index + 1}
                          </td>
                          <td className="py-4 px-2">
                            <div>
                              <p className="font-medium text-gray-900">
                                {order.orderNumber || `#${order._id.slice(-6)}`}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <div className="flex items-center justify-center">
                              {order.hasPrescriptionItems || order.prescriptionStatus === 'pending_verification' ? (
                                <div className="relative group">
                                  <FaPrescriptionBottleAlt 
                                    className={`text-lg ${
                                      order.prescriptionStatus === 'pending_verification' 
                                        ? 'text-red-500' 
                                        : order.prescriptionStatus === 'verified'
                                        ? 'text-green-500'
                                        : 'text-yellow-500'
                                    }`} 
                                  />
                                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {order.prescriptionStatus === 'pending_verification' 
                                      ? 'Prescription Pending' 
                                      : order.prescriptionStatus === 'verified'
                                      ? 'Prescription Verified'
                                      : 'Prescription Required'}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-sm">OTC</span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-2">
                            <div>
                              <p className="font-medium text-gray-900">
                                {order.customer?.user?.name || order.customer?.guestDetails?.name || "N/A"}
                              </p>
                              <p className="text-sm text-gray-500">
                                {order.customer?.user?.email || order.customer?.guestDetails?.email || "N/A"}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-2">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-lg text-white ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {getStatusLabel(order.status)}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-right font-medium text-gray-900">
                            Rs. {(order.pricing?.total || 0).toLocaleString()}
                          </td>
                          <td className="py-4 px-2 text-sm text-gray-600">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="py-4 px-2">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleOrderClick(order._id)}
                                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <FaEye size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-4">
                  {paginatedOrders.map((order, index) => (
                    <div key={order._id} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900 truncate">
                              {order.orderNumber || `#${order._id.slice(-6)}`}
                            </h3>
                            {order.hasPrescriptionItems || order.prescriptionStatus === 'pending_verification' ? (
                              <FaPrescriptionBottleAlt 
                                className={`text-sm ${
                                  order.prescriptionStatus === 'pending_verification' 
                                    ? 'text-red-500' 
                                    : order.prescriptionStatus === 'verified'
                                    ? 'text-green-500'
                                    : 'text-yellow-500'
                                }`} 
                              />
                            ) : (
                              <span className="text-xs text-gray-400 bg-gray-200 px-1 rounded">OTC</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {order.customer?.user?.name || order.customer?.guestDetails?.name || "N/A"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {order.customer?.user?.email || order.customer?.guestDetails?.email || "N/A"}
                          </p>
                        </div>
                        <span
                          className={`ml-3 inline-flex px-2 py-1 text-xs font-medium rounded-lg text-white ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-500">Amount:</span>
                          <span className="font-medium text-gray-900">
                            Rs. {(order.pricing?.total || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-sm">Date:</span>
                          <span className="text-sm text-gray-600">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => handleOrderClick(order._id)}
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-white rounded-lg transition-colors"
                        >
                          <FaEye size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-32 h-32 mx-auto">
                  <Lottie options={defaultOptions} height={128} width={128} />
                </div>
                <p className="text-gray-500 font-medium mt-4">
                  No orders found
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            )}

            {/* Pagination */}
            {filteredOrders.length > 10 && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <Pagination
                  data={filteredOrders}
                  startIndex={startIndex}
                  setStartIndex={setStartIndex}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
