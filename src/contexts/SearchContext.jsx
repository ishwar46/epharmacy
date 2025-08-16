import React, { createContext, useContext, useState, useCallback } from "react";

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState({
    search: "",
    category: "",
    medicineType: "",
    page: 1,
    limit: 12,
  });

  // Debounced update search query and filters
  const updateSearch = useCallback((query) => {
    setSearchQuery(query);
    setSearchFilters(prev => ({
      ...prev,
      search: query,
      page: 1, // Reset to first page when searching
    }));
  }, []);

  // Update specific filter
  const updateFilter = (key, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value, // Reset to first page unless changing page
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSearchFilters({
      search: "",
      category: "",
      medicineType: "",
      page: 1,
      limit: 12,
    });
  };

  // Set filters from external source (like ProductCatalog)
  const setFilters = (filters) => {
    setSearchFilters(filters);
    setSearchQuery(filters.search || "");
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
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;