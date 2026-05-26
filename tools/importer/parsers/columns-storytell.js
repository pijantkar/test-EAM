/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-storytell
 * Base block: columns
 * Source: https://www.lg.com/ae/better-life/index
 * Selector: .content-variable.more__section
 * Generated: 2026-05-26
 *
 * Extracts a two-column layout with text (title + description) in column 1
 * and an image in column 2, matching the Columns block library structure.
 */
export default function parse(element, { document }) {
  // Extract text content from the content column
  const title = element.querySelector('.hacm__title, .content-variable__cont p:first-child, [class*="title"]');
  const description = element.querySelector('.hacm__desc, .content-variable__cont p:nth-child(2), [class*="desc"]');

  // Extract image from the image column
  const image = element.querySelector('.hacm__img img, .content-variable__row img, img');

  // Build text cell content (column 1)
  const textCell = [];
  if (title) {
    // Convert title paragraph to a heading for proper semantics
    const heading = document.createElement('h2');
    heading.textContent = title.textContent.trim();
    textCell.push(heading);
  }
  if (description) {
    textCell.push(description);
  }

  // Build image cell content (column 2)
  const imageCell = [];
  if (image) {
    imageCell.push(image);
  }

  // Build cells array matching library example: [text content | image]
  const cells = [
    [textCell, imageCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-storytell', cells });
  element.replaceWith(block);
}
