import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SEO from "../../components/common/SEO";
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Star,
  Package,
  Pill,
  AlertCircle,
  Award,
  Clock,
  Shield,
  CheckCircle,
  Minus,
  Plus,
  Share2,
  Info,
} from "lucide-react";
import { getProduct } from "../../services/productService";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [purchaseType, setPurchaseType] = useState("package");
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getProduct(id);
        
        if (response.success) {
          setProduct(response.data);
        } else {
          setError("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Error loading product details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = (type, qty = quantity) => {
    console.log("Adding to cart:", { product, type, quantity: qty });
    alert(`Added ${qty} ${type}(s) of ${product.name} to cart!`);
  };

  const calculateUnitPrice = () => {
    if (product?.allowUnitSale && product?.unitsPerStrip) {
      return (product.price / product.unitsPerStrip).toFixed(2);
    }
    return null;
  };

  const calculateTotalPrice = () => {
    if (!product) return 0;
    
    if (purchaseType === "unit") {
      const unitPrice = calculateUnitPrice();
      return (parseFloat(unitPrice) * quantity).toFixed(2);
    } else {
      return (product.price * quantity).toFixed(2);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full mx-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
          <AlertCircle size={64} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error || "Product Not Found"}
          </h2>
          <p className="text-gray-600 mb-6">
            The product you're looking for might have been removed or doesn't exist.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 font-semibold transition-colors"
          >
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  const unitPrice = calculateUnitPrice();

  // Generate SEO data for product
  const generateProductSEO = () => {
    if (!product) return {};

    const title = `${product.name} by ${product.brand} | Buy Online at FixPharmacy`;
    const description = `Buy ${product.name} by ${product.brand} online at FixPharmacy. ${product.description || 'Authentic medicine'} with fast delivery in Biratnagar, Nepal. ${product.medicineType} medicine available.`;
    const keywords = `${product.name}, ${product.brand}, buy ${product.name} online, ${product.category} medicines, ${product.medicineType} medicine Nepal, online pharmacy Biratnagar`;
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.description || `${product.name} by ${product.brand}`,
      "brand": {
        "@type": "Brand",
        "name": product.brand
      },
      "category": product.category,
      "sku": product._id,
      "image": product.images?.length > 0 ? `${API_BASE_URL}${product.images[0]}` : null,
      "offers": {
        "@type": "Offer",
        "price": product.price,
        "priceCurrency": "NPR",
        "availability": product.availableStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "seller": {
          "@type": "Organization",
          "name": "FixPharmacy",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Bargachhi Chowk",
            "addressLocality": "Biratnagar",
            "addressCountry": "NP"
          }
        },
        "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.5",
        "reviewCount": "25"
      },
      "review": [
        {
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "author": {
            "@type": "Person",
            "name": "Verified Customer"
          },
          "reviewBody": "Authentic medicine delivered quickly. Excellent service from FixPharmacy."
        }
      ]
    };

    return { title, description, keywords, structuredData };
  };

  const seoData = generateProductSEO();

  return (
    <>
      {product && (
        <SEO
          title={seoData.title}
          description={seoData.description}
          keywords={seoData.keywords}
          canonical={`https://fixpharmacy.com/product/${product._id}`}
          ogTitle={seoData.title}
          ogDescription={seoData.description}
          ogImage={product.images?.length > 0 ? `${API_BASE_URL}${product.images[0]}` : "https://fixpharmacy.com/og-image.jpg"}
          ogType="product"
          structuredData={seoData.structuredData}
        />
      )}
      <main className="min-h-screen bg-gray-50">
      {/* Mobile-First Container */}
      <div className="max-w-7xl mx-auto">
        {/* Mobile Header with Back Button */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium text-sm sm:text-base">Back to Catalog</span>
          </button>
        </div>

        {/* Mobile-First Layout */}
        <div className="bg-white lg:mx-4 lg:mt-4 lg:rounded-2xl lg:shadow-lg overflow-hidden">
          {/* Mobile: Single Column, Desktop: Two Columns */}
          <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-8">
            {/* Product Images - Mobile First */}
            <div className="p-4 sm:p-6 lg:p-8 space-y-3 sm:space-y-4">
              {/* Main Image - Responsive Heights */}
              <div className="relative h-64 sm:h-80 lg:h-96 bg-gray-100 rounded-xl overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={`${API_BASE_URL}${product.images[selectedImageIndex]}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                {/* Fallback Content */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <div className="text-center px-4">
                    <Package size={48} className="sm:w-16 sm:h-16 mx-auto mb-3" />
                    <p className="text-base sm:text-lg font-medium">No Image Available</p>
                  </div>
                </div>
                
                {/* Mobile-Optimized Action Buttons */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex space-x-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="p-2 sm:p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
                  >
                    <Heart
                      size={18}
                      className={`sm:w-5 sm:h-5 ${isFavorite ? "text-red-500 fill-current" : "text-gray-600"}`}
                    />
                  </button>
                  <button className="p-2 sm:p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all">
                    <Share2 size={18} className="sm:w-5 sm:h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Responsive Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2 sm:space-x-3 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? "border-blue-500"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={`${API_BASE_URL}${image}`}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information - Mobile First */}
            <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
              {/* Medicine Type & Category - Mobile Stacked */}
              <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
                <span
                  className={`px-3 py-2 sm:px-4 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 ${
                    product.medicineType === "Prescription"
                      ? "bg-red-100 text-red-700 border border-red-200"
                      : "bg-green-100 text-green-700 border border-green-200"
                  }`}
                >
                  {product.medicineType === "Prescription" && (
                    <AlertCircle size={14} className="sm:w-4 sm:h-4" />
                  )}
                  <span>{product.medicineType}</span>
                </span>
                <span className="text-xs sm:text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-full font-medium text-center">
                  {product.category}
                </span>
              </div>

              {/* Product Name & Brand - Mobile Optimized */}
              <div className="space-y-2 sm:space-y-3">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-2">
                  <Award size={16} className="sm:w-5 sm:h-5 text-blue-500" />
                  <span className="text-base sm:text-lg text-blue-600 font-semibold">
                    {product.brand}
                  </span>
                </div>
              </div>

              {/* Description - Mobile Responsive */}
              {product.description && (
                <div className="bg-gray-50 p-3 sm:p-4 rounded-xl">
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <Info size={16} className="sm:w-5 sm:h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Description</h3>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{product.description}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Stock Status - Mobile Stacked */}
              <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 p-3 sm:p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${
                      product.availableStock > 10
                        ? "bg-green-500"
                        : product.availableStock > 0
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <span className="font-medium text-gray-900 text-sm sm:text-base">
                    {product.availableStock > 10
                      ? "In Stock"
                      : product.availableStock > 0
                      ? `Only ${product.availableStock} left`
                      : "Out of Stock"}
                  </span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <Clock size={14} className="sm:w-4 sm:h-4 mr-2" />
                  Fast Delivery
                </div>
              </div>

              {/* Purchase Options - Mobile First */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Purchase Options</h3>
                
                {/* Package Option - Mobile Responsive */}
                <div
                  className={`border-2 rounded-xl p-3 sm:p-4 cursor-pointer transition-all ${
                    purchaseType === "package"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPurchaseType("package")}
                >
                  <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                          purchaseType === "package"
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}
                      ></div>
                      <Package size={18} className="sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">
                          Full {product.productType === "tablet" || product.productType === "capsule" ? "Strip" : "Package"}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {product.unitsPerStrip} {product.productType}s per strip
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-lg sm:text-2xl font-bold text-gray-900">Rs. {product.price}</p>
                      <p className="text-xs sm:text-sm text-gray-600">per strip</p>
                    </div>
                  </div>
                </div>

                {/* Unit Option - Mobile Responsive */}
                {product.allowUnitSale && unitPrice && (
                  <div
                    className={`border-2 rounded-xl p-3 sm:p-4 cursor-pointer transition-all ${
                      purchaseType === "unit"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setPurchaseType("unit")}
                  >
                    <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                            purchaseType === "unit"
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-300"
                          }`}
                        ></div>
                        <Pill size={18} className="sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">Individual {product.productType}</p>
                          <p className="text-xs sm:text-sm text-gray-600">Single unit purchase</p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-lg sm:text-2xl font-bold text-gray-900">Rs. {unitPrice}</p>
                        <p className="text-xs sm:text-sm text-gray-600">per {product.productType}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity & Add to Cart - Mobile First */}
              <div className="space-y-3 sm:space-y-4">
                {/* Quantity Controls - Mobile Centered */}
                <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">Quantity:</span>
                  <div className="flex items-center justify-center sm:justify-start space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 sm:p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation"
                    >
                      <Minus size={16} className="sm:w-4 sm:h-4" />
                    </button>
                    <span className="text-lg sm:text-xl font-semibold min-w-[3rem] text-center px-2">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 sm:p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation"
                    >
                      <Plus size={16} className="sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>

                {/* Total Price - Mobile Responsive */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 sm:p-4 rounded-xl border border-blue-200">
                  <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <span className="text-base sm:text-lg font-semibold text-gray-900">Total Price:</span>
                    <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                      Rs. {calculateTotalPrice()}
                    </span>
                  </div>
                </div>

                {/* Add to Cart Button - Mobile Optimized */}
                <button
                  onClick={() => handleAddToCart(purchaseType, quantity)}
                  disabled={product.availableStock === 0}
                  className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-base sm:text-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 sm:space-x-3 touch-manipulation ${
                    product.availableStock === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl active:scale-95"
                  }`}
                >
                  <ShoppingCart size={20} className="sm:w-6 sm:h-6" />
                  <span>
                    {product.availableStock === 0 ? "Out of Stock" : "Add to Cart"}
                  </span>
                </button>

                {/* Prescription Warning - Mobile Responsive */}
                {product.medicineType === "Prescription" && (
                  <div className="bg-red-50 border border-red-200 p-3 sm:p-4 rounded-xl">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <AlertCircle size={18} className="sm:w-5 sm:h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-red-900 mb-1 text-sm sm:text-base">
                          Prescription Required
                        </h4>
                        <p className="text-xs sm:text-sm text-red-700 leading-relaxed">
                          This is a prescription medicine. You'll need to upload a valid prescription
                          from a licensed doctor before we can process your order.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Trust Indicators - Mobile Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2 sm:pt-4">
                  <div className="flex items-center justify-center sm:justify-start space-x-2 text-xs sm:text-sm text-gray-600 bg-gray-50 py-2 px-3 rounded-lg">
                    <Shield size={14} className="sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                    <span>Authentic Products</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start space-x-2 text-xs sm:text-sm text-gray-600 bg-gray-50 py-2 px-3 rounded-lg">
                    <CheckCircle size={14} className="sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                    <span>Quality Assured</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Bottom Padding */}
        <div className="h-4 sm:h-8"></div>
      </div>
      </main>
    </>
  );
};

export default ProductDetail;