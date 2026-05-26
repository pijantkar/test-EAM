/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroCampaignParser from './parsers/hero-campaign.js';
import columnsStorytellParser from './parsers/columns-storytell.js';
import carouselUpcycleParser from './parsers/carousel-upcycle.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import cardsProductParser from './parsers/cards-product.js';
import cardsBenefitParser from './parsers/cards-benefit.js';
import cardsStoryParser from './parsers/cards-story.js';

// TRANSFORMER IMPORTS
import lgCleanupTransformer from './transformers/lg-cleanup.js';
import lgSectionsTransformer from './transformers/lg-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-campaign': heroCampaignParser,
  'columns-storytell': columnsStorytellParser,
  'carousel-upcycle': carouselUpcycleParser,
  'columns-feature': columnsFeatureParser,
  'cards-product': cardsProductParser,
  'cards-benefit': cardsBenefitParser,
  'cards-story': cardsStoryParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  lgCleanupTransformer,
  lgSectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'brand-page',
  description: 'Brand marketing microsite pages showcasing LG lifestyle and product ecosystems',
  urls: [
    'https://www.lg.com/ae/better-life/index',
  ],
  blocks: [
    {
      name: 'hero-campaign',
      instances: ['.hacm__article.hero'],
    },
    {
      name: 'columns-storytell',
      instances: ['.content-variable.more__section'],
    },
    {
      name: 'carousel-upcycle',
      instances: ['.hacm__swiper'],
    },
    {
      name: 'columns-feature',
      instances: ['.hacm__video'],
    },
    {
      name: 'cards-product',
      instances: ['.product-list'],
    },
    {
      name: 'cards-benefit',
      instances: ['.benefit-more'],
    },
    {
      name: 'cards-story',
      instances: ['.rectangle-box'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: '.hacm__article.hero',
      style: null,
      blocks: ['hero-campaign'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Story',
      selector: '.content-split',
      style: null,
      blocks: ['columns-storytell'],
      defaultContent: ['.content-split .hacm__title', '.content-split .hacm__desc'],
    },
    {
      id: 'section-3',
      name: 'Upcycle Carousel',
      selector: '.hacm__swiper',
      style: null,
      blocks: ['carousel-upcycle'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'USP Features',
      selector: '.hacm__video',
      style: null,
      blocks: ['columns-feature'],
      defaultContent: ['.hacm__video .hacm__title'],
    },
    {
      id: 'section-5',
      name: 'Product Picks',
      selector: '.column.featured-product',
      style: 'light-grey',
      blocks: ['cards-product'],
      defaultContent: ['.column.featured-product .hacm__title'],
    },
    {
      id: 'section-6',
      name: 'Sign Up Benefits',
      selector: '.benefit-more',
      style: null,
      blocks: ['cards-benefit'],
      defaultContent: ['.benefit-more .hacm__title'],
    },
    {
      id: 'section-7',
      name: 'Other Stories',
      selector: '.rectangle-box',
      style: null,
      blocks: ['cards-story'],
      defaultContent: ['.rectangle-box .hacm__title'],
    },
  ],
};

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
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
  console.log(`Found ${pageBlocks.length} block instances on page`);
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
      } else {
        console.warn(`No parser found for block: ${block.name}`);
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
