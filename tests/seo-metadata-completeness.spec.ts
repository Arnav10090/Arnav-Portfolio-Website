import { test, expect } from '@playwright/test';

/**
 * Property 14: SEO and Metadata Completeness
 * **Validates: Requirements 7.1, 7.3, 7.4**
 * 
 * For any page or social media preview, the portfolio should include:
 * - Comprehensive meta tags
 * - Structured data markup
 * - Open Graph properties with appropriate images and descriptions
 * 
 * Feature: portfolio-website, Property 14: SEO and Metadata Completeness
 */

test.describe('Property 14: SEO and Metadata Completeness', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have comprehensive meta tags with title, description, and keywords', async ({ page }) => {
    // Check title tag
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(10);
    expect(title.length).toBeLessThan(70); // SEO best practice: 50-60 characters
    expect(title).toContain('Arnav Tiwari');
    expect(title).toContain('Software Engineer');

    // Check meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription!.length).toBeGreaterThan(50);
    expect(metaDescription!.length).toBeLessThan(160); // SEO best practice: 150-160 characters
    expect(metaDescription).toContain('React');
    expect(metaDescription).toContain('.NET');

    // Check meta keywords
    const metaKeywords = await page.locator('meta[name="keywords"]').getAttribute('content');
    expect(metaKeywords).toBeTruthy();
    expect(metaKeywords!.length).toBeGreaterThan(0);
    
    // Keywords should include strategic skills
    expect(metaKeywords).toContain('React');
    expect(metaKeywords).toContain('.NET');
    expect(metaKeywords).toContain('Software Engineer');

    // Check author meta tag
    const metaAuthor = await page.locator('meta[name="author"]').getAttribute('content');
    expect(metaAuthor).toBeTruthy();

    // Check canonical URL
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBeTruthy();
    expect(canonical).toMatch(/^https?:\/\//);
  });

  test('should have complete Open Graph properties for social media previews', async ({ page }) => {
    // Check og:title
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toBeTruthy();
    expect(ogTitle!.length).toBeGreaterThan(10);
    expect(ogTitle).toContain('Arnav Tiwari');

    // Check og:description
    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
    expect(ogDescription).toBeTruthy();
    expect(ogDescription!.length).toBeGreaterThan(50);

    // Check og:image
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toBeTruthy();
    expect(ogImage).toMatch(/\.(jpg|jpeg|png|webp)$/i);

    // Check og:url
    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
    expect(ogUrl).toBeTruthy();
    expect(ogUrl).toMatch(/^https?:\/\//);

    // Check og:type
    const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
    expect(ogType).toBeTruthy();
    expect(ogType).toBe('website');

    // Check og:site_name
    const ogSiteName = await page.locator('meta[property="og:site_name"]').getAttribute('content');
    expect(ogSiteName).toBeTruthy();

    // Check og:locale
    const ogLocale = await page.locator('meta[property="og:locale"]').getAttribute('content');
    expect(ogLocale).toBeTruthy();
    expect(ogLocale).toBe('en_US');
  });

  test('should have Twitter Card meta tags for Twitter previews', async ({ page }) => {
    // Check twitter:card
    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
    expect(twitterCard).toBeTruthy();
    expect(twitterCard).toBe('summary_large_image');

    // Check twitter:title
    const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content');
    expect(twitterTitle).toBeTruthy();
    expect(twitterTitle!.length).toBeGreaterThan(10);

    // Check twitter:description
    const twitterDescription = await page.locator('meta[name="twitter:description"]').getAttribute('content');
    expect(twitterDescription).toBeTruthy();
    expect(twitterDescription!.length).toBeGreaterThan(50);

    // Check twitter:image
    const twitterImage = await page.locator('meta[name="twitter:image"]').getAttribute('content');
    expect(twitterImage).toBeTruthy();

    // Check twitter:creator
    const twitterCreator = await page.locator('meta[name="twitter:creator"]').getAttribute('content');
    expect(twitterCreator).toBeTruthy();
    expect(twitterCreator).toMatch(/^@/);
  });

  test('should have structured data markup (JSON-LD) for person schema', async ({ page }) => {
    // Get the JSON-LD script tag
    const jsonLdScript = await page.locator('script[type="application/ld+json"]').first();
    expect(await jsonLdScript.count()).toBeGreaterThan(0);

    // Parse the JSON-LD content
    const jsonLdContent = await jsonLdScript.textContent();
    expect(jsonLdContent).toBeTruthy();

    const structuredData = JSON.parse(jsonLdContent!);

    // Verify Person schema properties
    expect(structuredData['@context']).toBe('https://schema.org');
    expect(structuredData['@type']).toBe('Person');
    
    // Check required Person properties
    expect(structuredData.name).toBeTruthy();
    expect(structuredData.name).toContain('Arnav Tiwari');
    
    expect(structuredData.url).toBeTruthy();
    expect(structuredData.url).toMatch(/^https?:\/\//);
    
    expect(structuredData.jobTitle).toBeTruthy();
    expect(structuredData.jobTitle).toContain('Software Engineer');

    // Check worksFor organization
    expect(structuredData.worksFor).toBeTruthy();
    expect(structuredData.worksFor['@type']).toBe('Organization');
    expect(structuredData.worksFor.name).toBeTruthy();

    // Check alumniOf educational organization
    expect(structuredData.alumniOf).toBeTruthy();
    expect(structuredData.alumniOf['@type']).toBe('EducationalOrganization');
    expect(structuredData.alumniOf.name).toBeTruthy();

    // Check knowsAbout skills array
    expect(structuredData.knowsAbout).toBeTruthy();
    expect(Array.isArray(structuredData.knowsAbout)).toBe(true);
    expect(structuredData.knowsAbout.length).toBeGreaterThan(0);
    
    // Should include strategic skills
    expect(structuredData.knowsAbout).toContain('React');
    expect(structuredData.knowsAbout).toContain('.NET MVC');

    // Check sameAs social profiles
    expect(structuredData.sameAs).toBeTruthy();
    expect(Array.isArray(structuredData.sameAs)).toBe(true);
    expect(structuredData.sameAs.length).toBeGreaterThan(0);
    
    // Should include social media URLs
    const socialUrls = structuredData.sameAs.join(' ');
    expect(socialUrls).toMatch(/linkedin|github|twitter/i);

    // Check address
    expect(structuredData.address).toBeTruthy();
    expect(structuredData.address['@type']).toBe('PostalAddress');
    expect(structuredData.address.addressLocality).toBeTruthy();
    expect(structuredData.address.addressCountry).toBeTruthy();
  });

  test('should have proper robots meta tags for search engine indexing', async ({ page }) => {
    // Check robots meta tag
    const robotsMeta = await page.locator('meta[name="robots"]').getAttribute('content');
    
    // If robots meta exists, it should allow indexing
    if (robotsMeta) {
      expect(robotsMeta).toContain('index');
      expect(robotsMeta).toContain('follow');
    }

    // Check for googlebot specific meta
    const googlebotMeta = await page.locator('meta[name="googlebot"]').getAttribute('content');
    if (googlebotMeta) {
      expect(googlebotMeta).toContain('index');
      expect(googlebotMeta).toContain('follow');
    }
  });

  test('should have accessible sitemap.xml', async ({ request }) => {
    // Test sitemap.xml is accessible
    const sitemapResponse = await request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    expect(sitemapResponse.status()).toBe(200);

    // Check content type
    const contentType = sitemapResponse.headers()['content-type'];
    expect(contentType).toMatch(/xml/);

    // Parse sitemap content
    const sitemapContent = await sitemapResponse.text();
    expect(sitemapContent).toContain('<?xml');
    expect(sitemapContent).toContain('<urlset');
    expect(sitemapContent).toContain('<url>');
    expect(sitemapContent).toContain('<loc>');
    expect(sitemapContent).toContain('https://');

    // Should include homepage
    expect(sitemapContent).toMatch(/arnavtiwari\.dev/);
  });

  test('should have accessible robots.txt with proper configuration', async ({ request }) => {
    // Test robots.txt is accessible
    const robotsResponse = await request.get('/robots.txt');
    expect(robotsResponse.ok()).toBeTruthy();
    expect(robotsResponse.status()).toBe(200);

    // Check content type
    const contentType = robotsResponse.headers()['content-type'];
    expect(contentType).toMatch(/text\/plain/);

    // Parse robots.txt content
    const robotsContent = await robotsResponse.text();
    
    // Should allow all user agents
    expect(robotsContent).toContain('User-agent: *');
    expect(robotsContent).toContain('Allow: /');

    // Should disallow API routes
    expect(robotsContent).toMatch(/Disallow:.*\/api/);

    // Should include sitemap reference
    expect(robotsContent).toContain('Sitemap:');
    expect(robotsContent).toMatch(/sitemap\.xml/);
  });

  test('should have proper viewport meta tag for responsive design', async ({ page }) => {
    // Check viewport meta tag
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toBeTruthy();
    expect(viewport).toContain('width=device-width');
    expect(viewport).toContain('initial-scale=1');
  });

  test('should have language attribute on html element', async ({ page }) => {
    // Check html lang attribute
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBeTruthy();
    expect(htmlLang).toBe('en');
  });

  test('should have proper charset declaration', async ({ page }) => {
    // Check charset meta tag
    const charset = await page.locator('meta[charset]').getAttribute('charset');
    expect(charset).toBeTruthy();
    expect(charset).toLowerCase().toBe('utf-8');
  });

  test('should have favicon configured', async ({ page }) => {
    // Check for favicon link
    const favicon = await page.locator('link[rel="icon"]').count();
    expect(favicon).toBeGreaterThan(0);
  });

  test('should have proper meta tags for mobile web app', async ({ page }) => {
    // Check theme-color for mobile browsers
    const themeColor = await page.locator('meta[name="theme-color"]').getAttribute('content');
    // Theme color is optional but recommended
    if (themeColor) {
      expect(themeColor).toMatch(/^#[0-9a-f]{3,6}$/i);
    }
  });

  test('should have complete metadata for all required SEO elements', async ({ page }) => {
    // Comprehensive check that all critical SEO elements are present
    const criticalElements = [
      { selector: 'title', name: 'Title tag' },
      { selector: 'meta[name="description"]', name: 'Meta description' },
      { selector: 'meta[property="og:title"]', name: 'Open Graph title' },
      { selector: 'meta[property="og:description"]', name: 'Open Graph description' },
      { selector: 'meta[property="og:image"]', name: 'Open Graph image' },
      { selector: 'meta[property="og:url"]', name: 'Open Graph URL' },
      { selector: 'link[rel="canonical"]', name: 'Canonical URL' },
      { selector: 'script[type="application/ld+json"]', name: 'Structured data' },
    ];

    for (const element of criticalElements) {
      const count = await page.locator(element.selector).count();
      expect(count, `${element.name} should be present`).toBeGreaterThan(0);
    }
  });
});
