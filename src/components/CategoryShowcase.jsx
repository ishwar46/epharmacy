import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Pill,
  Heart,
  Shield,
  Thermometer,
  Baby,
  Eye,
} from "lucide-react";

const CategoryShowcase = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: 1,
      name: "Pain Relief",
      description: "Headache, body pain & fever relief",
      icon: Pill,
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      color: "from-blue-500 to-blue-600",
      count: "50+ products",
    },
    {
      id: 2,
      name: "Heart & Blood",
      description: "Cardiovascular health medicines",
      icon: Heart,
      image:
        "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      color: "from-red-500 to-red-600",
      count: "30+ products",
    },
    {
      id: 3,
      name: "Vitamins",
      description: "Essential vitamins & supplements",
      icon: Shield,
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      color: "from-green-500 to-green-600",
      count: "40+ products",
    },
    {
      id: 4,
      name: "Cold & Flu",
      description: "Cough, cold & respiratory care",
      icon: Thermometer,
      image:
        "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      color: "from-purple-500 to-purple-600",
      count: "25+ products",
    },
    {
      id: 5,
      name: "Baby Care",
      description: "Safe medicines for children",
      icon: Baby,
      image:
        "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      color: "from-pink-500 to-pink-600",
      count: "20+ products",
    },
    {
      id: 6,
      name: "Eye Care",
      description: "Eye drops & vision care",
      icon: Eye,
      image:
        "https://images.unsplash.com/photo-1582560975906-72bb5d3d5b2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      color: "from-indigo-500 to-indigo-600",
      count: "15+ products",
    },
  ];

  const handleCategoryClick = (categoryName) => {
    navigate(`/?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              className="group relative bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
            >
              {/* Background Image */}
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-70 group-hover:opacity-80 transition-opacity duration-300`}
                ></div>

                {/* Category Icon */}
                <div className="absolute top-4 left-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <category.icon
                      size={20}
                      className="sm:w-6 sm:h-6 text-white"
                    />
                  </div>
                </div>

                {/* Product Count */}
                <div className="absolute top-4 right-4">
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
                  {category.description}
                </p>

                {/* CTA */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    Explore Products
                  </span>
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <ArrowRight
                      size={16}
                      className="text-gray-600 group-hover:translate-x-0.5 transition-transform"
                    />
                  </div>
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-xl sm:rounded-2xl transition-all duration-300"></div>
            </div>
          ))}
        </div>

        {/* View All Categories Button */}
        <div className="text-center mt-8 sm:mt-12">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center space-x-2 bg-white text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-sm border border-gray-200"
          >
            <span>View All Categories</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
