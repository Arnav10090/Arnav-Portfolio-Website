import { MetadataRoute } from 'next';
import { siteMetadata } from '@/data/metadata';

/**
 * Generate sitemap.xml for search engine indexing
 * Requirements: 7.2
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteMetadata.canonicalUrl || 'https://arnavtiwari.dev';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];
}
