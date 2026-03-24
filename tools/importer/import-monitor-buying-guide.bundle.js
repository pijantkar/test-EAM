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

  // tools/importer/import-monitor-buying-guide.js
  var import_monitor_buying_guide_exports = {};
  __export(import_monitor_buying_guide_exports, {
    default: () => import_monitor_buying_guide_default
  });

  // tools/importer/parsers/cards-product.js
  function parse(element, { document }) {
    const cells = [];
    const items = element.querySelectorAll(".list-box li .item, .list-box li .item.js-model");
    items.forEach((item) => {
      const img = item.querySelector("a.visual img.pc, a.visual img.lazyloaded, a.visual img");
      const contentCell = [];
      const modelNameLink = item.querySelector(".model-name a, p.model-name a");
      if (modelNameLink) {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = modelNameLink.textContent.trim();
        p.appendChild(strong);
        contentCell.push(p);
      }
      const skuLink = item.querySelector(".sku a");
      if (skuLink) {
        const p = document.createElement("p");
        p.textContent = skuLink.textContent.trim();
        contentCell.push(p);
      }
      const wtbLink = item.querySelector("a.where-to-buy");
      if (wtbLink) {
        const a = document.createElement("a");
        a.href = wtbLink.href;
        a.textContent = wtbLink.textContent.trim();
        contentCell.push(a);
      }
      if (img || contentCell.length > 0) {
        cells.push([img || "", contentCell.length > 0 ? contentCell : ""]);
      }
    });
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, { name: "cards-product", cells });
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
        "nav.breadcrumb",
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

  // tools/importer/import-monitor-buying-guide.js
  var parsers = {
    "cards-product": parse
  };
  var PAGE_TEMPLATE = {
    name: "monitor-buying-guide",
    description: "Monitor buying guide page with product recommendations and comparison information",
    urls: [
      "https://www.lg.com/ru/monitor-buying-guide"
    ],
    blocks: [
      {
        name: "cards-product",
        instances: [
          "#resultCurProductList"
        ]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Page Title",
        selector: ".title-wrap",
        style: null,
        blocks: [],
        defaultContent: [".title-wrap h1"]
      },
      {
        id: "section-2",
        name: "Interactive Quiz/Configurator",
        selector: ".step.step1",
        style: null,
        blocks: [],
        defaultContent: [".step.step1 .message", ".step.step1 .list-box"]
      },
      {
        id: "section-3",
        name: "Product Recommendations",
        selector: "#result-box-aria",
        style: null,
        blocks: ["cards-product"],
        defaultContent: [".result-curation-head"]
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
  var import_monitor_buying_guide_default = {
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
  return __toCommonJS(import_monitor_buying_guide_exports);
})();
