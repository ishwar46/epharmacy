import React from "react";
import { ShieldCheck, Truck, Phone, Stethoscope } from "lucide-react";

const TrustIndicators = () => {
  const features = [
    {
      title: "Licensed Pharmacy",
      description: "Certified and regulated with genuine, approved medicines.",
      icon: ShieldCheck,
    },
    {
      title: "Fast Delivery",
      description:
        "Quick doorstep delivery across Biratnagar and nearby areas.",
      icon: Truck,
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock customer service and emergency help.",
      icon: Phone,
    },
    {
      title: "Expert Guidance",
      description: "Professional pharmacist advice and prescription care.",
      icon: Stethoscope,
    },
  ];

  return (
    <section className="py-10 sm:py-14 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Why Choose FixPharmacy?
          </h2>
          <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Your trusted healthcare partner in Biratnagar, Nepal
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 text-green-700 mb-4">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;
