/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-landing
 * Base block: hero
 * Source: https://shop.mango.com/es/es/h/home
 * Generated: 2026-05-22
 *
 * Full-viewport hero banner with background video or image,
 * centered heading (h2), and CTA link wrapping the entire banner.
 *
 * Variations handled:
 * - Video background (autoplay, muted, loop) with h2 + CTA text
 * - Image background (picture element) with h2 + CTA text
 * - Minimal/lazy-loaded: only anchor with title attribute, no media or heading
 */
export default function parse(element, { document }) {
  // Extract the wrapping anchor link (entire banner is clickable)
  const anchor = element.querySelector('a[href]');
  if (!anchor) return;

  const href = anchor.getAttribute('href') || '';
  const title = anchor.getAttribute('title') || '';

  // Extract media: video or picture/img
  const video = element.querySelector('video');
  const picture = element.querySelector('picture');
  const img = element.querySelector('img');

  // Extract heading (h2, with fallback to h1, h3)
  const heading = element.querySelector('h2, h1, h3');

  // Extract CTA text from the div sibling to the heading
  // Structure: <div class="...heroBannerTextCenterWrapper..."><h2>...</h2><div>CTA text</div></div>
  let ctaText = '';
  if (heading) {
    const ctaEl = heading.parentElement ? heading.parentElement.querySelector(':scope > div') : null;
    if (ctaEl) {
      ctaText = ctaEl.textContent.trim();
    }
  }

  // If no heading found, try to extract from anchor title
  // Pattern: "Descubre más summer living" -> heading could be "SUMMER LIVING"
  let headingText = '';
  if (!heading && title) {
    // Extract meaningful text from title - remove "Descubre más" prefix
    const titleParts = title.replace(/^Descubre más\s*/i, '');
    headingText = titleParts.toUpperCase();
    ctaText = ctaText || 'Descubre más';
  }

  // Build cells matching library example:
  // Row 1: media (video URL as link or image)
  // Row 2: heading
  // Row 3: CTA link
  const cells = [];

  // Row 1: Media
  if (video) {
    const videoSrc = video.getAttribute('src') || '';
    if (videoSrc) {
      const videoLink = document.createElement('a');
      videoLink.setAttribute('href', videoSrc);
      videoLink.textContent = videoSrc;
      cells.push([videoLink]);
    } else {
      // Fallback: use video poster as image
      const poster = video.getAttribute('poster');
      if (poster) {
        const posterImg = document.createElement('img');
        posterImg.setAttribute('src', poster);
        cells.push([posterImg]);
      }
    }
  } else if (picture) {
    // Use the img inside picture element
    const pictureImg = picture.querySelector('img');
    if (pictureImg) {
      cells.push([pictureImg]);
    }
  } else if (img) {
    cells.push([img]);
  }

  // Row 2: Heading
  if (heading) {
    cells.push([heading]);
  } else if (headingText) {
    const h2 = document.createElement('h2');
    h2.textContent = headingText;
    cells.push([h2]);
  }

  // Row 3: CTA link
  if (href) {
    const ctaLink = document.createElement('a');
    ctaLink.setAttribute('href', href);
    ctaLink.textContent = ctaText || title || 'Descubre más';
    cells.push([ctaLink]);
  }

  // Only create block if we have at least some content
  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-landing', cells });
  element.replaceWith(block);
}
