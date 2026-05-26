/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-upcycle
 * Base block: carousel
 * Source: https://www.lg.com/ae/better-life/index
 * Selector: .hacm__swiper
 * Generated: 2026-05-26
 *
 * Extracts swiper slides with heading, optional description, and image.
 * Each slide becomes a row with image in the first cell and text content in the second cell.
 */
export default function parse(element, { document }) {
  // Extract all swiper slides from the carousel
  const slides = element.querySelectorAll('.swiper-slide');

  const cells = [];

  slides.forEach((slide) => {
    // Extract image from the slide
    const img = slide.querySelector('.hacm__img img, img');

    // Extract heading from the slide
    const heading = slide.querySelector('h2.hacm__title, h2, h3, [class*="title"]');

    // Extract optional description from the slide
    const description = slide.querySelector('p.hacm__desc, p');

    // Build the text content cell (heading + optional description)
    const textCell = [];
    if (heading) textCell.push(heading);
    if (description) textCell.push(description);

    // Build the row: [image cell, text content cell]
    // Following library example: image on left, heading+description on right
    const imageCell = img ? [img] : [];
    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-upcycle', cells });
  element.replaceWith(block);
}
