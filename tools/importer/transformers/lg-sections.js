/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: LG UAE section breaks.
 * Adds section breaks (<hr>) between content sections based on template definitions.
 * Selectors from captured DOM of lg.com/ae pages.
 * Templates: helpful-guide (4 sections), news-article (4 sections),
 *            brand-page (7 sections), monitor-buying-guide (3 sections).
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { document } = payload;
    const sections = payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    // Process sections in reverse order to avoid index shifts
    const sectionElements = [];
    for (const section of sections) {
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      let found = null;
      for (const sel of selectors) {
        found = element.querySelector(sel);
        if (found) break;
      }
      if (found) {
        sectionElements.push({ section, el: found });
      }
    }

    // Insert section breaks and section-metadata in reverse order
    for (let i = sectionElements.length - 1; i >= 0; i--) {
      const { section, el } = sectionElements[i];

      // Add section-metadata block if section has a style
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        el.parentNode.insertBefore(metaBlock, el.nextSibling);
      }

      // Add <hr> before each section except the first
      if (i > 0) {
        const hr = document.createElement('hr');
        el.parentNode.insertBefore(hr, el);
      }
    }
  }
}
