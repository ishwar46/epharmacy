import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../contexts/SearchContext";
import { useCart } from "../../contexts/CartContext";
import SEO from "../../components/common/SEO";
import {
  generateDynamicTitle,
  useDynamicTitle,
} from "../../hooks/useDynamicTitle";
import {
  Search,
  Filter,
  ShoppingCart,
  Package,
  Pill,
  Star,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Heart,
  Award,
  Clock,
  Eye,
  X,
} from "lucide-react";
import { getProducts, getCategories } from "../../services/productService";

const ProductCatalog = () => {
  const navigate = useNavigate();
  const { searchFilters, updateFilter, clearFilters } = useSearch();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [medicineTypes, setMedicineTypes] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Use filters from context
  const filters = searchFilters;

  // Check if any filters are active
  const hasActiveFilters =
    filters.search || filters.category || filters.medicineType;

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response.success) {
          setCategories(response.data.categories);
          setMedicineTypes(response.data.medicineTypes);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getProducts(filters);

        if (response.success) {
          setProducts(response.data);
          setTotalPages(response.totalPages);
          setTotalProducts(response.total);
        } else {
          setError("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Error fetching products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    updateFilter(key, value);
  };

  const handlePageChange = (newPage) => {
    updateFilter("page", newPage);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const { addToCart, loading: cartLoading } = useCart();

  const handleAddToCart = async (product, purchaseType, quantity = 1) => {
    try {
      const success = await addToCart(product._id, quantity, purchaseType);
      if (success) {
        // Success toast is already shown by the cart context
        console.log("Successfully added to cart:", { product: product.name, purchaseType, quantity });
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
      // Error toast is already shown by the cart context
    }
  };

  const ProductCard = ({ product }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const unitPrice = product.allowUnitSale
      ? (product.price / product.unitsPerStrip).toFixed(2)
      : null;
    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

    return (
      <article
        className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-3 sm:p-4 border border-gray-100 hover:border-blue-200 relative overflow-hidden"
        itemScope
        itemType="https://schema.org/Product"
      >
        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-all duration-200"
        >
          <Heart
            size={14}
            className={`${
              isFavorite ? "text-red-500 fill-current" : "text-gray-400"
            } hover:text-red-500 transition-colors`}
          />
        </button>

        {/* Product Image */}
        <div className="relative h-32 sm:h-40 bg-gray-50 rounded-md mb-3 flex items-center justify-center overflow-hidden group/image">
          {product.images && product.images.length > 0 ? (
            <img
              src={`${API_BASE_URL}${product.images[0]}`}
              alt={`${product.name} by ${product.brand} - ${product.category} medicine available at FixPharmacy`}
              title={`Buy ${product.name} online - Rs. ${product.price}`}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              itemProp="image"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : (
            <div className="text-gray-400 text-center flex flex-col items-center justify-center h-full w-full">
              <Package
                size={40}
                className="sm:w-14 sm:h-14 mb-2 sm:mb-3 text-gray-400"
              />
              <p className="text-xs sm:text-sm font-medium">No Image Available</p>
            </div>
          )}
          <div className="text-gray-400 text-center flex-col items-center justify-center h-full w-full" style={{display: 'none'}}>
            <Package
              size={40}
              className="sm:w-14 sm:h-14 mb-2 sm:mb-3 text-gray-400"
            />
            <p className="text-xs sm:text-sm font-medium">Image not found</p>
          </div>

          {/* View Details Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              onClick={() => navigate(`/product/${product._id}`)}
              className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <Eye size={16} />
              <span>View Details</span>
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-2.5">
          {/* Medicine Type & Category */}
          <div className="flex items-center justify-between flex-wrap gap-1.5">
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center space-x-1 ${
                product.medicineType === "Prescription"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {product.medicineType === "Prescription" && (
                <AlertCircle size={10} />
              )}
              <span>{product.medicineType}</span>
            </span>
            <span className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">
              {product.category}
            </span>
          </div>

          {/* Product Name & Description */}
          <div className="space-y-1.5">
            <h3
              className="font-semibold text-sm leading-tight line-clamp-2 text-gray-900 cursor-pointer transition-colors"
              onClick={() => navigate(`/product/${product._id}`)}
              itemProp="name"
              onMouseEnter={(e) => {
                e.target.style.color = "#4CAF50";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "#111827"; // text-gray-900
              }}
            >
              {product.name}
            </h3>
            {product.description && (
              <p
                className="text-xs text-gray-600 line-clamp-1 leading-relaxed"
                itemProp="description"
              >
                {product.description}
              </p>
            )}
          </div>

          {/* Pricing */}
          <div
            className="bg-gray-50 rounded-md p-2.5 space-y-1.5"
            itemProp="offers"
            itemScope
            itemType="https://schema.org/Offer"
          >
            {/* Main Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline space-x-1">
                <span
                  className="text-lg font-bold text-gray-900"
                  itemProp="price"
                  content={product.price}
                >
                  Rs. {product.price}
                </span>
                <span className="text-xs text-gray-600">
                  /{" "}
                  {product.productType === "tablet" ||
                  product.productType === "capsule"
                    ? "strip"
                    : product.productType === "syrup"
                    ? "bottle"
                    : "unit"}
                </span>
                <meta itemProp="priceCurrency" content="NPR" />
                <meta
                  itemProp="availability"
                  content={
                    product.availableStock > 0
                      ? "https://schema.org/InStock"
                      : "https://schema.org/OutOfStock"
                  }
                />
              </div>
            </div>
            
            {/* Secondary Info Row */}
            <div className="flex items-center justify-between">
              {unitPrice ? (
                <span className="text-xs text-gray-700">
                  <span className="font-medium">Rs. {unitPrice}</span> per{" "}
                  {product.productType}
                </span>
              ) : (
                <span className="text-xs text-gray-500">
                  {product.productType === "syrup" 
                    ? "1 bottle" 
                    : `${product.unitsPerStrip} per ${product.productType === "tablet" || product.productType === "capsule" ? "strip" : "package"}`}
                </span>
              )}
              
              {product.medicineType === "Prescription" && (
                <span className="text-xs text-red-600 flex items-center">
                  <AlertCircle size={10} className="mr-1" />
                  Rx Required
                </span>
              )}
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center justify-between py-1.5">
            <div className="flex items-center space-x-1.5">
              <div
                className={`w-2 h-2 rounded-full ${
                  product.availableStock > 10
                    ? "bg-green-500"
                    : product.availableStock > 0
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              ></div>
              <span className="text-xs font-medium text-gray-700">
                {product.availableStock > 10
                  ? "In Stock"
                  : product.availableStock > 0
                  ? `Only ${product.availableStock} left`
                  : "Out of Stock"}
              </span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Clock size={10} className="mr-1" />
              Fast Delivery
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => handleAddToCart(product, "package")}
            disabled={product.availableStock === 0 || cartLoading}
            className={`w-full py-2.5 px-3 rounded-md text-xs font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
              product.availableStock === 0 || cartLoading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "text-white shadow-sm hover:shadow-md cursor-pointer"
            }`}
            style={product.availableStock === 0 || cartLoading ? {} : {
              backgroundColor: "#4A90E2",
            }}
            onMouseEnter={(e) => {
              if (product.availableStock > 0 && !cartLoading) {
                e.target.style.backgroundColor = "#3A7BC8";
              }
            }}
            onMouseLeave={(e) => {
              if (product.availableStock > 0 && !cartLoading) {
                e.target.style.backgroundColor = "#4A90E2";
              }
            }}
          >
            <ShoppingCart size={14} />
            <span>
              {cartLoading ? "Adding..." : "Add to Cart"}
            </span>
          </button>
        </div>
      </article>
    );
  };

  // Generate dynamic title based on current state (must be before conditional returns)
  const dynamicTitle = generateDynamicTitle({
    page: "catalog",
    search: filters.search,
    category: filters.category,
    medicineType: filters.medicineType,
    isLoading: loading,
    resultCount: totalProducts,
    hasResults: products.length > 0,
  });

  // Update document title in real-time (hook must be called at top level)
  useDynamicTitle(dynamicTitle);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg max-w-sm w-full">
          <AlertCircle
            size={48}
            className="sm:w-16 sm:h-16 text-red-500 mx-auto mb-4"
          />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            Error Loading Products
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg sm:rounded-xl hover:bg-blue-700 font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Generate dynamic SEO data based on filters
  const generateSEOData = () => {
    let title = dynamicTitle;
    let description =
      "Shop authentic medicines online at FixPharmacy. Fast delivery, licensed pharmacy, prescription and OTC medicines available in Biratnagar, Nepal.";
    let keywords =
      "buy medicines online Nepal, online pharmacy Biratnagar, prescription medicines delivery, OTC medicines Nepal, authentic medicines, fast pharmacy delivery";

    if (hasActiveFilters) {
      if (filters.search) {
        description = `Find ${filters.search} and other medicines at FixPharmacy. Authentic products with fast delivery in Biratnagar, Nepal.`;
        keywords = `${filters.search}, ${filters.search} online, buy ${filters.search} Nepal, ${keywords}`;
      }

      if (filters.category) {
        description = `Browse ${filters.category} medicines at FixPharmacy. Licensed pharmacy with authentic ${filters.category} products and fast delivery.`;
        keywords = `${filters.category} medicines Nepal, ${filters.category} online pharmacy, ${keywords}`;
      }

      if (filters.medicineType) {
        description = `Buy ${filters.medicineType} medicines online at FixPharmacy. Licensed pharmacy with fast delivery in Biratnagar, Nepal.`;
        keywords = `${filters.medicineType} medicines Nepal, ${filters.medicineType} online, ${keywords}`;
      }
    }

    // Structured data for product listings
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: title,
      description: description,
      url: "https://fixpharmacy.com/",
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: totalProducts,
        itemListElement: products.slice(0, 10).map((product, index) => ({
          "@type": "Product",
          position: index + 1,
          name: product.name,
          description: product.description,
          brand: {
            "@type": "Brand",
            name: product.brand,
          },
          category: product.category,
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "NPR",
            availability: product.availableStock > 0 ? "InStock" : "OutOfStock",
            seller: {
              "@type": "Organization",
              name: "FixPharmacy",
            },
          },
        })),
      },
      provider: {
        "@type": "Pharmacy",
        name: "FixPharmacy",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Bargachhi Chowk",
          addressLocality: "Biratnagar",
          addressCountry: "NP",
        },
      },
    };

    return { title, description, keywords, structuredData };
  };

  const seoData = generateSEOData();

  return (
    <>
      <SEO
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonical="https://fixpharmacy.com/"
        structuredData={seoData.structuredData}
      />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
          {/* Compact Filters Bar */}
          {hasActiveFilters && (
            <section
              className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6 p-4 overflow-hidden"
              aria-label="Active filters"
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center space-x-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-600">Filters:</span>
                  
                  {/* Active Filter Pills */}
                  {filters.search && (
                    <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      <Search size={12} className="mr-1" />
                      <span>"{filters.search}"</span>
                      <button
                        onClick={() => handleFilterChange("search", "")}
                        className="ml-2 hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                  
                  {filters.category && (
                    <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      <span>{filters.category}</span>
                      <button
                        onClick={() => handleFilterChange("category", "")}
                        className="ml-2 hover:bg-green-200 rounded-full p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                  
                  {filters.medicineType && (
                    <div className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                      <span>{filters.medicineType}</span>
                      <button
                        onClick={() => handleFilterChange("medicineType", "")}
                        className="ml-2 hover:bg-purple-200 rounded-full p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Clear All Button */}
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-red-600 font-medium"
                >
                  Clear All
                </button>
              </div>
            </section>
          )}


          {/* Results Header - Only show count when filters are active */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                <span className="text-blue-600">{totalProducts}</span> Products
                Found
                {filters.search && (
                  <span className="block text-sm sm:text-base font-normal text-gray-600 mt-1">
                    for "{filters.search}"
                  </span>
                )}
              </h2>
              <div className="text-xs sm:text-sm text-gray-600 bg-white px-2 sm:px-3 py-1 sm:py-2 rounded-full border">
                Page {filters.page} of {totalPages}
              </div>
            </div>
          )}

          {/* Show simple header when no filters are active */}
          {!hasActiveFilters && (
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Our Products
              </h2>
              {totalPages > 1 && (
                <div className="text-xs sm:text-sm text-gray-600 bg-white px-2 sm:px-3 py-1 sm:py-2 rounded-full border">
                  Page {filters.page} of {totalPages}
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {[...Array(10)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm p-3 animate-pulse"
                >
                  <div className="h-32 sm:h-40 bg-gray-200 rounded-md mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Products Grid */}
              {products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12 bg-white rounded-lg shadow-sm">
                  <Package size={48} className="text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    No Products Found
                  </h3>
                  <p className="text-sm text-gray-600">
                    Try adjusting your search criteria
                  </p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-1 sm:space-x-2 px-4">
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    className="px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-200 hover:text-blue-600 transition-colors"
                  >
                    Previous
                  </button>

                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    const isCurrentPage = page === filters.page;

                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-2.5 sm:px-3 py-2 text-xs font-medium rounded-md transition-all ${
                          isCurrentPage
                            ? "bg-blue-600 text-white"
                            : "text-gray-600 bg-white border border-gray-200 hover:border-blue-200 hover:text-blue-600"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page === totalPages}
                    className="px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-200 hover:text-blue-600 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default ProductCatalog;
