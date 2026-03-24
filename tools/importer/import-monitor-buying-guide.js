/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import cardsProductParser from './parsers/cards-product.js';

// TRANSFORMER IMPORTS
import lgCleanupTransformer from './transformers/lg-cleanup.js';
import lgSectionsTransformer from './transformers/lg-sections.js';

// PARSER REGISTRY
const parsers = {
  'cards-product': cardsProductParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'monitor-buying-guide',
  description: 'Monitor buying guide page with product recommendations and comparison information',
  urls: [
    'https://www.lg.com/ru/monitor-buying-guide',
  ],
  blocks: [
    {
      name: 'cards-product',
      instances: [
        '#resultCurProductList',
      ],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Page Title',
      selector: '.title-wrap',
      style: null,
      blocks: [],
      defaultContent: ['.title-wrap h1'],
    },
    {
      id: 'section-2',
      name: 'Interactive Quiz/Configurator',
      selector: '.step.step1',
      style: null,
      blocks: [],
      defaultContent: ['.step.step1 .message', '.step.step1 .list-box'],
    },
    {
      id: 'section-3',
      name: 'Product Recommendations',
      selector: '#result-box-aria',
      style: null,
      blocks: ['cards-product'],
      defaultContent: ['.result-curation-head'],
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
