import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { scrollToTop } from "../../utils/scrollUtils";
import { useScrollPosition } from "../../hooks/useScrollPosition";
import { useSearch } from "../../contexts/SearchContext";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { generateDynamicTitle } from "../../hooks/useDynamicTitle";
import { getProfilePictureURL } from "../../utils/imageUtils";
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
  ChevronUp,
} from "lucide-react";

const StickyNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchQuery, updateSearch, setFilters } = useSearch();
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Smart scroll behavior with throttling to prevent flickering
  const scrollPosition = useScrollPosition(50); // 50ms throttle for smooth performance
  const [isVisible, setIsVisible] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Smart navbar visibility logic with throttled scroll position
  useEffect(() => {
    const currentScrollY = scrollPosition;

    // Show/hide logic based on scroll direction
    if (currentScrollY < lastScrollY || currentScrollY < 100) {
      setIsVisible(true);
    } else if (currentScrollY > lastScrollY && currentScrollY > 200) {
      setIsVisible(false);
      setIsMenuOpen(false);
      setIsSearchOpen(false);
      setIsUserMenuOpen(false);
    }

    // Compact mode after scrolling past header
    setIsCompact(currentScrollY > 150);
    setLastScrollY(currentScrollY);
  }, [scrollPosition, lastScrollY]);

  // Sync local search query with global search context
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (localSearchQuery.trim()) {
      // Update global search state
      updateSearch(localSearchQuery.trim());

      // Navigate to ProductCatalog (home page) if not already there
      if (location.pathname !== "/") {
        navigate("/");
      }

      // Close mobile search overlay
      setIsSearchOpen(false);
    }
  };

  // Handle search input change - provide instant results like ProductCatalog
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setLocalSearchQuery(value);

    // Update global search state immediately for instant results
    updateSearch(value);

    // Update title to show search in progress
    if (value.trim()) {
      const searchTitle = generateDynamicTitle({
        page: "catalog",
        search: value,
        isLoading: true,
      });
      document.title = searchTitle;
    }

    // Only navigate to ProductCatalog (home page) if not already there AND there's a search query
    // This prevents unnecessary navigation when already on the ProductCatalog page
    if (value.trim() && location.pathname !== "/") {
      navigate("/");
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const handleCartClick = () => {
    navigate('/cart');
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
    <>
      {/* Top Info Bar - Hidden when compact and on mobile */}
      <div
        className={`hidden sm:block bg-slate-50 border-b border-gray-100 transition-all duration-300 ${
          isCompact ? "h-0 overflow-hidden opacity-0" : "h-auto opacity-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between py-2 text-xs sm:text-sm text-slate-600">
            <div className="flex items-center space-x-4 sm:space-x-6">
              <div className="flex items-center space-x-2">
                <Phone size={12} className="sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">+977-1-4445566</span>
                <span className="sm:hidden">+977-1-4445566</span>
              </div>
              <div className="hidden md:flex items-center space-x-1">
                <MapPin size={14} />
                <span>Bargachhi Chowk, Biratnagar, Nepal</span>
              </div>
              <div className="hidden sm:flex items-center space-x-1">
                <Clock size={12} className="sm:w-3.5 sm:h-3.5" />
                <span>24/7 Available</span>
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-4 text-xs">
              <span className="text-green-600 font-medium">✓ Licensed</span>
              <span className="text-blue-600 font-medium">✓ Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Main Navbar */}
      <div
        className={`sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100 transition-all duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${isCompact ? "py-2" : "py-0"}`}
      >
        {/* Main Mobile-First Navbar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div
            className={`flex items-center justify-between transition-all duration-300 ${
              isCompact ? "py-2" : "py-3 sm:py-4"
            }`}
          >
            {/* Logo - Compact version when scrolled */}
            <div className="flex items-center">
              <a href="/" className="flex items-center space-x-2">
                <img
                  src="https://i.ibb.co/RGtZpS0q/fixpharmacy.png"
                  alt="FixPharmacy"
                  className={`object-contain transition-all duration-300 ${
                    isCompact
                      ? "w-6 h-6 sm:w-8 sm:h-8"
                      : "w-8 h-8 sm:w-20 sm:h-20"
                  }`}
                />
                <div
                  className={`transition-all duration-300 ${
                    isCompact ? "scale-90" : "scale-100"
                  }`}
                >
                  <h1
                    className={`font-bold transition-all duration-300 ${
                      isCompact ? "text-base sm:text-lg" : "text-lg sm:text-xl"
                    }`}
                    style={{ color: "#4A90E2" }}
                  >
                    FixPharmacy
                  </h1>
                  <p
                    className={`text-xs -mt-1 transition-all duration-300 ${
                      isCompact ? "hidden" : "hidden sm:block"
                    }`}
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
                <Search size={18} />
              </button>

              {/* Desktop Search Bar - Compact when scrolled */}
              <div
                className={`hidden sm:flex flex-1 mx-4 lg:mx-8 transition-all duration-300 ${
                  isCompact ? "max-w-md" : "max-w-lg lg:max-w-4xl"
                }`}
              >
                <div className="w-full relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Search medicines..."
                    value={localSearchQuery}
                    onChange={handleSearchInputChange}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
                    className={`w-full pl-9 pr-16 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm text-slate-700 placeholder-slate-400 ${
                      isCompact ? "py-2" : "py-2 sm:py-3"
                    }`}
                  />
                  <button
                    onClick={handleSearch}
                    className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700 transition-colors text-xs font-medium"
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* Cart - Always visible with enhanced compact state */}
              <button
                onClick={handleCartClick}
                className="relative p-2 text-slate-600 hover:text-blue-600 transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingCart
                  size={isCompact ? 18 : 20}
                  className="sm:w-6 sm:h-6"
                />
                {cart.totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
                    {cart.totalItems > 99 ? "99+" : cart.totalItems}
                  </span>
                )}
              </button>

              {/* Wishlist - Compact responsive */}
              <button
                className="hidden xs:block p-2 text-slate-600 hover:text-red-500 transition-colors"
                aria-label="Wishlist"
              >
                <Heart size={isCompact ? 18 : 20} className="sm:w-6 sm:h-6" />
              </button>

              {/* User Menu - Compact version */}
              <div className="relative user-menu-container">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-2 text-slate-700 hover:text-blue-600 transition-colors"
                      aria-label="User menu"
                    >
                      <div
                        className={`bg-blue-100 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 ${
                          isCompact ? "w-6 h-6" : "w-7 h-7 sm:w-8 sm:h-8"
                        }`}
                      >
                        {user?.profilePicture ? (
                          <img
                            src={getProfilePictureURL(user.profilePicture)}
                            alt={user.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Hide image and show fallback icon
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'block';
                            }}
                          />
                        ) : null}
                        <User
                          size={isCompact ? 12 : 16}
                          className={`text-blue-600 ${user?.profilePicture ? 'hidden' : 'block'}`}
                        />
                      </div>
                      <span
                        className={`hidden md:block text-sm font-medium max-w-20 truncate transition-all duration-300 ${
                          isCompact ? "text-xs" : ""
                        }`}
                      >
                        {user?.name}
                      </span>
                      <ChevronDown size={12} className="hidden md:block" />
                    </button>

                    {/* User Dropdown - Same as before */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-lg sm:rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                        {/* Dropdown content same as original */}
                        <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-slate-100">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {user?.name}
                          </p>
                          <p className="text-xs text-slate-500 capitalize">
                            {user?.role} Account
                          </p>
                        </div>
                        <div className="py-1 sm:py-2">
                          <Link
                            to="/profile"
                            className="flex items-center px-3 sm:px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings size={16} className="mr-3" />
                            My Profile
                          </Link>
                          <a
                            href="/orders"
                            className="flex items-center px-3 sm:px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <History size={16} className="mr-3" />
                            Order History
                          </a>
                          <button
                            onClick={() => {
                              handleCartClick();
                              setIsUserMenuOpen(false);
                            }}
                            className="flex items-center w-full px-3 sm:px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <ShoppingCart size={16} className="mr-3" />
                            My Cart
                            {cart.totalItems > 0 && (
                              <span className="ml-auto bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                                {cart.totalItems}
                              </span>
                            )}
                          </button>
                          <a
                            href="/wishlist"
                            className="flex items-center px-3 sm:px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <Heart size={16} className="mr-3" />
                            Wishlist
                          </a>
                          {user?.role === "admin" && (
                            <a
                              href="/admin"
                              className="flex items-center px-3 sm:px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              <Package size={16} className="mr-3" />
                              Admin Panel
                            </a>
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
                    <a
                      href="/login"
                      className="hidden sm:block text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                    >
                      Sign In
                    </a>
                    <a
                      href="/register"
                      className={`bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors ${
                        isCompact
                          ? "px-2 py-1 text-xs"
                          : "px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm"
                      }`}
                    >
                      Sign Up
                    </a>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="sm:hidden p-2 text-slate-600 hover:text-blue-600 transition-colors ml-1"
                aria-label="Menu"
              >
                {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {/* Desktop Navigation Links - Hidden when compact */}
          <div
            className={`hidden sm:flex items-center justify-between border-t border-slate-100 transition-all duration-300 ${
              isCompact
                ? "py-1 opacity-0 h-0 overflow-hidden"
                : "py-3 opacity-100 h-auto"
            }`}
          >
            <nav className="flex items-center space-x-6 lg:space-x-8">
              <button
                onClick={() => navigate("/")}
                className="flex items-center space-x-1 sm:space-x-2 text-slate-700 hover:text-blue-600 transition-colors font-medium text-sm"
              >
                <span>Home</span>
              </button>
              
              {/* Categories Dropdown */}
              <div className="relative group">
                <button
                  className="flex items-center space-x-1 sm:space-x-2 text-slate-700 hover:text-blue-600 transition-colors text-sm"
                >
                  <Pill size={14} className="sm:w-4 sm:h-4" />
                  <span>Categories</span>
                  <ChevronDown size={12} className="sm:w-3 sm:h-3" />
                </button>
                
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="grid grid-cols-2 gap-1 p-2">
                    <button
                      onClick={() => {
                        updateSearch("");
                        setFilters({ search: "", category: "Pain Relief", medicineType: "", page: 1, limit: 12 });
                        if (location.pathname !== "/") navigate("/");
                      }}
                      className="flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                    >
                      Pain Relief
                    </button>
                    <button
                      onClick={() => {
                        updateSearch("");
                        setFilters({ search: "", category: "Antibiotics", medicineType: "", page: 1, limit: 12 });
                        if (location.pathname !== "/") navigate("/");
                      }}
                      className="flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                    >
                      Antibiotics
                    </button>
                    <button
                      onClick={() => {
                        updateSearch("");
                        setFilters({ search: "", category: "Vitamins", medicineType: "", page: 1, limit: 12 });
                        if (location.pathname !== "/") navigate("/");
                      }}
                      className="flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                    >
                      Vitamins
                    </button>
                    <button
                      onClick={() => {
                        updateSearch("");
                        setFilters({ search: "", category: "Digestive", medicineType: "", page: 1, limit: 12 });
                        if (location.pathname !== "/") navigate("/");
                      }}
                      className="flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                    >
                      Digestive
                    </button>
                    <button
                      onClick={() => {
                        updateSearch("");
                        setFilters({ search: "", category: "Heart & Blood", medicineType: "", page: 1, limit: 12 });
                        if (location.pathname !== "/") navigate("/");
                      }}
                      className="flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                    >
                      Heart & Blood
                    </button>
                    <button
                      onClick={() => {
                        updateSearch("");
                        setFilters({ search: "", category: "Respiratory", medicineType: "", page: 1, limit: 12 });
                        if (location.pathname !== "/") navigate("/");
                      }}
                      className="flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                    >
                      Respiratory
                    </button>
                  </div>
                  <div className="border-t border-slate-100 mt-2 pt-2">
                    <button
                      onClick={() => navigate("/")}
                      className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <span>View All Categories</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Medicine Types Dropdown */}
              <div className="relative group">
                <button
                  className="flex items-center space-x-1 sm:space-x-2 text-slate-700 hover:text-blue-600 transition-colors text-sm"
                >
                  <Package size={14} className="sm:w-4 sm:h-4" />
                  <span>Medicine Types</span>
                  <ChevronDown size={12} className="sm:w-3 sm:h-3" />
                </button>
                
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <button
                    onClick={() => {
                      updateSearch("");
                      setFilters({ search: "", category: "", medicineType: "OTC", page: 1, limit: 12 });
                      if (location.pathname !== "/") navigate("/");
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    OTC Medicines
                  </button>
                  <button
                    onClick={() => {
                      updateSearch("");
                      setFilters({ search: "", category: "", medicineType: "Prescription", page: 1, limit: 12 });
                      if (location.pathname !== "/") navigate("/");
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    Prescription Required
                  </button>
                  <div className="border-t border-slate-100 mt-2 pt-2">
                    <button
                      onClick={() => navigate("/")}
                      className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <span>View All Types</span>
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate("/prescriptions")}
                className="text-slate-700 hover:text-blue-600 transition-colors text-sm"
              >
                <span className="hidden lg:inline">Upload </span>Prescription
              </button>
              <button
                onClick={() => navigate("/about")}
                className="text-slate-700 hover:text-blue-600 transition-colors text-sm"
              >
                About Us
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="text-slate-700 hover:text-blue-600 transition-colors text-sm"
              >
                Contact
              </button>
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

        {/* Mobile Search Overlay - Enhanced with blur */}
        {isSearchOpen && (
          <div className="sm:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-slate-200 z-50 shadow-lg">
            <div className="p-4">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search medicines, health products..."
                  value={localSearchQuery}
                  onChange={handleSearchInputChange}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
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

        {/* Mobile Menu - Enhanced with glass effect */}
        {isMenuOpen && (
          <div className="sm:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-slate-200 z-40 shadow-lg">
            {/* Same mobile menu content as original */}
            <nav className="py-2">
              <a
                href="/"
                className="flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
              
              {/* Categories Section */}
              <div className="px-4 py-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Categories</p>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      updateSearch("");
                      setFilters({ search: "", category: "Pain Relief", medicineType: "", page: 1, limit: 12 });
                      if (location.pathname !== "/") navigate("/");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-md transition-colors text-sm w-full text-left"
                  >
                    Pain Relief
                  </button>
                  <button
                    onClick={() => {
                      updateSearch("");
                      setFilters({ search: "", category: "Antibiotics", medicineType: "", page: 1, limit: 12 });
                      if (location.pathname !== "/") navigate("/");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-md transition-colors text-sm w-full text-left"
                  >
                    Antibiotics
                  </button>
                  <button
                    onClick={() => {
                      updateSearch("");
                      setFilters({ search: "", category: "Vitamins", medicineType: "", page: 1, limit: 12 });
                      if (location.pathname !== "/") navigate("/");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-md transition-colors text-sm w-full text-left"
                  >
                    Vitamins
                  </button>
                  <a
                    href="/"
                    className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-sm font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    View All Categories →
                  </a>
                </div>
              </div>

              {/* Medicine Types Section */}
              <div className="px-4 py-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Medicine Types</p>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      updateSearch("");
                      setFilters({ search: "", category: "", medicineType: "OTC", page: 1, limit: 12 });
                      if (location.pathname !== "/") navigate("/");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-md transition-colors text-sm w-full text-left"
                  >
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    OTC Medicines
                  </button>
                  <button
                    onClick={() => {
                      updateSearch("");
                      setFilters({ search: "", category: "", medicineType: "Prescription", page: 1, limit: 12 });
                      if (location.pathname !== "/") navigate("/");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-md transition-colors text-sm w-full text-left"
                  >
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    Prescription Required
                  </button>
                </div>
              </div>
              <a
                href="/prescriptions"
                className="flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Stethoscope size={18} className="mr-3 text-slate-500" />
                Upload Prescription
              </a>
              <a
                href="/about"
                className="flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </a>
              <a
                href="/contact"
                className="flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>

              {!isAuthenticated && (
                <a
                  href="/login"
                  className="flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors sm:hidden"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={18} className="mr-3 text-slate-500" />
                  Sign In
                </a>
              )}
            </nav>

            <div className="px-4 py-4 border-t border-slate-200/50 bg-slate-50/70 backdrop-blur-sm">
              <a
                href="tel:+977-1-4445566"
                className="flex items-center justify-center w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Phone size={18} className="mr-2" />
                Call Now: +977-1-4445566
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Scroll to top button - Show when navbar is hidden */}
      {!isVisible && scrollPosition > 400 && (
        <button
          onClick={() => scrollToTop()}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110"
          aria-label="Scroll to top"
        >
          <ChevronUp size={20} />
        </button>
      )}

      {/* Backdrop for mobile overlays - Modern blur effect */}
      {(isMenuOpen || isSearchOpen) && (
        <div
          className="sm:hidden fixed inset-0 bg-white/20 backdrop-blur-md z-30 transition-all duration-300"
          onClick={() => {
            setIsMenuOpen(false);
            setIsSearchOpen(false);
          }}
        />
      )}
    </>
  );
};

export default StickyNavbar;
