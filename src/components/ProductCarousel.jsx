import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, Heart, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const ProductCarousel = ({ 
  title = "Featured Products", 
  products = [], 
  showViewAll = true,
  viewAllLink = "/",
  loading = false 
}) => {
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  const { addToCart, loading: cartLoading } = useCart();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product._id, 1, "package");
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const cardWidth = 280; // Approximate card width + gap
      const scrollAmount = direction === 'left' ? -cardWidth * 2 : cardWidth * 2;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const ProductCard = ({ product }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    
    return (
      <div className="flex-shrink-0 w-64 sm:w-72 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-200 p-4">
        {/* Product Image */}
        <div className="relative h-40 sm:h-48 bg-gray-50 rounded-md mb-3 flex items-center justify-center overflow-hidden group">
          {product.images && product.images.length > 0 ? (
            <img
              src={`${API_BASE_URL}${product.images[0]}`}
              alt={product.name}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="text-gray-400 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl">💊</span>
              </div>
              <p className="text-xs">No Image</p>
            </div>
          )}
          
          {/* Favorite Button */}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-all duration-200"
          >
            <Heart
              size={14}
              className={`${
                isFavorite ? "text-red-500 fill-current" : "text-gray-400"
              } hover:text-red-500 transition-colors`}
            />
          </button>

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              onClick={() => navigate(`/product/${product._id}`)}
              className="bg-white text-gray-900 px-3 py-1.5 rounded-md font-medium text-sm hover:bg-gray-100 transition-colors"
            >
              Quick View
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          {/* Category & Type */}
          <div className="flex items-center justify-between">
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                product.medicineType === "Prescription"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {product.medicineType}
            </span>
            <span className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">
              {product.category}
            </span>
          </div>

          {/* Product Name */}
          <h3
            className="font-semibold text-sm leading-tight line-clamp-2 text-gray-900 cursor-pointer transition-colors"
            onClick={() => navigate(`/product/${product._id}`)}
            onMouseEnter={(e) => {
              e.target.style.color = "#4CAF50";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "#111827";
            }}
          >
            {product.name}
          </h3>

          {/* Rating (Mock for now) */}
          <div className="flex items-center space-x-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={`${
                    i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">(4.2)</span>
          </div>

          {/* Price */}
          <div className="bg-gray-50 rounded-md p-2">
            <div className="flex items-baseline space-x-1">
              <span className="text-lg font-bold text-gray-900">
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
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => handleAddToCart(product)}
            disabled={product.availableStock === 0 || cartLoading}
            className={`w-full py-2 px-3 rounded-md text-xs font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
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
            <span>{cartLoading ? "Adding..." : "Add to Cart"}</span>
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
          <div className="flex space-x-4 overflow-hidden">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex-shrink-0 w-64 sm:w-72 bg-white rounded-lg shadow-sm p-4 animate-pulse">
                <div className="h-40 sm:h-48 bg-gray-200 rounded-md mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            {title}
          </h2>
          {showViewAll && (
            <button
              onClick={() => navigate(viewAllLink)}
              className="inline-flex items-center space-x-2 text-sm font-medium hover:opacity-75 transition-opacity"
              style={{ color: "#4A90E2" }}
            >
              <span>View All</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex space-x-4 sm:space-x-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Navigation Arrows */}
          {products.length > 3 && (
            <>
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white shadow-lg border border-gray-200 p-2 rounded-full hover:bg-gray-50 transition-colors z-10"
                aria-label="Previous products"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white shadow-lg border border-gray-200 p-2 rounded-full hover:bg-gray-50 transition-colors z-10"
                aria-label="Next products"
              >
                <ChevronRight size={20} className="text-gray-600" />
              </button>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default ProductCarousel;