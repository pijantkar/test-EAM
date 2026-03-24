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

  // tools/importer/import-helpful-guide.js
  var import_helpful_guide_exports = {};
  __export(import_helpful_guide_exports, {
    default: () => import_helpful_guide_default
  });

  // tools/importer/parsers/cards.js
  function parse(element, { document }) {
    const cells = [];
    const entryContainers = element.querySelectorAll(".entry-container");
    const impulsePromos = element.querySelectorAll(".impulse-promo .promo");
    if (entryContainers.length > 0) {
      entryContainers.forEach((card) => {
        const img = card.querySelector(".image-wrapper img");
        const contentCell = [];
        const title = card.querySelector(".entry-title a, h3 a");
        if (title) {
          const h = document.createElement("p");
          const strong = document.createElement("strong");
          strong.textContent = title.textContent.trim();
          h.appendChild(strong);
          contentCell.push(h);
        }
        const desc = card.querySelector(".copy, p.copy");
        if (desc) {
          const p = document.createElement("p");
          p.textContent = desc.textContent.trim();
          contentCell.push(p);
        }
        const link = card.querySelector(".entry-link, a.entry-link");
        if (link) {
          const a = document.createElement("a");
          a.href = link.href;
          a.textContent = link.textContent.trim();
          contentCell.push(a);
        }
        if (img || contentCell.length > 0) {
          cells.push([img || "", contentCell.length > 0 ? contentCell : ""]);
        }
      });
    } else if (impulsePromos.length > 0) {
      impulsePromos.forEach((card) => {
        const img = card.querySelector(".column-image img, .image-wrapper img");
        const contentCell = [];
        const name = card.querySelector(".promo-title-featured-product");
        if (name) {
          const p = document.createElement("p");
          const strong = document.createElement("strong");
          strong.textContent = name.textContent.trim();
          p.appendChild(strong);
          contentCell.push(p);
        }
        const cta = card.querySelector(".btn-promo, a.btn-promo");
        if (cta) {
          const a = document.createElement("a");
          a.href = cta.href;
          a.textContent = cta.textContent.trim();
          contentCell.push(a);
        }
        if (img || contentCell.length > 0) {
          cells.push([img || "", contentCell.length > 0 ? contentCell : ""]);
        }
      });
    }
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, { name: "cards", cells });
      element.replaceWith(block);
    }
  }

  // tools/importer/transformers/lg-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        ".gnb-notice-banner-wrap",
        "#modal_browse_supported_guide"
      ]);
      element.querySelectorAll("canvas.image-placeholder").forEach((el) => el.remove());
      element.querySelectorAll(".clearfix").forEach((el) => {
        if (el.children.length === 0 && el.textContent.trim() === "") {
          el.remove();
        }
      });
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        ".skip_nav",
        ".gt-header",
        ".progress",
        ".share-container",
        ".breadcrumb-article",
        "iframe",
        "link",
        "noscript",
        ".sr-only"
      ]);
      element.querySelectorAll("[data-link-name]").forEach((el) => el.removeAttribute("data-link-name"));
      element.querySelectorAll("[onclick]").forEach((el) => el.removeAttribute("onclick"));
    }
  }

  // tools/importer/transformers/lg-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const sections = payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
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
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const { section, el } = sectionElements[i];
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          el.parentNode.insertBefore(metaBlock, el.nextSibling);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          el.parentNode.insertBefore(hr, el);
        }
      }
    }
  }

  // tools/importer/import-helpful-guide.js
  var parsers = {
    "cards": parse
  };
  var PAGE_TEMPLATE = {
    name: "helpful-guide",
    description: "LG Story helpful guide article pages with product advice, how-tos, and buying guides",
    urls: [
      "https://www.lg.com/ae/lg-story/helpful-guide/best-gaming-monitor-for-2022/index"
    ],
    blocks: [
      {
        name: "cards",
        instances: [
          ".more-items-block .entry-container",
          ".promos-wrapper .impulse-promo"
        ]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Article Header",
        selector: ".page-header",
        style: null,
        blocks: [],
        defaultContent: [".page-title", ".details"]
      },
      {
        id: "section-2",
        name: "Article Body",
        selector: ".main-content .module-editable-content:first-child .inner",
        style: null,
        blocks: [],
        defaultContent: [".image-wrapper img", ".editable-content h2", ".editable-content h3", ".editable-content p"]
      },
      {
        id: "section-3",
        name: "Related Articles",
        selector: ".more-items-block",
        style: null,
        blocks: ["cards"],
        defaultContent: ["h3"]
      },
      {
        id: "section-4",
        name: "Featured Products",
        selector: ".sidebar .promos-wrapper",
        style: null,
        blocks: ["cards"],
        defaultContent: [".promos-wrapper-title"]
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
    return pageBlocks;
  }
  var import_helpful_guide_default = {
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
  return __toCommonJS(import_helpful_guide_exports);
})();
