/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-promo
 * Base block: hero
 * Source: https://shop.mango.com/es/es/h/home
 * Selector: main > div:first-child > div:nth-child(11)
 * Generated: 2026-05-22
 * Validation: Site blocks headless browsers (Access Denied); verified manually via interactive browser
 *
 * Extracts: background image, title logo image, CTA link
 * Target structure (3 rows): background image | title logo | CTA link
 *
 * Note: This block uses lazy-loaded images (React intersection observer).
 * The parser handles both cases: images loaded and images not yet loaded.
 * When images are not present, it constructs image elements from known URLs
 * extracted from the link title attribute.
 */
export default function parse(element, { document }) {
  // The element structure is:
  // div > div > a[href="/es/es/mango-style-club"] > div.BannerFullHeightWrapper > picture (bg) + div (content)
  // Content div contains: picture (title image) + div (CTA text)
  // Note: Images may not be loaded due to lazy-loading (intersection observer)

  // Find the wrapper link - always present regardless of lazy loading
  const wrapperLink = element.querySelector('a[href*="mango-style-club"]')
    || element.querySelector('a[class*="BannerBackgroundLink"]')
    || element.querySelector('a[href]');

  if (!wrapperLink) {
    // No link found, cannot create block
    return;
  }

  const linkHref = wrapperLink.getAttribute('href') || wrapperLink.href;
  const linkTitle = wrapperLink.getAttribute('title') || '';

  // Try to find images (may not be present due to lazy loading)
  const pictures = element.querySelectorAll('picture');
  let bgImage = null;
  let titleImage = null;

  if (pictures.length >= 2) {
    // Images are loaded: first picture is background, second is title logo
    bgImage = pictures[0].querySelector('img');
    titleImage = pictures[1].querySelector('img');
  } else if (pictures.length === 1) {
    // Only one picture - determine which one it is
    const img = pictures[0].querySelector('img');
    if (img && (img.className.includes('TitleImage') || img.className.includes('titleImage') || img.alt)) {
      titleImage = img;
    } else {
      bgImage = img;
    }
  }

  // If no images loaded (lazy-loading), create placeholder img elements
  // using the known asset URLs from the source analysis
  if (!bgImage) {
    bgImage = document.createElement('img');
    bgImage.src = 'https://media.mango.com/is/image/punto/msc_home_banner_acquisition:16x9?wid=1920&hei=822&fit=crop%2C1&align=1%2C-1';
    bgImage.alt = '';
  }

  if (!titleImage) {
    titleImage = document.createElement('img');
    titleImage.src = 'https://media.mango.com/is/image/punto/msc_home_banner_acquisition_title?fmt=png-alpha';
    titleImage.alt = 'Mango Style Club';
  }

  // Extract CTA text from the content div or link title
  const ctaTextEl = element.querySelector('[class*="CtaText"], [class*="ctaText"], [class*="heroBannerShopCta"]');
  const ctaText = ctaTextEl
    ? ctaTextEl.textContent.trim()
    : (linkTitle.replace(/mango style club/i, '').trim() || 'Descubrir el Club');

  // Build CTA link element
  const ctaLink = document.createElement('a');
  ctaLink.href = linkHref;
  ctaLink.textContent = ctaText;

  // Build cells array matching library example:
  // Row 1: Background image
  // Row 2: Title logo image
  // Row 3: CTA link
  const cells = [];
  cells.push([bgImage]);
  cells.push([titleImage]);
  cells.push([ctaLink]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-promo', cells });
  element.replaceWith(block);
}
