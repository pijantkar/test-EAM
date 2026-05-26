/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-story
 * Base block: cards
 * Source: https://www.lg.com/ae/better-life/index
 * Selector: .rectangle-box
 * Generated: 2026-05-26
 *
 * Wide image cards with character/person name, short description, and CTA link.
 * Used for related story teasers.
 */
export default function parse(element, { document }) {
  // Extract all card items from the container
  const items = element.querySelectorAll('.rectangle-box__item');

  const cells = [];

  items.forEach((item) => {
    // Extract image from .hacm__img
    const image = item.querySelector('.hacm__img img');

    // Extract title (person/character name) - bold in output
    const title = item.querySelector('.hacm__title');

    // Extract description
    const description = item.querySelector('.hacm__desc');

    // Extract CTA link
    const ctaLink = item.querySelector('.hacm__button a');

    // Build the image cell
    const imageCell = [];
    if (image) {
      imageCell.push(image);
    }

    // Build the content cell: bold title, description, CTA link
    const contentCell = [];
    if (title) {
      // Wrap title text in bold (strong element)
      const strong = document.createElement('strong');
      strong.textContent = title.textContent;
      contentCell.push(strong);
    }
    if (description) {
      contentCell.push(description);
    }
    if (ctaLink) {
      contentCell.push(ctaLink);
    }

    // Each card is a row with two cells: [image, content]
    if (imageCell.length > 0 || contentCell.length > 0) {
      cells.push([imageCell, contentCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-story', cells });
  element.replaceWith(block);
}
