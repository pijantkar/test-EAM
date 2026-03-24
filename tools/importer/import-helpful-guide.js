/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import cardsParser from './parsers/cards.js';

// TRANSFORMER IMPORTS
import lgCleanupTransformer from './transformers/lg-cleanup.js';
import lgSectionsTransformer from './transformers/lg-sections.js';

// PARSER REGISTRY
const parsers = {
  'cards': cardsParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'helpful-guide',
  description: 'LG Story helpful guide article pages with product advice, how-tos, and buying guides',
  urls: [
    'https://www.lg.com/ae/lg-story/helpful-guide/best-gaming-monitor-for-2022/index',
  ],
  blocks: [
    {
      name: 'cards',
      instances: [
        '.more-items-block .entry-container',
        '.promos-wrapper .impulse-promo',
      ],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Article Header',
      selector: '.page-header',
      style: null,
      blocks: [],
      defaultContent: ['.page-title', '.details'],
    },
    {
      id: 'section-2',
      name: 'Article Body',
      selector: '.main-content .module-editable-content:first-child .inner',
      style: null,
      blocks: [],
      defaultContent: ['.image-wrapper img', '.editable-content h2', '.editable-content h3', '.editable-content p'],
    },
    {
      id: 'section-3',
      name: 'Related Articles',
      selector: '.more-items-block',
      style: null,
      blocks: ['cards'],
      defaultContent: ['h3'],
    },
    {
      id: 'section-4',
      name: 'Featured Products',
      selector: '.sidebar .promos-wrapper',
      style: null,
      blocks: ['cards'],
      defaultContent: ['.promos-wrapper-title'],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  lgCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [lgSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
