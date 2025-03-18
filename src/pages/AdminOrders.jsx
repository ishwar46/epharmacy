import React, { useEffect, useState } from "react";
import { getOrders } from "../services/orderService";
import { ORDER_STATUS } from "../constants/status";
import {
  FaEye,
  FaClipboardList,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import Pagination from "../components/Paginations";
import Lottie from "react-lottie";
import noDataAnimation from "../assets/animations/nodata.json";
import { formatDate } from "../utils/dateUtils";
import { getStatusColor } from "../utils/statusUtils";

const AdminOrders = ({ setSelectedOrderId, onSelect }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Pagination state
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders();
        console.log("Orders API response:", response.data);
        const fetchedOrders = response.data.data || response.data;
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <svg
          className="animate-spin text-indigo-500 h-8 w-8"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25 stroke-current"
            cx="12"
            cy="12"
            r="10"
            strokeWidth="4"
          />
          <path
            className="opacity-75 fill-current"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="w-48 h-48">
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: noDataAnimation,
              rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
            }}
            height={150}
            width={150}
          />
        </div>
        <p className="text-gray-500 font-medium mt-2">No Orders Found</p>
      </div>
    );
  }

  // Quick stats for all statuses
  const statusCounts = ORDER_STATUS.reduce((acc, status) => {
    acc[status] = orders.filter((o) => o.status === status).length;
    return acc;
  }, {});

  // Filter orders based on search query and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.orderNumber
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Apply pagination (10 items per page)
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + 10);

  return (
    <div className="flex flex-col gap-5 cursor-pointer">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">
          Orders Dashboard
        </h1>
      </div>

      {/* Quick Stats for all Order Statuses */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 cursor-pointer">
        {ORDER_STATUS.map((status) => {
          let icon = null;
          if (status === "pending") icon = <FaClipboardList size={22} />;
          if (status === "processing") icon = <FaTruck size={22} />;
          if (status === "confirmed") icon = <FaCheckCircle size={22} />;
          if (status === "shipped") icon = <FaTruck size={22} />;
          if (status === "out for delivery") icon = <FaTruck size={22} />;
          if (status === "delivered") icon = <FaCheckCircle size={22} />;
          if (status === "cancelled") icon = <FaTimesCircle size={22} />;

          return (
            <div
              key={status}
              className="flex flex-col items-center bg-white hover:shadow-md rounded-lg p-4 border border-gray-200 transition-all duration-200 transform hover:scale-105"
            >
              <div
                className={`flex items-center justify-center w-10 h-10 ${getStatusColor(
                  status
                )} text-white rounded-full shadow-sm mb-2`}
              >
                {icon}
              </div>
              <h2 className="text-sm font-medium text-gray-600 capitalize">
                {status}
              </h2>
              <span className="text-xl font-semibold text-gray-800">
                {statusCounts[status]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Filter Section */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <input
          type="text"
          placeholder="Search by order number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-3 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <select
          onChange={(e) => setStatusFilter(e.target.value)}
          value={statusFilter}
          className="border border-gray-200 text-sm rounded-md py-2 px-2 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="All">All Status</option>
          {ORDER_STATUS.map((status, index) => (
            <option key={index} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 overflow-x-auto">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-3 font-medium">SN</th>
              <th className="p-3 font-medium">Order Number</th>
              <th className="p-3 font-medium">Customer</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium text-right">Total Price</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Order Date</th>
              <th className="p-3 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedOrders.map((order, index) => (
              <tr key={order._id} className="hover:bg-gray-50 transition">
                <td className="p-3">{startIndex + index + 1}</td>
                <td className="p-3">{order.orderNumber}</td>
                <td className="p-3">{order.user.name}</td>
                <td className="p-3">{order.user.email}</td>
                <td className="p-3 text-right text-green-600 font-semibold">
                  Rs. {order.finalPrice}
                </td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 text-xs text-white font-semibold rounded-full ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </td>
                <td className="p-3">{formatDate(order.createdAt)}</td>
                <td className="p-3 flex justify-center">
                  <button
                    onClick={() => {
                      setSelectedOrderId(order._id);
                      onSelect();
                    }}
                    className="inline-flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 cursor-pointer"
                  >
                    <FaEye /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          data={filteredOrders}
          startIndex={startIndex}
          setStartIndex={setStartIndex}
        />
      </div>
    </div>
  );
};

export default AdminOrders;
