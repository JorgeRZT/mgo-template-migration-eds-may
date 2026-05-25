/**
 * Decorates the hero-landing block/section.
 * Converts video URL links to actual video elements and sets up the overlay layout.
 * Works both with block table structure (local) and default-content-wrapper (.page/.live).
 * @param {HTMLElement} block The hero-landing element
 */
export default function decorate(block) {
  // Find the content container - either first row div (block table) or default-content-wrapper
  const firstRow = block.querySelector(':scope > div:first-child');
  if (!firstRow) return;

  const contentArea = firstRow.querySelector('.default-content-wrapper') || firstRow;
  const hasPicture = !!contentArea.querySelector('picture');

  // Find video link - check both in firstRow (block structure) and contentArea (.page structure)
  const videoLink = contentArea.querySelector('a[title*="/is/content/"], a[href*="/is/content/"]')
    || contentArea.querySelector('a[href$=".mp4"], a[href$=".webm"]');

  if (videoLink && !hasPicture) {
    const originalUrl = videoLink.getAttribute('title') || videoLink.textContent.trim() || videoLink.href;
    const isVideoUrl = originalUrl.includes('/is/content/')
      || originalUrl.endsWith('.mp4')
      || originalUrl.endsWith('.webm');

    if (isVideoUrl) {
      const videoSrc = originalUrl.startsWith('http') ? originalUrl : videoLink.href;

      const video = document.createElement('video');
      video.src = videoSrc;
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('muted', '');
      video.setAttribute('autoplay', '');

      // Replace the link with the video element
      const linkParent = videoLink.parentElement;
      if (linkParent) {
        linkParent.replaceChild(video, videoLink);
      }
    } else {
      block.classList.add('no-image');
    }
  } else if (!hasPicture) {
    // Check if there's a video link anywhere else in the block (non-standard structure)
    const anyVideoLink = block.querySelector('a[title*="/is/content/"], a[href*="/is/content/"]');
    if (anyVideoLink) {
      const originalUrl = anyVideoLink.getAttribute('title') || anyVideoLink.textContent.trim() || anyVideoLink.href;
      const videoSrc = originalUrl.startsWith('http') ? originalUrl : anyVideoLink.href;

      const video = document.createElement('video');
      video.src = videoSrc;
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('muted', '');
      video.setAttribute('autoplay', '');

      const linkParent = anyVideoLink.parentElement;
      if (linkParent) {
        linkParent.replaceChild(video, anyVideoLink);
      }
    } else {
      block.classList.add('no-image');
    }
  }
}
