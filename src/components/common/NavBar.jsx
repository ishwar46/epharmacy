import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  X,
  Phone,
  MapPin,
  Clock,
  ChevronDown,
  Package,
  Pill,
  Stethoscope,
  LogOut,
  Settings,
  History,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useSearch } from "../../contexts/SearchContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const {
    searchQuery,
    setSearchQuery,
    handleSearch: performSearch,
  } = useSearch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery);
      setIsSearchOpen(false);
      navigate("/products");
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    navigate("/");
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest(".user-menu-container")) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isUserMenuOpen]);

  return (
    <div className="bg-white shadow-sm border-b border-gray-100 relative">
      {/* Top Info Bar - Hidden on mobile, visible on tablet+ */}
      <div className="hidden sm:block bg-slate-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between py-2 text-xs sm:text-sm text-slate-600">
            <div className="flex items-center space-x-3 sm:space-x-6">
              <div className="flex items-center space-x-1">
                <Phone size={12} className="sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">+977-1-4445566</span>
                <span className="sm:hidden">Call</span>
              </div>
              <div className="hidden md:flex items-center space-x-1">
                <MapPin size={14} />
                <span>Bargachhi Chowk, Biratnagar, Nepal</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock size={12} className="sm:w-3.5 sm:h-3.5" />
                <span>24/7</span>
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-4 text-xs">
              <span className="text-green-600 font-medium">✓ Licensed</span>
              <span className="text-blue-600 font-medium">✓ Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Mobile-First Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between py-3 sm:py-4">
          {/* Logo - Prioritized for mobile */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <img
                src="https://i.ibb.co/RGtZpS0q/fixpharmacy.png"
                alt="FixPharmacy"
                className="w-8 h-8 sm:w-20 sm:h-20 object-contain"
              />
              <div className="block">
                <h1
                  className="text-lg sm:text-xl font-bold"
                  style={{ color: "#4A90E2" }}
                >
                  FixPharmacy
                </h1>
                <p
                  className="hidden sm:block text-xs -mt-1"
                  style={{ color: "#4CAF50" }}
                >
                  Your Health Partner
                </p>
              </div>
            </a>
          </div>

          {/* Mobile Actions Bar */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="sm:hidden p-2 text-slate-600 hover:text-blue-600 transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Desktop Search Bar */}
            <div className="hidden sm:flex flex-1 max-w-lg lg:max-w-4xl mx-4 lg:mx-8">
              <div className="w-full relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search medicines, health products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch(e)}
                  className="w-full pl-10 pr-20 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm text-slate-700 placeholder-slate-400"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-1.5 rounded-md sm:rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Cart - Always visible */}
            <button
              onClick={handleCartClick}
              className="relative p-2 text-slate-600 hover:text-blue-600 transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart size={20} className="sm:w-6 sm:h-6" />
              {cart.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
                  {cart.totalItems > 99 ? "99+" : cart.totalItems}
                </span>
              )}
            </button>

            {/* Wishlist - Hidden on very small screens */}
            <button
              className="hidden xs:block p-2 text-slate-600 hover:text-red-500 transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={20} className="sm:w-6 sm:h-6" />
            </button>

            {/* User Menu */}
            <div className="relative user-menu-container">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-2 text-slate-700 hover:text-blue-600 transition-colors"
                    aria-label="User menu"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User
                        size={16}
                        className="sm:w-4.5 sm:h-4.5 text-blue-600"
                      />
                    </div>
                    <span className="hidden md:block text-sm font-medium max-w-20 truncate">
                      {user?.name}
                    </span>
                    <ChevronDown size={14} className="hidden md:block" />
                  </button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-lg sm:rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                      <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-slate-100">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-slate-500 capitalize">
                          {user?.role} Account
                        </p>
                      </div>

                      <div className="py-1 sm:py-2">
                        <button
                          onClick={() => {
                            navigate("/profile");
                            setIsUserMenuOpen(false);
                          }}
                          className="flex items-center w-full px-3 sm:px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Settings size={16} className="mr-3" />
                          My Profile
                        </button>
                        <button
                          onClick={() => {
                            navigate("/orders");
                            setIsUserMenuOpen(false);
                          }}
                          className="flex items-center w-full px-3 sm:px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <History size={16} className="mr-3" />
                          Order History
                        </button>
                        <button
                          onClick={() => {
                            navigate("/cart");
                            setIsUserMenuOpen(false);
                          }}
                          className="flex items-center w-full px-3 sm:px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <ShoppingCart size={16} className="mr-3" />
                          My Cart
                        </button>
                        <button
                          onClick={() => {
                            navigate("/wishlist");
                            setIsUserMenuOpen(false);
                          }}
                          className="flex items-center w-full px-3 sm:px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Heart size={16} className="mr-3" />
                          Wishlist
                        </button>

                        {user?.role === "admin" && (
                          <button
                            onClick={() => {
                              navigate("/admin");
                              setIsUserMenuOpen(false);
                            }}
                            className="flex items-center w-full px-3 sm:px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <Package size={16} className="mr-3" />
                            Admin Panel
                          </button>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-1 sm:pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-3 sm:px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} className="mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate("/login")}
                    className="hidden sm:block text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden p-2 text-slate-600 hover:text-blue-600 transition-colors ml-1"
              aria-label="Menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden sm:flex items-center justify-between py-3 border-t border-slate-100">
          <nav className="flex items-center space-x-6 lg:space-x-8">
            <a
              href="/"
              className="flex items-center space-x-1 sm:space-x-2 text-slate-700 hover:text-blue-600 transition-colors font-medium text-sm"
            >
              <span>Home</span>
            </a>
            <a
              href="/medicines"
              className="flex items-center space-x-1 sm:space-x-2 text-slate-700 hover:text-blue-600 transition-colors text-sm"
            >
              <Pill size={14} className="sm:w-4 sm:h-4" />
              <span>Medicines</span>
            </a>
            <a
              href="/health-products"
              className="flex items-center space-x-1 sm:space-x-2 text-slate-700 hover:text-blue-600 transition-colors text-sm"
            >
              <Package size={14} className="sm:w-4 sm:h-4" />
              <span>Health Products</span>
            </a>
            <a
              href="/prescriptions"
              className="text-slate-700 hover:text-blue-600 transition-colors text-sm"
            >
              <span className="hidden lg:inline">Upload </span>Prescription
            </a>
            <a
              href="/about"
              className="text-slate-700 hover:text-blue-600 transition-colors text-sm"
            >
              About Us
            </a>
            <a
              href="/contact"
              className="text-slate-700 hover:text-blue-600 transition-colors text-sm"
            >
              Contact
            </a>
          </nav>

          <div className="hidden lg:flex items-center space-x-4 text-sm">
            <span className="text-slate-500">Need Help?</span>
            <a
              href="tel:+977-1-4445566"
              className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
            >
              Call Now
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 z-50 shadow-lg">
          <div className="p-4">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search medicines, health products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch(e)}
                className="w-full pl-10 pr-20 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 placeholder-slate-400"
                autoFocus
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 z-40 shadow-lg">
          {/* Mobile Navigation */}
          <nav className="py-2">
            <a
              href="/"
              className="flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50 font-medium transition-colors active:bg-slate-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="/medicines"
              className="flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors active:bg-slate-100"
              onClick={() => setIsMenuOpen(false)}
            >
              <Pill size={18} className="mr-3 text-slate-500" />
              Medicines
            </a>
            <a
              href="/health-products"
              className="flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors active:bg-slate-100"
              onClick={() => setIsMenuOpen(false)}
            >
              <Package size={18} className="mr-3 text-slate-500" />
              Health Products
            </a>
            <a
              href="/prescriptions"
              className="flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors active:bg-slate-100"
              onClick={() => setIsMenuOpen(false)}
            >
              <Stethoscope size={18} className="mr-3 text-slate-500" />
              Upload Prescription
            </a>
            <a
              href="/about"
              className="flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors active:bg-slate-100"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </a>
            <a
              href="/contact"
              className="flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors active:bg-slate-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </a>

            {/* Mobile-only Wishlist Link */}
            <a
              href="/wishlist"
              className="flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors active:bg-slate-100 xs:hidden"
              onClick={() => setIsMenuOpen(false)}
            >
              <Heart size={18} className="mr-3 text-slate-500" />
              Wishlist
            </a>

            {/* Show login if not authenticated */}
            {!isAuthenticated && (
              <a
                href="/login"
                className="flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors active:bg-slate-100 sm:hidden"
                onClick={() => setIsMenuOpen(false)}
              >
                <User size={18} className="mr-3 text-slate-500" />
                Sign In
              </a>
            )}
          </nav>

          {/* Mobile Call to Action */}
          <div className="px-4 py-4 border-t border-slate-100 bg-slate-50">
            <a
              href="tel:+977-1-4445566"
              className="flex items-center justify-center w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors active:bg-blue-800"
              onClick={() => setIsMenuOpen(false)}
            >
              <Phone size={18} className="mr-2" />
              Call Now: +977-1-4445566
            </a>
          </div>
        </div>
      )}

      {/* Backdrop for mobile menu */}
      {(isMenuOpen || isSearchOpen) && (
        <div
          className="sm:hidden fixed inset-0  bg-opacity-25 z-30"
          onClick={() => {
            setIsMenuOpen(false);
            setIsSearchOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Navbar;
