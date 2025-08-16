import { useEffect } from 'react';

export const useDynamicTitle = (title) => {
  useEffect(() => {
    const originalTitle = document.title;
    
    if (title) {
      document.title = title;
    }
    
    return () => {
      document.title = originalTitle;
    };
  }, [title]);
};

// Helper function to generate dynamic titles based on app state
export const generateDynamicTitle = ({
  page = '',
  search = '',
  category = '',
  medicineType = '',
  productName = '',
  brand = '',
  isLoading = false,
  resultCount = 0,
  hasResults = true,
  isSearching = false
}) => {
  const baseTitle = "FixPharmacy - Online Pharmacy in Biratnagar, Nepal";
  
  // Loading states with search progress
  if (isLoading || isSearching) {
    if (search) return `Searching for "${search}"... | FixPharmacy`;
    if (page === 'product') return `Loading product... | FixPharmacy`;
    return `Loading... | FixPharmacy`;
  }
  
  // Product detail page with breadcrumb navigation
  if (page === 'product' && productName) {
    if (brand) {
      return `${productName} by ${brand} | Product Details | Medicine Catalog | FixPharmacy`;
    }
    return `${productName} | Product Details | Medicine Catalog | FixPharmacy`;
  }
  
  // Product catalog with filters and breadcrumb-style navigation
  if (page === 'catalog') {
    let titleParts = [];
    let breadcrumbs = [];
    
    // Search results with breadcrumb context
    if (search) {
      if (!hasResults && !isLoading) {
        return `No results for "${search}" | Search | Medicine Catalog | FixPharmacy`;
      }
      titleParts.push(`"${search}"`);
      breadcrumbs.push('Search Results');
      
      if (resultCount > 0 && !isLoading) {
        titleParts.push(`(${resultCount} found)`);
      }
    }
    
    // Category filter with hierarchy
    if (category) {
      titleParts.push(`${category} Medicines`);
      breadcrumbs.push(`${category} Category`);
    }
    
    // Medicine type filter with hierarchy
    if (medicineType) {
      titleParts.push(`${medicineType} Medicines`);
      breadcrumbs.push(`${medicineType} Type`);
    }
    
    // Build the final title with breadcrumb navigation
    if (titleParts.length > 0) {
      const filterTitle = titleParts.join(' - ');
      const breadcrumbPath = breadcrumbs.length > 0 ? ` | ${breadcrumbs.join(' | ')}` : '';
      return `${filterTitle}${breadcrumbPath} | Medicine Catalog | FixPharmacy`;
    }
    
    return "Medicine Catalog | All Products | FixPharmacy - Biratnagar, Nepal";
  }
  
  // Default pages with breadcrumb-style navigation context
  const pageTitles = {
    'home': "FixPharmacy - Your Trusted Online Pharmacy in Biratnagar, Nepal",
    'about': "About Us | FixPharmacy - Licensed Online Pharmacy Nepal",
    'contact': "Contact FixPharmacy | 24/7 Pharmacy Support in Biratnagar",
    'prescriptions': "Upload Prescription | FixPharmacy - Fast Medicine Delivery",
    'cart': "Shopping Cart | FixPharmacy",
    'checkout': "Checkout | Secure Payment | FixPharmacy",
    'login': "Login | Account Access | FixPharmacy",
    'register': "Create Account | Join FixPharmacy Today",
    'profile': "My Profile | Account Settings | FixPharmacy",
    'orders': "Order History | My Account | FixPharmacy",
    'wishlist': "My Wishlist | Saved Items | FixPharmacy",
    'admin': "Admin Dashboard | Management | FixPharmacy"
  };
  
  return pageTitles[page] || baseTitle;
};

export default useDynamicTitle;