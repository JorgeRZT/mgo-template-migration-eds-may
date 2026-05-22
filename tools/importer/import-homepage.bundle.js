/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-landing.js
  function parse(element, { document }) {
    const anchor = element.querySelector("a[href]");
    if (!anchor) return;
    const href = anchor.getAttribute("href") || "";
    const title = anchor.getAttribute("title") || "";
    const video = element.querySelector("video");
    const picture = element.querySelector("picture");
    const img = element.querySelector("img");
    const heading = element.querySelector("h2, h1, h3");
    let ctaText = "";
    if (heading) {
      const ctaEl = heading.parentElement ? heading.parentElement.querySelector(":scope > div") : null;
      if (ctaEl) {
        ctaText = ctaEl.textContent.trim();
      }
    }
    let headingText = "";
    if (!heading && title) {
      const titleParts = title.replace(/^Descubre más\s*/i, "");
      headingText = titleParts.toUpperCase();
      ctaText = ctaText || "Descubre m\xE1s";
    }
    const cells = [];
    if (video) {
      const videoSrc = video.getAttribute("src") || "";
      if (videoSrc) {
        const videoLink = document.createElement("a");
        videoLink.setAttribute("href", videoSrc);
        videoLink.textContent = videoSrc;
        cells.push([videoLink]);
      } else {
        const poster = video.getAttribute("poster");
        if (poster) {
          const posterImg = document.createElement("img");
          posterImg.setAttribute("src", poster);
          cells.push([posterImg]);
        }
      }
    } else if (picture) {
      const pictureImg = picture.querySelector("img");
      if (pictureImg) {
        cells.push([pictureImg]);
      }
    } else if (img) {
      cells.push([img]);
    }
    if (heading) {
      cells.push([heading]);
    } else if (headingText) {
      const h2 = document.createElement("h2");
      h2.textContent = headingText;
      cells.push([h2]);
    }
    if (href) {
      const ctaLink = document.createElement("a");
      ctaLink.setAttribute("href", href);
      ctaLink.textContent = ctaText || title || "Descubre m\xE1s";
      cells.push([ctaLink]);
    }
    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-landing", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-tiles.js
  function parse2(element, { document }) {
    const root = element.querySelector('[class*="FamilyBannerShop-module"][class*="root"]') || element;
    const wrappers = root.querySelectorAll(':scope > div[class*="familyBannerWrapper"]');
    const tiles = wrappers.length > 0 ? wrappers : root.querySelectorAll('a[class*="familyBannerWrapper"], a[class*="BannerBackgroundLinkWrapper"]');
    const cells = [];
    const row = [];
    tiles.forEach((tile) => {
      const link = tile.tagName === "A" ? tile : tile.querySelector("a[href]");
      if (!link) return;
      const href = link.getAttribute("href");
      const title = link.getAttribute("title") || "";
      const img = link.querySelector('img[class*="image"], picture img, img');
      const heading = link.querySelector('h2[class*="title"], h2, h3');
      const cellContent = [];
      if (img) {
        const cleanImg = document.createElement("img");
        cleanImg.src = img.getAttribute("src") || img.src;
        cleanImg.alt = heading ? heading.textContent.trim() : title || "";
        cellContent.push(cleanImg);
      }
      if (heading && href) {
        const linkedHeading = document.createElement("h2");
        const headingLink = document.createElement("a");
        headingLink.href = href;
        headingLink.textContent = heading.textContent.trim();
        linkedHeading.appendChild(headingLink);
        cellContent.push(linkedHeading);
      } else if (heading) {
        const cleanHeading = document.createElement("h2");
        cleanHeading.textContent = heading.textContent.trim();
        cellContent.push(cleanHeading);
      } else if (href) {
        const fallbackLink = document.createElement("a");
        fallbackLink.href = href;
        fallbackLink.textContent = title || href;
        cellContent.push(fallbackLink);
      }
      if (cellContent.length > 0) {
        row.push(cellContent);
      }
    });
    if (row.length > 0) {
      cells.push(row);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-tiles", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-promo.js
  function parse3(element, { document }) {
    const wrapperLink = element.querySelector('a[href*="mango-style-club"]') || element.querySelector('a[class*="BannerBackgroundLink"]') || element.querySelector("a[href]");
    if (!wrapperLink) {
      return;
    }
    const linkHref = wrapperLink.getAttribute("href") || wrapperLink.href;
    const linkTitle = wrapperLink.getAttribute("title") || "";
    const pictures = element.querySelectorAll("picture");
    let bgImage = null;
    let titleImage = null;
    if (pictures.length >= 2) {
      bgImage = pictures[0].querySelector("img");
      titleImage = pictures[1].querySelector("img");
    } else if (pictures.length === 1) {
      const img = pictures[0].querySelector("img");
      if (img && (img.className.includes("TitleImage") || img.className.includes("titleImage") || img.alt)) {
        titleImage = img;
      } else {
        bgImage = img;
      }
    }
    if (!bgImage) {
      bgImage = document.createElement("img");
      bgImage.src = "https://media.mango.com/is/image/punto/msc_home_banner_acquisition:16x9?wid=1920&hei=822&fit=crop%2C1&align=1%2C-1";
      bgImage.alt = "";
    }
    if (!titleImage) {
      titleImage = document.createElement("img");
      titleImage.src = "https://media.mango.com/is/image/punto/msc_home_banner_acquisition_title?fmt=png-alpha";
      titleImage.alt = "Mango Style Club";
    }
    const ctaTextEl = element.querySelector('[class*="CtaText"], [class*="ctaText"], [class*="heroBannerShopCta"]');
    const ctaText = ctaTextEl ? ctaTextEl.textContent.trim() : linkTitle.replace(/mango style club/i, "").trim() || "Descubrir el Club";
    const ctaLink = document.createElement("a");
    ctaLink.href = linkHref;
    ctaLink.textContent = ctaText;
    const cells = [];
    cells.push([bgImage]);
    cells.push([titleImage]);
    cells.push([ctaLink]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/mango-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, ['[class*="Loader-module"]']);
      WebImporter.DOMUtils.remove(element, ['[class*="srOnly-module"]']);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, ['[class*="ExpandableTextByLink-module"]']);
      element.querySelectorAll("[style]").forEach((el) => {
        el.removeAttribute("style");
      });
    }
  }

  // tools/importer/transformers/mango-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function findSectionElement(selector, element, document) {
    let el = document.querySelector(selector);
    if (el) return el;
    const scopeSelector = selector.replace(/^body\s*>\s*/, ":scope > ");
    el = element.querySelector(scopeSelector);
    if (el) return el;
    return null;
  }
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const sections = payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const reversedSections = [...sections].reverse();
      reversedSections.forEach((section) => {
        const sectionEl = findSectionElement(section.selector, element, document);
        if (!sectionEl) return;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.append(sectionMetadata);
        }
        const isFirstSection = sections.indexOf(section) === 0;
        if (!isFirstSection) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      });
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-landing": parse,
    "columns-tiles": parse2,
    "hero-promo": parse3
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Mango homepage with hero banners, product categories, and promotional content",
    urls: [
      "https://shop.mango.com/es/es/h/home"
    ],
    blocks: [
      {
        name: "hero-landing",
        instances: [
          "main > div:first-child > div:nth-child(4)",
          "main > div:first-child > div:nth-child(5)",
          "main > div:first-child > div:nth-child(8)",
          "main > div:first-child > div:nth-child(9)",
          "main > div:first-child > div:nth-child(10)"
        ]
      },
      {
        name: "columns-tiles",
        instances: [
          "div[class*='FamilyBannerShop-module'][class*='root']"
        ]
      },
      {
        name: "hero-promo",
        instances: [
          "main > div:first-child > div:nth-child(11)"
        ]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "SEO Category Navigation",
        selector: "body > div:first-child > div:nth-child(3)",
        style: null,
        blocks: [],
        defaultContent: [
          "body > div:first-child > div:nth-child(3) h1",
          "body > div:first-child > div:nth-child(3) ul#seoBanner"
        ]
      },
      {
        id: "section-2",
        name: "Hero Video - New Now",
        selector: "body > div:first-child > div:nth-child(4)",
        style: null,
        blocks: ["hero-landing"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Hero Image - Coleccion Verano",
        selector: "body > div:first-child > div:nth-child(5)",
        style: null,
        blocks: ["hero-landing"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Category Tiles Row 1",
        selector: "body > div:first-child > div:nth-child(6)",
        style: null,
        blocks: ["columns-tiles"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Category Tiles Row 2",
        selector: "body > div:first-child > div:nth-child(7)",
        style: null,
        blocks: ["columns-tiles"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Hero Video - Summer Living",
        selector: "body > div:first-child > div:nth-child(8)",
        style: null,
        blocks: ["hero-landing"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "Hero Image - Coleccion Lino",
        selector: "body > div:first-child > div:nth-child(9)",
        style: null,
        blocks: ["hero-landing"],
        defaultContent: []
      },
      {
        id: "section-8",
        name: "Hero Image - Best Sellers",
        selector: "body > div:first-child > div:nth-child(10)",
        style: null,
        blocks: ["hero-landing"],
        defaultContent: []
      },
      {
        id: "section-9",
        name: "Mango Style Club Promotion",
        selector: "body > div:first-child > div:nth-child(11)",
        style: null,
        blocks: ["hero-promo"],
        defaultContent: []
      },
      {
        id: "section-10",
        name: "Newsletter Signup",
        selector: "body > div:nth-child(2)",
        style: "light-grey",
        blocks: [],
        defaultContent: [
          "body > div:nth-child(2) h2",
          "body > div:nth-child(2) form"
        ]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
