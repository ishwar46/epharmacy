import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Shield, Truck, Clock } from 'lucide-react';

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Authentic Medicines",
      subtitle: "Licensed & Trusted",
      description: "Get 100% authentic medicines delivered to your doorstep with our licensed pharmacy in Biratnagar, Nepal.",
      image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      ctaText: "Shop Now",
      ctaLink: "#products",
      bgGradient: "from-blue-600 to-blue-800"
    },
    {
      id: 2,
      title: "Fast Delivery",
      subtitle: "24/7 Service",
      description: "Quick and reliable medicine delivery across Biratnagar. Emergency medicines available round the clock.",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      ctaText: "Order Now",
      ctaLink: "#products",
      bgGradient: "from-green-600 to-green-800"
    },
    {
      id: 3,
      title: "Prescription Care",
      subtitle: "Expert Guidance",
      description: "Upload your prescription and get expert consultation. Safe, secure, and confidential medicine ordering.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      ctaText: "Upload Prescription",
      ctaLink: "/prescriptions",
      bgGradient: "from-purple-600 to-purple-800"
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "100% Authentic",
      description: "Licensed pharmacy with genuine medicines"
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Quick delivery across Biratnagar"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round the clock customer service"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative bg-gray-50 overflow-hidden">
      {/* Main Carousel */}
      <div className="relative h-[400px] sm:h-[500px] lg:h-[600px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} opacity-80`}></div>
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

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Features Bar */}
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <feature.icon size={24} className="text-blue-600" />
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;