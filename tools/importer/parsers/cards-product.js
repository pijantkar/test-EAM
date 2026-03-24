/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-product variant.
 * Base: cards. Source: https://www.lg.com/ru/monitor-buying-guide
 * Extracts product grid items from #resultCurProductList into cards block rows.
 * Each card row: [product image, product name (bold) + SKU + Where to Buy CTA]
 * Generated: 2026-03-24
 */
export default function parse(element, { document }) {
  const cells = [];

  // Each product is inside .list-box li .item
  const items = element.querySelectorAll('.list-box li .item, .list-box li .item.js-model');

  items.forEach((item) => {
    // Cell 1: Product image from a.visual > img.pc
    const img = item.querySelector('a.visual img.pc, a.visual img.lazyloaded, a.visual img');

    // Cell 2: Text content - product name, SKU, Where to Buy CTA
    const contentCell = [];

    // Product name as bold text
    const modelNameLink = item.querySelector('.model-name a, p.model-name a');
    if (modelNameLink) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = modelNameLink.textContent.trim();
      p.appendChild(strong);
      contentCell.push(p);
    }

    // SKU as description
    const skuLink = item.querySelector('.sku a');
    if (skuLink) {
      const p = document.createElement('p');
      p.textContent = skuLink.textContent.trim();
      contentCell.push(p);
    }

    // Where to Buy CTA link
    const wtbLink = item.querySelector('a.where-to-buy');
    if (wtbLink) {
      const a = document.createElement('a');
      a.href = wtbLink.href;
      a.textContent = wtbLink.textContent.trim();
      contentCell.push(a);
    }

    if (img || contentCell.length > 0) {
      cells.push([img || '', contentCell.length > 0 ? contentCell : '']);
    }
  });

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'cards-product', cells });
    element.replaceWith(block);
  }
}
