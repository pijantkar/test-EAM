/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-campaign
 * Base block: hero
 * Source: https://www.lg.com/ae/better-life/index
 * Selector: .hacm__article.hero
 * Generated: 2026-05-26
 *
 * Source structure:
 * - .hacm__img.visual__img > video.pc_only (background video desktop)
 * - .hacm__img.visual__img > video.mo_only (background video mobile)
 * - .hacm__container > h1.hacm__title (heading)
 * - .hacm__container > p.hacm__desc (description)
 * - .hacm__container > .hacm__button > a (CTA)
 */
export default function parse(element, { document }) {
  // Extract background video (prefer desktop version, fallback to mobile)
  const bgVideo = element.querySelector('video.pc_only, video.mo_only, .hacm__img video');

  // Extract heading
  const heading = element.querySelector('h1.hacm__title, h1, h2, [class*="title"]');

  // Extract description
  const description = element.querySelector('p.hacm__desc, p, [class*="desc"]');

  // Extract CTA link(s)
  const ctaLinks = Array.from(
    element.querySelectorAll('.hacm__button a, .hacm__container a[class*="btn"], .hacm__container a.hacm__item')
  ).filter((a) => a.textContent.trim().length > 0);

  // Build cells matching the block library table structure:
  // Row 1: background image/video
  // Row 2: heading
  // Row 3: description
  // Row 4: CTA button
  const cells = [];

  // Row 1: Background media (video or fallback image)
  if (bgVideo) {
    // Create a link to the video source for import
    const videoSrc = bgVideo.getAttribute('src') || '';
    if (videoSrc) {
      const videoLink = document.createElement('a');
      videoLink.href = videoSrc;
      videoLink.textContent = videoSrc;
      cells.push([videoLink]);
    } else {
      cells.push([bgVideo]);
    }
  } else {
    // Fallback: look for background image
    const bgImage = element.querySelector('.hacm__img img, img');
    if (bgImage) {
      cells.push([bgImage]);
    }
  }

  // Row 2: Heading
  if (heading) {
    cells.push([heading]);
  }

  // Row 3: Description (optional per block library)
  if (description) {
    cells.push([description]);
  }

  // Row 4: CTA buttons
  if (ctaLinks.length > 0) {
    cells.push(ctaLinks);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-campaign', cells });
  element.replaceWith(block);
}
