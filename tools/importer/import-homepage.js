/* eslint-disable */
/* global WebImporter */

import heroLandingParser from './parsers/hero-landing.js';
import columnsTilesParser from './parsers/columns-tiles.js';
import heroPromoParser from './parsers/hero-promo.js';

import mangoCleanupTransformer from './transformers/mango-cleanup.js';
import mangoSectionsTransformer from './transformers/mango-sections.js';

const parsers = {
  'hero-landing': heroLandingParser,
  'columns-tiles': columnsTilesParser,
  'hero-promo': heroPromoParser,
};

const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Mango homepage with hero banners, product categories, and promotional content',
  urls: [
    'https://shop.mango.com/es/es/h/home',
  ],
  blocks: [
    {
      name: 'hero-landing',
      instances: [
        'main > div:first-child > div:nth-child(4)',
        'main > div:first-child > div:nth-child(5)',
        'main > div:first-child > div:nth-child(8)',
        'main > div:first-child > div:nth-child(9)',
        'main > div:first-child > div:nth-child(10)',
      ],
    },
    {
      name: 'columns-tiles',
      instances: [
        "div[class*='FamilyBannerShop-module'][class*='root']",
      ],
    },
    {
      name: 'hero-promo',
      instances: [
        'main > div:first-child > div:nth-child(11)',
      ],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'SEO Category Navigation',
      selector: 'body > div:first-child > div:nth-child(3)',
      style: null,
      blocks: [],
      defaultContent: [
        'body > div:first-child > div:nth-child(3) h1',
        'body > div:first-child > div:nth-child(3) ul#seoBanner',
      ],
    },
    {
      id: 'section-2',
      name: 'Hero Video - New Now',
      selector: 'body > div:first-child > div:nth-child(4)',
      style: null,
      blocks: ['hero-landing'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Hero Image - Coleccion Verano',
      selector: 'body > div:first-child > div:nth-child(5)',
      style: null,
      blocks: ['hero-landing'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'Category Tiles Row 1',
      selector: 'body > div:first-child > div:nth-child(6)',
      style: null,
      blocks: ['columns-tiles'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'Category Tiles Row 2',
      selector: 'body > div:first-child > div:nth-child(7)',
      style: null,
      blocks: ['columns-tiles'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Hero Video - Summer Living',
      selector: 'body > div:first-child > div:nth-child(8)',
      style: null,
      blocks: ['hero-landing'],
      defaultContent: [],
    },
    {
      id: 'section-7',
      name: 'Hero Image - Coleccion Lino',
      selector: 'body > div:first-child > div:nth-child(9)',
      style: null,
      blocks: ['hero-landing'],
      defaultContent: [],
    },
    {
      id: 'section-8',
      name: 'Hero Image - Best Sellers',
      selector: 'body > div:first-child > div:nth-child(10)',
      style: null,
      blocks: ['hero-landing'],
      defaultContent: [],
    },
    {
      id: 'section-9',
      name: 'Mango Style Club Promotion',
      selector: 'body > div:first-child > div:nth-child(11)',
      style: null,
      blocks: ['hero-promo'],
      defaultContent: [],
    },
    {
      id: 'section-10',
      name: 'Newsletter Signup',
      selector: 'body > div:nth-child(2)',
      style: 'light-grey',
      blocks: [],
      defaultContent: [
        'body > div:nth-child(2) h2',
        'body > div:nth-child(2) form',
      ],
    },
  ],
};

const transformers = [
  mangoCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [mangoSectionsTransformer] : []),
];

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

function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
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

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

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

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

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
