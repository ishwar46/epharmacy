import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../services/authService";
import { getProducts, deleteProduct } from "../services/productService";
import {
  FaEdit,
  FaEye,
  FaTrash,
  FaBox,
  FaCubes,
  FaPlus,
  FaSearch,
  FaFilter,
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
import Loading from "../components/Loading";

const ProductsDashboard = () => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  // Filter/search states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination state
  const [startIndex, setStartIndex] = useState(0);

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const navigate = useNavigate();

  // Fetch admin info and products
  const fetchData = async () => {
    try {
      // 1) Get admin info
      const meResponse = await getMe();
      setAdminInfo(meResponse.data);

      // 2) Get products
      const productsResponse = await getProducts();
      setProducts(productsResponse.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Create new product
  const handleProductCreated = (newProduct) => {
    setProducts((prevProducts) => [newProduct, ...prevProducts]);
  };

  // Edit product
  const handleEdit = (product) => {
    setProductToEdit(product);
    setEditModalOpen(true);
  };

  // Delete product
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

  // View details
  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  // Filters
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

  // Pagination
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + 10);

  // Quick stats
  const totalProducts = products.length;
  const totalStock = products.reduce((acc, product) => acc + product.stock, 0);

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
              <h1 className="text-2xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage your pharmacy inventory
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Total Products */}
          <div className="bg-white rounded-sm p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {totalProducts}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <FaBox className="text-blue-500" size={20} />
              </div>
            </div>
          </div>

          {/* Total Stock */}
          <div className="bg-white rounded-sm p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Stock</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {totalStock}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <FaCubes className="text-green-500" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-sm shadow-sm border border-gray-100">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900">
                  Products List
                </h2>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs font-medium">
                  {filteredProducts.length}
                </span>
              </div>
              <button
                onClick={() => setCreateModalOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors"
              >
                <FaPlus size={14} />
                <span className="hidden sm:inline">Add Product</span>
                <span className="sm:hidden">Add</span>
              </button>
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
                  placeholder="Search products..."
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
                {(categoryFilter !== "All" || typeFilter !== "All") && (
                  <button
                    onClick={() => {
                      setCategoryFilter("All");
                      setTypeFilter("All");
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
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All Categories</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All Types</option>
                  <option value="OTC">OTC</option>
                  <option value="Prescription">Prescription</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products List */}
          <div className="p-6">
            {paginatedProducts.length > 0 ? (
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
                          Product
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                          Category
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                          Type
                        </th>
                        <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">
                          Price
                        </th>
                        <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">
                          Stock
                        </th>
                        <th className="text-center py-3 px-2 text-sm font-medium text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {paginatedProducts.map((product, index) => (
                        <tr key={product._id} className="hover:bg-gray-25">
                          <td className="py-4 px-2 text-sm text-gray-500">
                            {startIndex + index + 1}
                          </td>
                          <td className="py-4 px-2">
                            <div>
                              <p className="font-medium text-gray-900">
                                {product.name}
                              </p>
                              <p className="text-sm text-gray-500 truncate max-w-xs">
                                {product.description}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-2 text-sm text-gray-600">
                            {product.category}
                          </td>
                          <td className="py-4 px-2">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-lg ${
                                product.medicineType === "Prescription"
                                  ? "bg-red-50 text-red-700"
                                  : "bg-green-50 text-green-700"
                              }`}
                            >
                              {product.medicineType}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-right font-medium text-gray-900">
                            Rs. {product.price}
                          </td>
                          <td className="py-4 px-2 text-right">
                            <span
                              className={`font-medium ${
                                product.stock < 10
                                  ? "text-red-600"
                                  : "text-gray-900"
                              }`}
                            >
                              {product.stock}
                            </span>
                          </td>
                          <td className="py-4 px-2">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleViewDetails(product)}
                                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <FaEye size={16} />
                              </button>
                              <button
                                onClick={() => handleEdit(product)}
                                className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                              >
                                <FaEdit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(product)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <FaTrash size={16} />
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
                  {paginatedProducts.map((product, index) => (
                    <div
                      key={product._id}
                      className="bg-gray-50 rounded-xl p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {product.description}
                          </p>
                        </div>
                        <span
                          className={`ml-3 inline-flex px-2 py-1 text-xs font-medium rounded-lg ${
                            product.medicineType === "Prescription"
                              ? "bg-red-50 text-red-700"
                              : "bg-green-50 text-green-700"
                          }`}
                        >
                          {product.medicineType}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-500">Price:</span>
                          <span className="font-medium text-gray-900">
                            Rs. {product.price}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-sm">Stock:</span>
                          <span
                            className={`font-medium ${
                              product.stock < 10
                                ? "text-red-600"
                                : "text-gray-900"
                            }`}
                          >
                            {product.stock}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {product.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleViewDetails(product)}
                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-white rounded-lg transition-colors"
                          >
                            <FaEye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-gray-400 hover:text-green-500 hover:bg-white rounded-lg transition-colors"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(product)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
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
                  No products found
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > 10 && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <Pagination
                  data={filteredProducts}
                  startIndex={startIndex}
                  setStartIndex={setStartIndex}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {modalOpen && selectedProduct && (
        <ProductModal
          open={modalOpen}
          product={selectedProduct}
          handleClose={() => setModalOpen(false)}
        />
      )}

      {editModalOpen && productToEdit && (
        <EditProductModal
          open={editModalOpen}
          product={productToEdit}
          handleClose={() => setEditModalOpen(false)}
          onUpdate={fetchData}
        />
      )}

      {createModalOpen && (
        <CreateProductModal
          open={createModalOpen}
          handleClose={() => setCreateModalOpen(false)}
          onProductCreated={handleProductCreated}
        />
      )}

      <DeleteConfirmationModal
        open={deleteModalOpen}
        handleClose={() => setDeleteModalOpen(false)}
        handleConfirm={confirmDelete}
      />
    </div>
  );
};

export default ProductsDashboard;
