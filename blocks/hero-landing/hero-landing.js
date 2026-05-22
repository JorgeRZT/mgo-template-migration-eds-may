/**
 * Decorates the hero-landing block.
 * Note: EDS treats hero-landing as a section (not a block), so this JS
 * is also called from scripts.js for section-level decoration.
 * @param {HTMLElement} block The hero-landing element
 */
export default function decorate(block) {
  const firstRow = block.querySelector(':scope > div:first-child');
  if (!firstRow) return;

  const hasPicture = !!firstRow.querySelector('picture');

  // Convert video URL links to actual video elements
  const videoLink = firstRow.querySelector('a');
  if (videoLink && !hasPicture) {
    const href = videoLink.href || videoLink.textContent.trim();
    const isVideoUrl = href.includes('/is/content/') || href.endsWith('.mp4') || href.endsWith('.webm');

    if (isVideoUrl) {
      const video = document.createElement('video');
      video.src = href;
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');

      // Find the deepest container and replace the link
      const cell = videoLink.closest('div');
      if (cell) {
        cell.innerHTML = '';
        cell.appendChild(video);
      }
    } else {
      // Non-video, non-picture: mark as no-image
      block.classList.add('no-image');
    }
  } else if (!hasPicture) {
    block.classList.add('no-image');
  }
}
