/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-product
 * Base block: cards
 * Source: https://www.lg.com/ae/better-life/index
 * Selectors: .product-list, #resultCurProductList
 * Generated: 2026-05-26
 *
 * Extracts product cards from a product listing container.
 * Each product has an image, name/SKU, and CTA buttons.
 * Target structure: two-column rows (image | content with name, description, CTAs)
 */
export default function parse(element, { document }) {
  // Find all product items within the container
  const productItems = element.querySelectorAll('.product-list__item .product__item, .product__item, [class*="product-item"]');

  const cells = [];

  productItems.forEach((item) => {
    // Extract product image
    const img = item.querySelector('.product__img img, img');

    // Extract product name
    const productName = item.querySelector('.product__name, [class*="product-name"], [class*="product__title"]');

    // Extract product SKU/model number as description
    const productSku = item.querySelector('.product__sn, [class*="product__sn"], [class*="model-number"]');

    // Extract CTA links (prefer .hacm__button container, fallback to btn-class anchors)
    const ctaContainer = item.querySelector('.hacm__button');
    const ctaLinks = ctaContainer
      ? Array.from(ctaContainer.querySelectorAll('a'))
      : Array.from(item.querySelectorAll('a[class*="btn"]'));

    // Build the image cell
    const imageCell = [];
    if (img) {
      imageCell.push(img);
    }

    // Build the content cell: product name (bold), SKU/description, CTAs
    const contentCell = [];
    if (productName) {
      const strong = document.createElement('strong');
      strong.textContent = productName.textContent.trim();
      contentCell.push(strong);
    }
    if (productSku) {
      const skuPara = document.createElement('p');
      skuPara.textContent = productSku.textContent.trim();
      contentCell.push(skuPara);
    }
    if (ctaLinks.length > 0) {
      contentCell.push(...ctaLinks);
    }

    // Only add row if we have meaningful content
    if (imageCell.length > 0 || contentCell.length > 0) {
      cells.push([imageCell, contentCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-product', cells });
  element.replaceWith(block);
}
