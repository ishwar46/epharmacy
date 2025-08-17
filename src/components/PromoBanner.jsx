import React from 'react';
import { ArrowRight, Percent, Truck, Clock, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PromoBanner = () => {
  const navigate = useNavigate();

  const promos = [
    {
      id: 1,
      title: "Free Delivery",
      subtitle: "On orders above Rs. 500",
      description: "Get your medicines delivered free across Biratnagar",
      icon: Truck,
      bgColor: "bg-gradient-to-r from-green-500 to-green-600",
      ctaText: "Shop Now",
      ctaAction: () => navigate('/')
    },
    {
      id: 2,
      title: "24/7 Emergency",
      subtitle: "Urgent medicine delivery",
      description: "Emergency medicines available round the clock",
      icon: Clock,
      bgColor: "bg-gradient-to-r from-red-500 to-red-600",
      ctaText: "Call Now",
      ctaAction: () => window.open('tel:+977-1-4445566')
    },
    {
      id: 3,
      title: "Licensed Pharmacy",
      subtitle: "100% Authentic medicines",
      description: "Certified pharmacy with genuine products",
      icon: Shield,
      bgColor: "bg-gradient-to-r from-blue-500 to-blue-600",
      ctaText: "Learn More",
      ctaAction: () => navigate('/about')
    }
  ];

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Promo Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl sm:rounded-2xl text-white p-6 sm:p-8 lg:p-12 mb-6 sm:mb-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-30 translate-y-30"></div>
          </div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            {/* Content */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center space-x-2">
                <Percent size={24} className="text-yellow-300" />
                <span className="bg-yellow-300 text-purple-900 px-3 py-1 rounded-full text-sm font-semibold">
                  Special Offer
                </span>
              </div>
              
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
                  Get Up to 20% Off
                </h2>
                <p className="text-lg sm:text-xl text-purple-100 leading-relaxed">
                  On your first order of prescription medicines. Upload your prescription 
                  and save on authentic medications.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => navigate('/prescriptions')}
                  className="inline-flex items-center justify-center space-x-2 bg-white text-purple-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  <span>Upload Prescription</span>
                  <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center justify-center space-x-2 border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-700 transition-colors"
                >
                  <span>Browse Medicines</span>
                </button>
              </div>
            </div>
            
            {/* Image/Illustration */}
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
                <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-6xl">💊</span>
                </div>
                <p className="text-purple-100 font-medium">
                  Trusted by 1000+ customers
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {promos.map((promo) => (
            <div
              key={promo.id}
              className={`${promo.bgColor} rounded-lg sm:rounded-xl text-white p-4 sm:p-6 cursor-pointer transform hover:scale-105 transition-transform duration-200`}
              onClick={promo.ctaAction}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <promo.icon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base">{promo.title}</h3>
                  <p className="text-xs sm:text-sm opacity-90">{promo.subtitle}</p>
                </div>
              </div>
              
              <p className="text-xs sm:text-sm opacity-90 mb-3 leading-relaxed">
                {promo.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium">{promo.ctaText}</span>
                <ArrowRight size={16} className="opacity-75" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;