// src/pages/PharmacyDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../services/authService";
import { getProducts } from "../services/productService";
import { getOrders } from "../services/orderService";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import Pagination from "../components/Paginations";

const PharmacyDashboard = () => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [orderCount, setOrderCount] = useState(0);

  // Filter/search states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  // Pagination state
  const [startIndex, setStartIndex] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meResponse = await getMe();
        setAdminInfo(meResponse.data);

        const productsResponse = await getProducts();
        setProducts(productsResponse.data);

        const ordersResponse = await getOrders();
        setOrderCount(ordersResponse.count);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await axios.delete(`http://localhost:5500/api/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts(products.filter((p) => p._id !== id));
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product.");
    }
  };

  // Filter products based on search query and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || product.category === categoryFilter;
    const matchesType =
      typeFilter === "All" || product.medicineType === typeFilter;
    return matchesSearch && matchesCategory && matchesType;
  });

  // Apply pagination (10 items per page)
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + 10);

  // Quick stats
  const totalProducts = products.length;
  const totalOrders = orderCount;
  const totalStock = products.reduce((acc, product) => acc + product.stock, 0);

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

  if (!adminInfo) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg font-medium text-gray-700">
          Failed to load admin information.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Pharmacy Dashboard
        </h1>
        <div className="text-right">
          <p className="text-sm text-gray-700">{adminInfo.name}</p>
          <p className="text-xs text-gray-500">{adminInfo.email}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Products */}
        <div className="flex flex-col bg-white rounded border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="w-6 h-6 inline-flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full text-sm font-bold">
              P
            </span>
            <h2 className="font-medium text-gray-700">Total Products</h2>
          </div>
          <span className="text-2xl font-semibold">{totalProducts}</span>
        </div>

        {/* Total Orders */}
        <div className="flex flex-col bg-white rounded border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="w-6 h-6 inline-flex items-center justify-center bg-red-100 text-red-600 rounded-full text-sm font-bold">
              O
            </span>
            <h2 className="font-medium text-gray-700">Total Orders</h2>
          </div>
          <span className="text-2xl font-semibold">{totalOrders}</span>
        </div>

        {/* Total Stock */}
        <div className="flex flex-col bg-white rounded border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="w-6 h-6 inline-flex items-center justify-center bg-green-100 text-green-600 rounded-full text-sm font-bold">
              S
            </span>
            <h2 className="font-medium text-gray-700">Total Stock</h2>
          </div>
          <span className="text-2xl font-semibold">{totalStock}</span>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded border border-gray-200 p-4">
        <table className="min-w-full text-sm text-left border-collapse">
          <caption className="mb-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-gray-800">
                  Products List
                </h2>
                <button
                  onClick={() => navigate("/admin/products/new")}
                  className="border border-blue-500 text-blue-500 px-3 py-1 rounded text-sm hover:bg-blue-50"
                >
                  Add New Product
                </button>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <input
                  type="text"
                  placeholder="Search by product name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-3 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <select
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  value={categoryFilter}
                  className="border border-gray-200 text-sm rounded-md py-2 px-2 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="All">All Categories</option>
                  <option value="Oral Care">Oral Care</option>
                  <option value="Anti-Cold">Anti-Cold</option>
                  <option value="Beauty & Cosmetic">Beauty & Cosmetic</option>
                </select>
                <select
                  onChange={(e) => setTypeFilter(e.target.value)}
                  value={typeFilter}
                  className="border border-gray-200 text-sm rounded-md py-2 px-2 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="All">All Types</option>
                  <option value="OTC">OTC</option>
                  <option value="Prescription">Prescription</option>
                </select>
              </div>
            </div>
          </caption>
          <thead className="bg-gray-100">
            <tr className="text-gray-700">
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium hidden md:table-cell">
                Description
              </th>
              <th className="p-3 font-medium hidden lg:table-cell">Dosage</th>
              <th className="p-3 font-medium text-right">Price</th>
              <th className="p-3 font-medium text-right">Stock</th>
              <th className="p-3 font-medium hidden md:table-cell">Category</th>
              <th className="p-3 font-medium hidden lg:table-cell">Brand</th>
              <th className="p-3 font-medium hidden md:table-cell">Type</th>
              <th className="p-3 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedProducts.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="p-3">{product.name}</td>
                <td className="p-3 hidden md:table-cell truncate max-w-[150px]">
                  {product.description}
                </td>
                <td className="p-3 hidden lg:table-cell truncate max-w-[100px]">
                  {product.dosage}
                </td>
                <td className="p-3 text-right">Rs.{product.price}</td>
                <td className="p-3 text-right">{product.stock}</td>
                <td className="p-3 hidden md:table-cell">{product.category}</td>
                <td className="p-3 hidden lg:table-cell">{product.brand}</td>
                <td className="p-3 hidden md:table-cell">
                  {product.medicineType}
                </td>
                <td className="p-3 flex items-center justify-center gap-2">
                  <button
                    onClick={() =>
                      navigate(`/admin/products/edit/${product._id}`)
                    }
                    className="inline-flex items-center gap-1 bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="inline-flex items-center gap-1 border border-red-500 text-red-500 px-3 py-1 rounded text-sm hover:bg-red-50"
                  >
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination */}
        <Pagination
          data={filteredProducts}
          startIndex={startIndex}
          setStartIndex={setStartIndex}
        />
      </div>
    </div>
  );
};

export default PharmacyDashboard;
