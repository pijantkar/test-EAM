/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-benefit variant.
 * Base block: cards
 * Source: https://www.lg.com/ae/better-life/index
 * Selector: .benefit-more
 * Generated: 2026-05-26
 *
 * Extracts benefit items (title + description) from a swiper/grid layout
 * and produces a Cards block table with one row per benefit item.
 */
export default function parse(element, { document }) {
  // Prefer .benefit-more__item (contains .benefit-more__group); fallback to .benefit-more__group directly
  const benefitItems = element.querySelectorAll('.benefit-more__item');
  const groups = benefitItems.length > 0
    ? Array.from(benefitItems).map((item) => item.querySelector('.benefit-more__group') || item)
    : Array.from(element.querySelectorAll('.benefit-more__group'));

  const cells = [];

  groups.forEach((group) => {
    // Extract title - p.hacm__title or fallback to heading/strong elements
    const titleEl = group.querySelector('p.hacm__title, .hacm__title, h3, h4, strong');
    // Extract description - p.hacm__desc or fallback
    const descEl = group.querySelector('p.hacm__desc, .hacm__desc');

    const cellContent = [];

    if (titleEl) {
      // Bold title to match library example format: **Benefit Title**
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      cellContent.push(strong);
    }

    if (descEl) {
      const br = document.createElement('br');
      cellContent.push(br);
      const descText = document.createTextNode(descEl.textContent.trim());
      cellContent.push(descText);
    }

    if (cellContent.length > 0) {
      // Library example shows two columns: empty image cell + content cell
      cells.push(['', cellContent]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-benefit', cells });
  element.replaceWith(block);
}
