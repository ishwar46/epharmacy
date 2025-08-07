import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaDownload,
  FaRefresh,
} from "react-icons/fa";
import {
  getProducts,
  deleteProduct,
  getCategories,
} from "../services/productService";
import ProductCard from "./ProductCard";
import CreateProductModal from "./CreateProductModal";
import toast from "react-hot-toast";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    medicineType: "",
    inStock: "",
    prescriptionRequired: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    purchaseType: "unit",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 12,
  });

  // Load products
  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      // Add all non-empty filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "") {
          params.append(key, value);
        }
      });

      params.append("page", pagination.currentPage);
      params.append("limit", pagination.limit);

      const response = await getProducts(Object.fromEntries(params));
      setProducts(response.data);
      setPagination((prev) => ({
        ...prev,
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        total: response.total,
      }));
    } catch (error) {
      toast.error("Failed to load products");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Load categories
  const loadCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [filters, pagination.currentPage]);

  useEffect(() => {
    loadCategories();
  }, []);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      medicineType: "",
      inStock: "",
      prescriptionRequired: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      purchaseType: "unit",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Handle product creation
  const handleProductCreated = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev.slice(0, -1)]); // Replace last item to maintain count
    toast.success("Product created successfully!");
  };

  // Handle product deletion
  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId);
        setProducts((prev) => prev.filter((p) => p._id !== productId));
        toast.success("Product deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete product");
        console.error(error);
      }
    }
  };

  // Handle view details
  const handleViewDetails = (product) => {
    console.log("View details:", product);
    // You can implement a detailed view modal here
    toast.info(`Viewing details for ${product.name}`);
  };

  // Handle edit product
  const handleEditProduct = (product) => {
    console.log("Edit product:", product);
    // You can implement edit functionality here
    toast.info(`Edit functionality coming soon for ${product.name}`);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
    window.scrollTo(0, 0);
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    return Object.entries(filters).filter(
      ([key, value]) =>
        value &&
        value !== "" &&
        key !== "purchaseType" &&
        key !== "sortBy" &&
        key !== "sortOrder"
    ).length;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">
            Manage your pharmacy inventory with unit-based sales
          </p>
          {pagination.total > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Showing {(pagination.currentPage - 1) * pagination.limit + 1}-
              {Math.min(
                pagination.currentPage * pagination.limit,
                pagination.total
              )}{" "}
              of {pagination.total} products
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => loadProducts()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <FaRefresh size={16} />
            Refresh
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus size={16} />
            Add Product
          </button>
        </div>
      </div>

      {/* Search and Quick Filters */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FaSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search products, brands, ingredients..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2">
            <select
              value={filters.purchaseType}
              onChange={(e) =>
                handleFilterChange("purchaseType", e.target.value)
              }
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="unit">Unit Pricing</option>
              <option value="package">Package Pricing</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 border rounded-lg transition-colors ${
                showFilters || getActiveFilterCount() > 0
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <FaFilter size={16} />
              Filters{" "}
              {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat._id} ({cat.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Medicine Type Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Medicine Type
                </label>
                <select
                  value={filters.medicineType}
                  onChange={(e) =>
                    handleFilterChange("medicineType", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="OTC">OTC</option>
                  <option value="Prescription">Prescription</option>
                  <option value="Controlled">Controlled</option>
                </select>
              </div>

              {/* Stock Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Stock Status
                </label>
                <select
                  value={filters.inStock}
                  onChange={(e) =>
                    handleFilterChange("inStock", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Stock</option>
                  <option value="true">In Stock Only</option>
                </select>
              </div>

              {/* Prescription Required Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Prescription
                </label>
                <select
                  value={filters.prescriptionRequired}
                  onChange={(e) =>
                    handleFilterChange("prescriptionRequired", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Products</option>
                  <option value="true">Prescription Required</option>
                  <option value="false">No Prescription</option>
                </select>
              </div>

              {/* Min Price Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Min Price (Rs.)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) =>
                    handleFilterChange("minPrice", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Max Price Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Max Price (Rs.)
                </label>
                <input
                  type="number"
                  placeholder="1000"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Sort by:
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="createdAt">Date Created</option>
                  <option value="name">Name</option>
                  <option value="pricing.pricePerUnit">Price</option>
                  <option value="inventory.availableUnits">Stock</option>
                  <option value="brand">Brand</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Order:
                </label>
                <select
                  value={filters.sortOrder}
                  onChange={(e) =>
                    handleFilterChange("sortOrder", e.target.value)
                  }
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>

              {/* Clear Filters Button */}
              {getActiveFilterCount() > 0 && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <p className="text-gray-600">
            {loading ? "Loading..." : `${pagination.total} products found`}
            {filters.search && ` for "${filters.search}"`}
          </p>
          {getActiveFilterCount() > 0 && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {getActiveFilterCount()} filter
              {getActiveFilterCount() > 1 ? "s" : ""} applied
            </span>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Showing:</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
            {filters.purchaseType === "unit"
              ? "Unit Pricing"
              : "Package Pricing"}
          </span>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <FaSearch size={48} className="mx-auto mb-4" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600 mb-6">
            {getActiveFilterCount() > 0
              ? "Try adjusting your filters to find what you're looking for."
              : "Get started by adding your first product."}
          </p>
          {getActiveFilterCount() > 0 ? (
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Clear All Filters
            </button>
          ) : (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Product
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-2">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex gap-1">
            {Array.from(
              { length: Math.min(5, pagination.totalPages) },
              (_, i) => {
                let pageNumber;
                if (pagination.totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (pagination.currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (
                  pagination.currentPage >=
                  pagination.totalPages - 2
                ) {
                  pageNumber = pagination.totalPages - 4 + i;
                } else {
                  pageNumber = pagination.currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      pageNumber === pagination.currentPage
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-300"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              }
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Page Size Selector */}
      {pagination.total > 12 && (
        <div className="flex justify-center items-center mt-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Show:</span>
            <select
              value={pagination.limit}
              onChange={(e) =>
                setPagination((prev) => ({
                  ...prev,
                  limit: parseInt(e.target.value),
                  currentPage: 1,
                }))
              }
              className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
              <option value={96}>96</option>
            </select>
            <span>per page</span>
          </div>
        </div>
      )}

      {/* Create Product Modal */}
      <CreateProductModal
        open={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        onProductCreated={handleProductCreated}
      />
    </div>
  );
};

export default ProductListPage;
