/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards block.
 * Base: cards. Source: lg.com/ae helpful-guide pages.
 * Handles two instance types:
 *   1. Related article cards (.entry-container inside .more-items-block)
 *   2. Featured product cards (.impulse-promo inside .promos-wrapper)
 * Generated: 2026-03-19
 */
export default function parse(element, { document }) {
  const cells = [];

  // Detect which type of cards we're parsing
  const entryContainers = element.querySelectorAll('.entry-container');
  const impulsePromos = element.querySelectorAll('.impulse-promo .promo');

  if (entryContainers.length > 0) {
    // Type 1: Related article cards (.more-items-block .entry-container)
    entryContainers.forEach((card) => {
      // Cell 1: Image
      const img = card.querySelector('.image-wrapper img');
      // Cell 2: Text content - title, description, link
      const contentCell = [];
      const title = card.querySelector('.entry-title a, h3 a');
      if (title) {
        const h = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        h.appendChild(strong);
        contentCell.push(h);
      }
      const desc = card.querySelector('.copy, p.copy');
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        contentCell.push(p);
      }
      const link = card.querySelector('.entry-link, a.entry-link');
      if (link) {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.textContent.trim();
        contentCell.push(a);
      }
      if (img || contentCell.length > 0) {
        cells.push([img || '', contentCell.length > 0 ? contentCell : '']);
      }
    });
  } else if (impulsePromos.length > 0) {
    // Type 2: Featured product cards (.promos-wrapper .impulse-promo)
    impulsePromos.forEach((card) => {
      // Cell 1: Product image
      const img = card.querySelector('.column-image img, .image-wrapper img');
      // Cell 2: Product name and CTA
      const contentCell = [];
      const name = card.querySelector('.promo-title-featured-product');
      if (name) {
        const p = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = name.textContent.trim();
        p.appendChild(strong);
        contentCell.push(p);
      }
      const cta = card.querySelector('.btn-promo, a.btn-promo');
      if (cta) {
        const a = document.createElement('a');
        a.href = cta.href;
        a.textContent = cta.textContent.trim();
        contentCell.push(a);
      }
      if (img || contentCell.length > 0) {
        cells.push([img || '', contentCell.length > 0 ? contentCell : '']);
      }
    });
  }

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });
    element.replaceWith(block);
  }
}
