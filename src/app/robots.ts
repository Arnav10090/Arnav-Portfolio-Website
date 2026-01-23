import { MetadataRoute } from 'next';
import { siteMetadata } from '@/data/metadata';

/**
 * Configure robots.txt to allow search engine crawling
 * Requirements: 7.5
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteMetadata.canonicalUrl || 'https://arnavtiwari.dev';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
