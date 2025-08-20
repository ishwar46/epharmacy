import React, { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Shield,
  Award,
  Truck,
  CreditCard,
  Heart,
  Pill,
  Stethoscope,
  Package,
  ChevronUp,
} from "lucide-react";
import { scrollToTop } from "../../utils/scrollUtils";

const Footer = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 sm:gap-8 lg:gap-12">
          {/* Company Info - Mobile First */}
          <div className="sm:col-span-2 xl:col-span-1 space-y-4 lg:space-y-6">
            <div className="flex items-center space-x-3">
              <img
                src="https://i.ibb.co/RGtZpS0q/fixpharmacy.png"
                alt="FixPharmacy"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
              <div>
                <h3
                  className="text-xl sm:text-2xl font-bold"
                  style={{ color: "#4A90E2" }}
                >
                  FixPharmacy
                </h3>
                <p
                  className="text-sm text-slate-300"
                  style={{ color: "#4CAF50" }}
                >
                  Your Health Partner
                </p>
              </div>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Your trusted online pharmacy providing authentic medicines and
              healthcare products with fast delivery across Nepal. Licensed,
              reliable, and committed to your health.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <div className="flex items-center space-x-2 bg-slate-800 px-3 py-2 rounded-full">
                <Shield size={16} className="text-green-400" />
                <span className="text-xs sm:text-sm text-slate-200">
                  Licensed
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-800 px-3 py-2 rounded-full">
                <Award size={16} className="text-blue-400" />
                <span className="text-xs sm:text-sm text-slate-200">
                  Verified
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 lg:space-y-6">
            <h4 className="text-lg sm:text-xl font-semibold text-white">
              Quick Links
            </h4>
            <nav className="space-y-2 sm:space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "Medicines", href: "/medicines", icon: Pill },
                {
                  name: "Health Products",
                  href: "/health-products",
                  icon: Package,
                },
                {
                  name: "Upload Prescription",
                  href: "/prescriptions",
                  icon: Stethoscope,
                },
                { name: "About Us", href: "/about" },
                { name: "Contact", href: "/contact" },
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors text-sm sm:text-base group"
                >
                  {link.icon && (
                    <link.icon
                      size={16}
                      className="text-slate-400 group-hover:text-blue-400 transition-colors"
                    />
                  )}
                  <span className="group-hover:translate-x-1 transition-transform">
                    {link.name}
                  </span>
                </a>
              ))}
            </nav>
          </div>

          {/* Services & Features */}
          <div className="space-y-4 lg:space-y-6">
            <h4 className="text-lg sm:text-xl font-semibold text-white">
              Our Services
            </h4>
            <div className="space-y-3 sm:space-y-4">
              {[
                {
                  icon: Truck,
                  title: "Fast Delivery",
                  desc: "Same day delivery in Biratnagar",
                },
                {
                  icon: CreditCard,
                  title: "Secure Payment",
                  desc: "Multiple payment options",
                },
                {
                  icon: Shield,
                  title: "Authentic Products",
                  desc: "100% genuine medicines",
                },
                {
                  icon: Clock,
                  title: "24/7 Support",
                  desc: "Round the clock assistance",
                },
              ].map((service, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <service.icon
                    size={18}
                    className="text-blue-400 mt-1 flex-shrink-0"
                  />
                  <div>
                    <h5 className="font-medium text-white text-sm sm:text-base">
                      {service.title}
                    </h5>
                    <p className="text-slate-400 text-xs sm:text-sm">
                      {service.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info & Social */}
          <div className="space-y-4 lg:space-y-6">
            <h4 className="text-lg sm:text-xl font-semibold text-white">
              Contact Info
            </h4>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin
                  size={16}
                  className="sm:w-5 sm:h-5 text-blue-400 mt-1 flex-shrink-0"
                />
                <div>
                  <h5 className="font-medium text-white text-sm sm:text-base">
                    Address
                  </h5>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Bargachhi Chowk
                    <br />
                    Biratnagar, Nepal
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone
                  size={16}
                  className="sm:w-5 sm:h-5 text-green-400 mt-1 flex-shrink-0"
                />
                <div>
                  <h5 className="font-medium text-white text-sm sm:text-base">
                    Phone
                  </h5>
                  <a
                    href="tel:+977-1-4445566"
                    className="text-slate-300 hover:text-green-400 transition-colors text-xs sm:text-sm"
                  >
                    +977-1-4445566
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail
                  size={16}
                  className="sm:w-5 sm:h-5 text-purple-400 mt-1 flex-shrink-0"
                />
                <div>
                  <h5 className="font-medium text-white text-sm sm:text-base">
                    Email
                  </h5>
                  <a
                    href="mailto:info@fixpharmacy.com"
                    className="text-slate-300 hover:text-purple-400 transition-colors text-xs sm:text-sm"
                  >
                    info@fixpharmacy.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock
                  size={16}
                  className="sm:w-5 sm:h-5 text-yellow-400 mt-1 flex-shrink-0"
                />
                <div>
                  <h5 className="font-medium text-white text-sm sm:text-base">
                    Hours
                  </h5>
                  <p className="text-slate-300 text-xs sm:text-sm">
                    24/7 Available
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="pt-2 sm:pt-4">
              <h5 className="font-medium text-white mb-3 text-sm sm:text-base">
                Follow Us
              </h5>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {[
                  {
                    icon: Facebook,
                    href: "#",
                    color: "hover:text-blue-500",
                    label: "Facebook",
                  },
                  {
                    icon: Twitter,
                    href: "#",
                    color: "hover:text-sky-400",
                    label: "Twitter",
                  },
                  {
                    icon: Instagram,
                    href: "#",
                    color: "hover:text-pink-500",
                    label: "Instagram",
                  },
                  {
                    icon: Linkedin,
                    href: "#",
                    color: "hover:text-blue-600",
                    label: "LinkedIn",
                  },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`p-2 sm:p-2.5 bg-slate-800 rounded-full text-slate-400 ${social.color} transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-slate-600`}
                    aria-label={social.label}
                  >
                    <social.icon size={16} className="sm:w-5 sm:h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Location Map */}
          <div className="sm:col-span-2 xl:col-span-1 space-y-4 lg:space-y-6">
            <h4 className="text-lg sm:text-xl font-semibold text-white">
              Find Us
            </h4>

            {/* Map Container */}
            <div className="relative rounded-xl overflow-hidden shadow-lg bg-slate-800 h-48 sm:h-56 lg:h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3575.8962!2d87.2718!3d26.4525!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef755d3b90e5f7%3A0x1234567890abcdef!2sBargachhi%20Chowk%2C%20Biratnagar%2C%20Nepal!5e0!3m2!1sen!2sus!4v1640995200000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full"
                title="FixPharmacy Location - Bargachhi Chowk, Biratnagar"
              ></iframe>

              {/* Overlay for better integration */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-900/20 to-transparent"></div>

              {/* Custom Marker Overlay */}
              <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium shadow-lg">
                <div className="flex items-center space-x-1">
                  <MapPin size={12} />
                  <span>FixPharmacy</span>
                </div>
              </div>
            </div>

            {/* Map Actions */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <a
                href="https://maps.google.com/?q=Bargachhi+Chowk,Biratnagar,Nepal"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors text-center"
              >
                Get Directions
              </a>
              <a
                href="tel:+977-1-4445566"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors text-center"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section - Enhanced Mobile */}
      <div className="border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="text-center lg:text-left lg:flex-1">
              <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-2">
                Stay Updated with Health Tips
              </h4>
              <p className="text-slate-300 text-xs sm:text-sm lg:text-base leading-relaxed">
                Subscribe to get health tips, medicine info, and exclusive
                offers delivered to your inbox.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full lg:w-auto lg:max-w-md xl:max-w-lg">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm sm:text-base transition-all"
              />
              <button className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all font-medium text-sm sm:text-base whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer - Enhanced Mobile */}
      <div className="border-t border-slate-700 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col space-y-3 sm:space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="text-center lg:text-left order-2 lg:order-1">
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                © 2025 FixPharmacy. All rights reserved.
                <br className="sm:hidden" />
                <span className="hidden sm:inline"> | </span>Licensed Pharmacy
                in Nepal
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6 text-xs sm:text-sm order-1 lg:order-2">
              {[
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" },
                { name: "Return Policy", href: "/returns" },
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-slate-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-slate-800"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll to Top Button - Mobile Optimized */}
      {showScrollButton && (
        <button
          onClick={() => scrollToTop()}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 p-2.5 sm:p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 touch-manipulation"
          aria-label="Scroll to top"
        >
          <ChevronUp size={18} className="sm:w-5 sm:h-5" />
        </button>
      )}
    </footer>
  );
};

export default Footer;
