import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeroBanner from "../components/HeroBanner";
import ProductCarousel from "../components/ProductCarousel";
import PromoBanner from "../components/PromoBanner";
import ProductCatalog from "./customer/ProductCatalog";
import SEO from "../components/common/SEO";
import { useSearch } from "../contexts/SearchContext";
import { getProducts } from "../services/productService";
import TrustIndicators from "../components/TrustIndicators";

const LandingPage = () => {
  const location = useLocation();
  const { searchFilters } = useSearch();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [otcProducts, setOtcProducts] = useState([]);
  const [vitaminsProducts, setVitaminsProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if this is a filtered view using the SearchContext filters
  const hasFilters = Boolean(
    searchFilters.category ||
      searchFilters.medicineType ||
      searchFilters.search ||
      (searchFilters.page && searchFilters.page !== 1)
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Fetch different product sets
        const [featuredRes, otcRes, vitaminsRes] = await Promise.all([
          getProducts({ limit: 8, page: 1 }), // Featured products
          getProducts({ medicineType: "OTC", limit: 8, page: 1 }), // OTC products
          getProducts({ category: "Vitamins", limit: 8, page: 1 }), // Vitamins
        ]);

        if (featuredRes.success) setFeaturedProducts(featuredRes.data);
        if (otcRes.success) setOtcProducts(otcRes.data);
        if (vitaminsRes.success) setVitaminsProducts(vitaminsRes.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // If there are filters, show the catalog page instead
  if (hasFilters) {
    return <ProductCatalog />;
  }

  return (
    <>
      <SEO
        title="FixPharmacy - Your Trusted Online Pharmacy in Biratnagar, Nepal"
        description="Order authentic medicines online with fast delivery across Biratnagar, Nepal. Licensed pharmacy with prescription and OTC medicines, 24/7 support."
        keywords="online pharmacy Nepal, medicine delivery Biratnagar, prescription medicines Nepal, authentic medicines, fast delivery pharmacy, 24/7 pharmacy support, licensed pharmacy Nepal"
        canonical="https://fixpharmacy.com/"
      />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Banner */}
        <HeroBanner />

        {/* Featured Products Carousel */}
        <ProductCarousel
          title="Featured Products"
          products={featuredProducts}
          loading={loading}
          viewAllLink="/products"
        />

        {/* Promotional Banner */}
        <PromoBanner />

        {/* OTC Products Carousel */}
        <ProductCarousel
          title="Over-the-Counter Medicines"
          products={otcProducts}
          loading={loading}
          viewAllLink="/?medicineType=OTC"
        />

        {/* Vitamins & Supplements Carousel */}
        <ProductCarousel
          title="Vitamins & Supplements"
          products={vitaminsProducts}
          loading={loading}
          viewAllLink="/?category=Vitamins"
        />

        {/* Trust Indicators */}
        <TrustIndicators />
      </div>
    </>
  );
};

export default LandingPage;
