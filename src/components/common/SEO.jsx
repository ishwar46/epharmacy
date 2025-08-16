import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({
  title = "FixPharmacy - Your Trusted Online Pharmacy in Biratnagar, Nepal",
  description = "FixPharmacy is your trusted online pharmacy in Biratnagar, Nepal. Order medicines online with fast delivery, authentic products, and 24/7 support. Licensed pharmacy with prescription and over-the-counter medicines.",
  keywords = "online pharmacy Nepal, medicine delivery Biratnagar, prescription medicines Nepal, authentic medicines, fast delivery pharmacy, 24/7 pharmacy support, licensed pharmacy Nepal, healthcare products Nepal",
  canonical = "https://fixpharmacy.com/",
  ogTitle,
  ogDescription,
  ogImage = "https://fixpharmacy.com/og-image.jpg",
  ogType = "website",
  twitterCard = "summary_large_image",
  structuredData,
  noindex = false,
}) => {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Robots */}
      <meta
        name="robots"
        content={noindex ? "noindex, nofollow" : "index, follow"}
      />

      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="FixPharmacy" />

      {/* Twitter */}
      <meta property="twitter:card" content={twitterCard} />
      <meta property="twitter:url" content={canonical} />
      <meta property="twitter:title" content={ogTitle || title} />
      <meta
        property="twitter:description"
        content={ogDescription || description}
      />
      <meta property="twitter:image" content={ogImage} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
