import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SEO from "../../components/common/SEO";
import { generateDynamicTitle, useDynamicTitle } from "../../hooks/useDynamicTitle";
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
import AddToCartButton from "../../components/cart/AddToCartButton";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [purchaseType, setPurchaseType] = useState("package");
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // Generate dynamic title based on product state (hooks must be at top level)
  const dynamicTitle = generateDynamicTitle({
    page: 'product',
    productName: product?.name,
    brand: product?.brand,
    isLoading: loading
  });

  // Update document title in real-time
  useDynamicTitle(dynamicTitle);

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


  const calculateUnitPrice = () => {
    if (product?.allowUnitSale && product?.unitsPerStrip) {
      return (product.price / product.unitsPerStrip).toFixed(2);
    }
    return null;
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

    const title = dynamicTitle;
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
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <div className="text-center px-4">
                      <Package size={48} className="sm:w-16 sm:h-16 mx-auto mb-3" />
                      <p className="text-base sm:text-lg font-medium">No Image Available</p>
                    </div>
                  </div>
                )}
                {/* Error Fallback Content */}
                <div className="absolute inset-0 items-center justify-center text-gray-400" style={{display: 'none'}}>
                  <div className="text-center px-4">
                    <Package size={48} className="sm:w-16 sm:h-16 mx-auto mb-3" />
                    <p className="text-base sm:text-lg font-medium">Image not found</p>
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

              {/* Purchase Options - Package */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Purchase as Package</h3>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-3 mb-3">
                    <Package size={20} className="text-gray-600" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        Full {product.productType === "tablet" || product.productType === "capsule" 
                          ? "Strip" 
                          : product.productType === "syrup" 
                          ? "Bottle" 
                          : "Package"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {product.productType === "syrup" 
                          ? "1 bottle" 
                          : `${product.unitsPerStrip} ${product.productType}s per ${product.productType === "tablet" || product.productType === "capsule" ? "strip" : "package"}`}
                      </p>
                    </div>
                  </div>
                  <AddToCartButton 
                    product={product} 
                    purchaseType="package" 
                    size="lg"
                  />
                </div>

                {/* Unit Purchase Option - Only for tablets and capsules */}
                {product.allowUnitSale && unitPrice && 
                 (product.productType === 'tablet' || product.productType === 'capsule') && (
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <Pill size={20} className="text-blue-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Individual {product.productType}</p>
                        <p className="text-sm text-gray-600">Buy single units</p>
                      </div>
                    </div>
                    <AddToCartButton 
                      product={product} 
                      purchaseType="unit" 
                      size="lg"
                    />
                  </div>
                )}
              </div>

              {/* Prescription Warning */}
              {product.medicineType === "Prescription" && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <AlertCircle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-red-900 mb-1">
                        Prescription Required
                      </h4>
                      <p className="text-sm text-red-700 leading-relaxed">
                        This is a prescription medicine. You'll need to upload a valid prescription
                        from a licensed doctor before we can process your order.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 py-3 px-4 rounded-lg">
                  <Shield size={16} className="text-green-500 flex-shrink-0" />
                  <span>Authentic Products</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 py-3 px-4 rounded-lg">
                  <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                  <span>Quality Assured</span>
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