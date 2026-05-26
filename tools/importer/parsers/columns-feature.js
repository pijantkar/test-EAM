/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-feature
 * Base block: columns
 * Source selector: .hacm__video
 * Generated: 2026-05-26
 *
 * Extracts video/media content and feature descriptions into a two-column
 * Columns block layout. Video in left column, feature text in right column.
 */
export default function parse(element, { document }) {
  // Extract video element - validated against source HTML (.hacm__video > video#nudgeVMW1)
  const video = element.querySelector('video');

  // Build the media/video cell (left column)
  const mediaCell = [];
  if (video) {
    // Get video src from the element or nested source element
    const videoSrc = video.getAttribute('src')
      || (video.querySelector('source') ? video.querySelector('source').getAttribute('src') : null);
    if (videoSrc) {
      // Represent video as a link to the video file (standard import pattern)
      const link = document.createElement('a');
      link.href = videoSrc;
      link.textContent = videoSrc;
      mediaCell.push(link);
    } else {
      mediaCell.push(video);
    }
  }

  // Extract feature text content - headings and descriptions
  // Source HTML (.hacm__video) primarily contains video; text may be added
  // by page-level scripts or exist in sub-containers on other pages
  const contentCell = [];

  // Look for headings - exclude video control anchors (nudge_play_btn/nudge_pause_btn)
  const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6, .hacm__title');
  const descriptions = element.querySelectorAll('p, .hacm__desc');

  headings.forEach((heading) => {
    contentCell.push(heading);
  });
  descriptions.forEach((desc) => {
    contentCell.push(desc);
  });

  // If no text content found, the block still needs a valid second column
  if (contentCell.length === 0) {
    const placeholder = document.createElement('p');
    placeholder.textContent = '';
    contentCell.push(placeholder);
  }

  // Build cells matching library example: one row with two columns [video | features]
  const cells = [
    [mediaCell.length > 0 ? mediaCell : '', contentCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
