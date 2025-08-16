// Sitemap generator utility for static routes
export const generateSitemap = (products = []) => {
  const baseUrl = 'https://fixpharmacy.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '1.0'
    },
    {
      url: `${baseUrl}/about`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      url: `${baseUrl}/contact`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      url: `${baseUrl}/prescriptions`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.9'
    }
  ];

  // Dynamic product routes
  const productRoutes = products.map(product => ({
    url: `${baseUrl}/product/${product._id}`,
    lastmod: product.updatedAt ? new Date(product.updatedAt).toISOString().split('T')[0] : currentDate,
    changefreq: 'weekly',
    priority: '0.7'
  }));

  const allRoutes = [...staticRoutes, ...productRoutes];

  // Generate XML sitemap
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>${route.url}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemapXml;
};

// Generate robots.txt content
export const generateRobotsTxt = () => {
  const baseUrl = 'https://fixpharmacy.com';
  
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Block admin routes
Disallow: /admin/
Disallow: /login
Disallow: /api/

# Allow important pages
Allow: /
Allow: /product/
Allow: /about
Allow: /contact
Allow: /prescriptions`;
};

export default { generateSitemap, generateRobotsTxt };