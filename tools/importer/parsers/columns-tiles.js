/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-tiles variant.
 * Base block: columns
 * Source: https://shop.mango.com/es/es/h/home
 * Generated: 2026-05-22
 *
 * Extracts a 2-column tile layout where each column contains a clickable image
 * tile with an overlaid category heading. Each column is a link to a category page.
 * Note: Images may be lazy-loaded; parser handles missing images gracefully.
 *
 * Source structure:
 * - Root: div.FamilyBannerShop-module__pOQkQG__root
 *   - 2x div.FamilyBannerShop-module__pOQkQG__familyBannerWrapper
 *     - a (link to category with title attribute)
 *       - picture > img (category image)
 *       - h2.FamilyBannerShopText-module__ObEJ8a__title (category name)
 *
 * Target: Columns block with 1 row, 2 cells. Each cell = image + heading link.
 */
export default function parse(element, { document }) {
  // The element may be the section container or the root div itself.
  // Find the FamilyBannerShop root that contains the tile wrappers.
  const root = element.querySelector('[class*="FamilyBannerShop-module"][class*="root"]') || element;

  // Select only the direct div children that are tile wrappers (not anchor elements)
  const wrappers = root.querySelectorAll(':scope > div[class*="familyBannerWrapper"]');

  // If no div wrappers found, try finding anchor links directly as tiles
  const tiles = wrappers.length > 0
    ? wrappers
    : root.querySelectorAll('a[class*="familyBannerWrapper"], a[class*="BannerBackgroundLinkWrapper"]');

  const cells = [];
  const row = [];

  tiles.forEach((tile) => {
    // Determine the link element
    const link = tile.tagName === 'A'
      ? tile
      : tile.querySelector('a[href]');

    if (!link) return;

    const href = link.getAttribute('href');
    const title = link.getAttribute('title') || '';

    // Find the image inside the picture element
    const img = link.querySelector('img[class*="image"], picture img, img');

    // Find the heading text
    const heading = link.querySelector('h2[class*="title"], h2, h3');

    // Build cell content: image + linked heading
    const cellContent = [];

    if (img) {
      // Create a clean image element with meaningful alt text
      const cleanImg = document.createElement('img');
      cleanImg.src = img.getAttribute('src') || img.src;
      cleanImg.alt = heading ? heading.textContent.trim() : (title || '');
      cellContent.push(cleanImg);
    }

    if (heading && href) {
      // Create a linked heading to preserve the category navigation
      const linkedHeading = document.createElement('h2');
      const headingLink = document.createElement('a');
      headingLink.href = href;
      headingLink.textContent = heading.textContent.trim();
      linkedHeading.appendChild(headingLink);
      cellContent.push(linkedHeading);
    } else if (heading) {
      const cleanHeading = document.createElement('h2');
      cleanHeading.textContent = heading.textContent.trim();
      cellContent.push(cleanHeading);
    } else if (href) {
      // Fallback: use title attribute as link text
      const fallbackLink = document.createElement('a');
      fallbackLink.href = href;
      fallbackLink.textContent = title || href;
      cellContent.push(fallbackLink);
    }

    if (cellContent.length > 0) {
      row.push(cellContent);
    }
  });

  if (row.length > 0) {
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-tiles', cells });
  element.replaceWith(block);
}
