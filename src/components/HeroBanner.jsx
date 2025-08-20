import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Shield,
  Truck,
  Clock,
  Heart,
  Award,
  Phone,
  Mail,
  MapPin,
  Package,
  Pill,
  Stethoscope,
} from "lucide-react";
import { getHeroBannerData } from "../services/heroBannerService";

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [features, setFeatures] = useState([]);
  const [config, setConfig] = useState({
    slideDuration: 5000,
    autoplay: true,
    showArrows: true,
    showIndicators: true,
  });
  const [loading, setLoading] = useState(true);

  // Icon mapping for features
  const iconComponents = {
    Shield,
    Truck,
    Clock,
    Heart,
    Award,
    Phone,
    Mail,
    MapPin,
    Package,
    Pill,
    Stethoscope,
  };

  // Fetch hero banner data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getHeroBannerData();
        if (response.success) {
          setSlides(response.data.slides || []);
          setFeatures(response.data.features || []);
          setConfig(
            response.data.config || {
              slideDuration: 5000,
              autoplay: true,
              showArrows: true,
              showIndicators: true,
            }
          );
        }
      } catch (error) {
        console.error("Failed to fetch hero banner data:", error);
        // Use fallback data if API fails
        setSlides([
          {
            _id: 1,
            title: "Authentic Medicines",
            subtitle: "Licensed & Trusted",
            description:
              "Get 100% authentic medicines delivered to your doorstep with our licensed pharmacy in Biratnagar, Nepal.",
            image:
              "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            ctaText: "Shop Now",
            ctaLink: "#products",
            bgGradient: "from-blue-600 to-blue-800",
          },
        ]);
        setFeatures([
          {
            _id: 1,
            icon: "Shield",
            title: "100% Authentic",
            description: "Licensed pharmacy with genuine medicines",
          },
          {
            _id: 2,
            icon: "Truck",
            title: "Fast Delivery",
            description: "Quick delivery across Biratnagar",
          },
          {
            _id: 3,
            icon: "Clock",
            title: "24/7 Support",
            description: "Round the clock customer service",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-play timer
  useEffect(() => {
    if (!config.autoplay || slides.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, config.slideDuration);
    return () => clearInterval(timer);
  }, [slides.length, config.autoplay, config.slideDuration]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (loading) {
    return (
      <section className="relative bg-gray-50 overflow-hidden h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative bg-gray-50 overflow-hidden h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600">
            No banner content available
          </h2>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-gray-50 overflow-hidden">
      {/* Main Carousel */}
      <div className="relative h-[400px] sm:h-[500px] lg:h-[600px]">
        {slides.map((slide, index) => (
          <div
            key={slide._id || slide.id || index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} opacity-80`}
              ></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl">
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <p className="text-sm sm:text-base font-medium text-white/90 mb-2">
                        {slide.subtitle}
                      </p>
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                        {slide.title}
                      </h1>
                    </div>
                    <p className="text-lg sm:text-xl text-white/90 leading-relaxed">
                      {slide.description}
                    </p>
                    <div className="pt-4">
                      <a
                        href={slide.ctaLink}
                        className="inline-flex items-center space-x-2 bg-white text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                      >
                        <span>{slide.ctaText}</span>
                        <ArrowRight size={18} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        {config.showArrows && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full hover:bg-white/30 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full hover:bg-white/30 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight size={20} className="sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Slide Indicators */}
        {config.showIndicators && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Features Bar */}
      {features.length > 0 && (
        <div className="bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div
              className={`grid gap-6 sm:gap-8 ${
                features.length === 1
                  ? "grid-cols-1"
                  : features.length === 2
                  ? "grid-cols-1 sm:grid-cols-2"
                  : features.length === 3
                  ? "grid-cols-1 sm:grid-cols-3"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              }`}
            >
              {features.map((feature, index) => {
                const IconComponent = iconComponents[feature.icon] || Shield;
                return (
                  <div
                    key={feature._id || feature.id || index}
                    className="flex items-center space-x-4"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <IconComponent size={24} className="text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                        {feature.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroBanner;
