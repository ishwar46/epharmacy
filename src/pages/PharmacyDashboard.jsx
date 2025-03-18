import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../services/authService";
import { getProducts, deleteProduct } from "../services/productService";
import { getOrders } from "../services/orderService";
import {
  FaEdit,
  FaEye,
  FaTrash,
  FaBox,
  FaShoppingCart,
  FaCubes,
  FaPlus,
} from "react-icons/fa";
import toast from "react-hot-toast";
import Pagination from "../components/Paginations";
import ProductModal from "../components/ProductModal";
import EditProductModal from "../components/EditProductModal";
import CreateProductModal from "../components/CreateProductModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import categories from "../constants/categories";
import Lottie from "react-lottie";
import noDataAnimation from "../assets/animations/nodata.json";

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

  // Modal states for product details (View)
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Modal states for editing a product
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  // Add new product modal
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const navigate = useNavigate();

  // Function to fetch admin info, products, and orders
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

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (product) => {
    setProductToEdit(product);
    setEditModalOpen(true);
  };

  const handleProductCreated = (newProduct) => {
    setProducts((prevProducts) => [newProduct, ...prevProducts]);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete._id);
      setProducts((prev) => prev.filter((p) => p._id !== productToDelete._id));
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product.");
    }
    setDeleteModalOpen(false);
    setProductToDelete(null);
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

  // Handle view details (opens the view modal)
  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: noDataAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

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
    <div className="flex flex-col gap-5 cursor-pointer">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-gray-800">
            Pharmacy Dashboard
          </h1>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">
              {adminInfo.name}
            </p>
            <p className="text-xs text-gray-500">{adminInfo.email}</p>
          </div>
          {/* Profile Avatar */}
          <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-gray-100">
            <span className="text-gray-600 font-semibold">
              {adminInfo.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 cursor-pointer">
        {/* Total Products */}
        <div className="flex flex-col items-center bg-white hover:shadow-md rounded-lg p-4 border border-gray-200 transition-all duration-200 transform hover:scale-105">
          <div className="flex items-center justify-center w-10 h-10 bg-indigo-500 text-white rounded-full shadow-sm mb-2">
            <FaBox size={22} />
          </div>
          <h2 className="text-sm font-medium text-gray-600">Total Products</h2>
          <span className="text-xl font-semibold text-indigo-600">
            {totalProducts}
          </span>
        </div>

        {/* Total Orders */}
        <div className="flex flex-col items-center bg-white hover:shadow-md rounded-lg p-4 border border-gray-200 transition-all duration-200 transform hover:scale-105">
          <div className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full shadow-sm mb-2">
            <FaShoppingCart size={22} />
          </div>
          <h2 className="text-sm font-medium text-gray-600">Total Orders</h2>
          <span className="text-xl font-semibold text-red-600">
            {totalOrders}
          </span>
        </div>

        {/* Total Stock */}
        <div className="flex flex-col items-center bg-white hover:shadow-md rounded-lg p-4 border border-gray-200 transition-all duration-200 transform hover:scale-105">
          <div className="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full shadow-sm mb-2">
            <FaCubes size={22} />
          </div>
          <h2 className="text-sm font-medium text-gray-600">Total Stock</h2>
          <span className="text-xl font-semibold text-green-600">
            {totalStock}
          </span>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 overflow-x-auto">
        <table className="min-w-full text-sm text-left border-collapse">
          <caption className="mb-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-gray-800">
                  Products List
                </h2>
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="flex items-center gap-2 border border-blue-500 text-blue-500 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-500 hover:text-white transition duration-200"
                >
                  <FaPlus size={14} /> Add Product
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
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
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

          {/* Table Head */}
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-3 font-medium">SN</th>
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

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product, index) => (
                <tr key={product._id} className="hover:bg-gray-50 transition">
                  <td className="p-3">{startIndex + index + 1}</td>
                  <td className="p-3">{product.name}</td>
                  <td className="p-3 hidden md:table-cell truncate max-w-[150px]">
                    {product.description}
                  </td>
                  <td className="p-3 hidden lg:table-cell truncate max-w-[100px]">
                    {product.dosage}
                  </td>
                  <td className="p-3 text-right">Rs. {product.price}</td>
                  <td className="p-3 text-right">{product.stock}</td>
                  <td className="p-3 hidden md:table-cell">
                    {product.category}
                  </td>
                  <td className="p-3 hidden lg:table-cell">{product.brand}</td>
                  <td className="p-3 hidden md:table-cell">
                    {product.medicineType}
                  </td>
                  <td className="p-3 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="inline-flex items-center gap-1 bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleViewDetails(product)}
                      className="inline-flex items-center gap-1 border border-green-500 text-green-500 px-3 py-1 rounded text-sm hover:bg-green-50"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product)}
                      className="inline-flex items-center gap-1 border border-red-500 text-red-500 px-3 py-1 rounded text-sm hover:bg-red-50"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="10"
                  className="p-6 text-center text-gray-600 flex flex-col items-center justify-center"
                >
                  <div className="w-48 h-48">
                    <Lottie options={defaultOptions} height={150} width={150} />
                  </div>
                  <p className="text-gray-500 font-medium mt-2">
                    No Products Found
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination */}
        <Pagination
          data={filteredProducts}
          startIndex={startIndex}
          setStartIndex={setStartIndex}
        />
      </div>
      {/* Product Modal for Viewing */}
      {modalOpen && selectedProduct && (
        <ProductModal
          open={modalOpen}
          product={selectedProduct}
          handleClose={() => setModalOpen(false)}
        />
      )}
      {/* Edit Product Modal */}
      {editModalOpen && productToEdit && (
        <EditProductModal
          open={editModalOpen}
          product={productToEdit}
          handleClose={() => setEditModalOpen(false)}
          onUpdate={fetchData}
        />
      )}

      {/* Create Product Modal */}
      {createModalOpen && (
        <CreateProductModal
          open={createModalOpen}
          handleClose={() => setCreateModalOpen(false)}
          onProductCreated={handleProductCreated}
        />
      )}
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={deleteModalOpen}
        handleClose={() => setDeleteModalOpen(false)}
        handleConfirm={confirmDelete}
      />
    </div>
  );
};

export default PharmacyDashboard;
