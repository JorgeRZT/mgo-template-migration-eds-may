/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Mango section breaks and section metadata.
 * Inserts <hr> between sections and adds Section Metadata blocks where sections have styles.
 * Section selectors verified against migration-work/cleaned.html.
 *
 * Sections from page-templates.json:
 *   section-1:  body > div:first-child > div:nth-child(3)   (SEO Category Navigation)
 *   section-2:  body > div:first-child > div:nth-child(4)   (Hero Video - New Now)
 *   section-3:  body > div:first-child > div:nth-child(5)   (Hero Image - Coleccion Verano)
 *   section-4:  body > div:first-child > div:nth-child(6)   (Category Tiles Row 1)
 *   section-5:  body > div:first-child > div:nth-child(7)   (Category Tiles Row 2)
 *   section-6:  body > div:first-child > div:nth-child(8)   (Hero Video - Summer Living)
 *   section-7:  body > div:first-child > div:nth-child(9)   (Hero Image - Coleccion Lino)
 *   section-8:  body > div:first-child > div:nth-child(10)  (Hero Image - Best Sellers)
 *   section-9:  body > div:first-child > div:nth-child(11)  (Mango Style Club Promotion)
 *   section-10: body > div:nth-child(2)                      (Newsletter Signup, style: light-grey)
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

/**
 * Resolves a section selector to a DOM element.
 * The validator sets element = document.body, so selectors with 'body >' prefix
 * need to be adapted to query relative to element using :scope.
 */
function findSectionElement(selector, element, document) {
  // Try the full selector on document first (works in real import context)
  let el = document.querySelector(selector);
  if (el) return el;

  // Adapt: element IS body, so replace 'body > ' with ':scope > '
  const scopeSelector = selector.replace(/^body\s*>\s*/, ':scope > ');
  el = element.querySelector(scopeSelector);
  if (el) return el;

  return null;
}

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { document } = payload;
    const sections = payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    // Process sections in reverse order to avoid offset issues when inserting elements
    const reversedSections = [...sections].reverse();

    reversedSections.forEach((section) => {
      const sectionEl = findSectionElement(section.selector, element, document);
      if (!sectionEl) return;

      // Add Section Metadata block after the section content if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.append(sectionMetadata);
      }

      // Insert <hr> before the section element (except for the first section)
      const isFirstSection = sections.indexOf(section) === 0;
      if (!isFirstSection) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    });
  }
}
