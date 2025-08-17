import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SearchContext = createContext();

const SearchProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState({
    search: "",
    category: "",
    medicineType: "",
    page: 1,
    limit: 12,
  });

  // Initialize filters from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlFilters = {
      search: params.get("search") || "",
      category: params.get("category") || "",
      medicineType: params.get("medicineType") || "",
      page: parseInt(params.get("page")) || 1,
      limit: parseInt(params.get("limit")) || 12,
    };
    
    setSearchFilters(urlFilters);
    setSearchQuery(urlFilters.search);
  }, [location.search]);

  // Update URL when filters change
  const updateURL = useCallback((filters) => {
    const params = new URLSearchParams();
    
    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.medicineType) params.set("medicineType", filters.medicineType);
    if (filters.page > 1) params.set("page", filters.page.toString());
    if (filters.limit !== 12) params.set("limit", filters.limit.toString());
    
    const newSearch = params.toString();
    const newPath = location.pathname + (newSearch ? `?${newSearch}` : "");
    
    if (newPath !== location.pathname + location.search) {
      navigate(newPath, { replace: true });
    }
  }, [navigate, location.pathname, location.search]);

  // Debounced update search query and filters
  const updateSearch = useCallback((query) => {
    const newFilters = {
      ...searchFilters,
      search: query,
      page: 1, // Reset to first page when searching
    };
    
    setSearchQuery(query);
    setSearchFilters(newFilters);
    updateURL(newFilters);
  }, [searchFilters, updateURL]);

  // Update specific filter
  const updateFilter = (key, value) => {
    const newFilters = {
      ...searchFilters,
      [key]: value,
      page: key !== "page" ? 1 : value, // Reset to first page unless changing page
    };
    
    setSearchFilters(newFilters);
    if (key === "search") {
      setSearchQuery(value);
    }
    updateURL(newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    const newFilters = {
      search: "",
      category: "",
      medicineType: "",
      page: 1,
      limit: 12,
    };
    
    setSearchQuery("");
    setSearchFilters(newFilters);
    updateURL(newFilters);
  };

  // Set filters from external source (like navbar navigation)
  const setFilters = (filters) => {
    setSearchFilters(filters);
    setSearchQuery(filters.search || "");
    updateURL(filters);
  };

  const value = {
    searchQuery,
    searchFilters,
    updateSearch,
    updateFilter,
    clearFilters,
    setFilters,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

// Custom hook
const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

export { SearchProvider, useSearch };
