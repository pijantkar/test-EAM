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

  // tools/importer/import-brand-page.js
  var import_brand_page_exports = {};
  __export(import_brand_page_exports, {
    default: () => import_brand_page_default
  });

  // tools/importer/parsers/hero-campaign.js
  function parse(element, { document }) {
    const bgVideo = element.querySelector("video.pc_only, video.mo_only, .hacm__img video");
    const heading = element.querySelector('h1.hacm__title, h1, h2, [class*="title"]');
    const description = element.querySelector('p.hacm__desc, p, [class*="desc"]');
    const ctaLinks = Array.from(
      element.querySelectorAll('.hacm__button a, .hacm__container a[class*="btn"], .hacm__container a.hacm__item')
    ).filter((a) => a.textContent.trim().length > 0);
    const cells = [];
    if (bgVideo) {
      const videoSrc = bgVideo.getAttribute("src") || "";
      if (videoSrc) {
        const videoLink = document.createElement("a");
        videoLink.href = videoSrc;
        videoLink.textContent = videoSrc;
        cells.push([videoLink]);
      } else {
        cells.push([bgVideo]);
      }
    } else {
      const bgImage = element.querySelector(".hacm__img img, img");
      if (bgImage) {
        cells.push([bgImage]);
      }
    }
    if (heading) {
      cells.push([heading]);
    }
    if (description) {
      cells.push([description]);
    }
    if (ctaLinks.length > 0) {
      cells.push(ctaLinks);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-campaign", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-storytell.js
  function parse2(element, { document }) {
    const title = element.querySelector('.hacm__title, .content-variable__cont p:first-child, [class*="title"]');
    const description = element.querySelector('.hacm__desc, .content-variable__cont p:nth-child(2), [class*="desc"]');
    const image = element.querySelector(".hacm__img img, .content-variable__row img, img");
    const textCell = [];
    if (title) {
      const heading = document.createElement("h2");
      heading.textContent = title.textContent.trim();
      textCell.push(heading);
    }
    if (description) {
      textCell.push(description);
    }
    const imageCell = [];
    if (image) {
      imageCell.push(image);
    }
    const cells = [
      [textCell, imageCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-storytell", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-upcycle.js
  function parse3(element, { document }) {
    const slides = element.querySelectorAll(".swiper-slide");
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector(".hacm__img img, img");
      const heading = slide.querySelector('h2.hacm__title, h2, h3, [class*="title"]');
      const description = slide.querySelector("p.hacm__desc, p");
      const textCell = [];
      if (heading) textCell.push(heading);
      if (description) textCell.push(description);
      const imageCell = img ? [img] : [];
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-upcycle", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse4(element, { document }) {
    const video = element.querySelector("video");
    const mediaCell = [];
    if (video) {
      const videoSrc = video.getAttribute("src") || (video.querySelector("source") ? video.querySelector("source").getAttribute("src") : null);
      if (videoSrc) {
        const link = document.createElement("a");
        link.href = videoSrc;
        link.textContent = videoSrc;
        mediaCell.push(link);
      } else {
        mediaCell.push(video);
      }
    }
    const contentCell = [];
    const headings = element.querySelectorAll("h1, h2, h3, h4, h5, h6, .hacm__title");
    const descriptions = element.querySelectorAll("p, .hacm__desc");
    headings.forEach((heading) => {
      contentCell.push(heading);
    });
    descriptions.forEach((desc) => {
      contentCell.push(desc);
    });
    if (contentCell.length === 0) {
      const placeholder = document.createElement("p");
      placeholder.textContent = "";
      contentCell.push(placeholder);
    }
    const cells = [
      [mediaCell.length > 0 ? mediaCell : "", contentCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-product.js
  function parse5(element, { document }) {
    const productItems = element.querySelectorAll('.product-list__item .product__item, .product__item, [class*="product-item"]');
    const cells = [];
    productItems.forEach((item) => {
      const img = item.querySelector(".product__img img, img");
      const productName = item.querySelector('.product__name, [class*="product-name"], [class*="product__title"]');
      const productSku = item.querySelector('.product__sn, [class*="product__sn"], [class*="model-number"]');
      const ctaContainer = item.querySelector(".hacm__button");
      const ctaLinks = ctaContainer ? Array.from(ctaContainer.querySelectorAll("a")) : Array.from(item.querySelectorAll('a[class*="btn"]'));
      const imageCell = [];
      if (img) {
        imageCell.push(img);
      }
      const contentCell = [];
      if (productName) {
        const strong = document.createElement("strong");
        strong.textContent = productName.textContent.trim();
        contentCell.push(strong);
      }
      if (productSku) {
        const skuPara = document.createElement("p");
        skuPara.textContent = productSku.textContent.trim();
        contentCell.push(skuPara);
      }
      if (ctaLinks.length > 0) {
        contentCell.push(...ctaLinks);
      }
      if (imageCell.length > 0 || contentCell.length > 0) {
        cells.push([imageCell, contentCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-benefit.js
  function parse6(element, { document }) {
    const benefitItems = element.querySelectorAll(".benefit-more__item");
    const groups = benefitItems.length > 0 ? Array.from(benefitItems).map((item) => item.querySelector(".benefit-more__group") || item) : Array.from(element.querySelectorAll(".benefit-more__group"));
    const cells = [];
    groups.forEach((group) => {
      const titleEl = group.querySelector("p.hacm__title, .hacm__title, h3, h4, strong");
      const descEl = group.querySelector("p.hacm__desc, .hacm__desc");
      const cellContent = [];
      if (titleEl) {
        const strong = document.createElement("strong");
        strong.textContent = titleEl.textContent.trim();
        cellContent.push(strong);
      }
      if (descEl) {
        const br = document.createElement("br");
        cellContent.push(br);
        const descText = document.createTextNode(descEl.textContent.trim());
        cellContent.push(descText);
      }
      if (cellContent.length > 0) {
        cells.push(["", cellContent]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-benefit", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-story.js
  function parse7(element, { document }) {
    const items = element.querySelectorAll(".rectangle-box__item");
    const cells = [];
    items.forEach((item) => {
      const image = item.querySelector(".hacm__img img");
      const title = item.querySelector(".hacm__title");
      const description = item.querySelector(".hacm__desc");
      const ctaLink = item.querySelector(".hacm__button a");
      const imageCell = [];
      if (image) {
        imageCell.push(image);
      }
      const contentCell = [];
      if (title) {
        const strong = document.createElement("strong");
        strong.textContent = title.textContent;
        contentCell.push(strong);
      }
      if (description) {
        contentCell.push(description);
      }
      if (ctaLink) {
        contentCell.push(ctaLink);
      }
      if (imageCell.length > 0 || contentCell.length > 0) {
        cells.push([imageCell, contentCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-story", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/lg-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        ".gnb-notice-banner-wrap",
        "#modal_browse_supported_guide",
        "#navigation_search"
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

  // tools/importer/import-brand-page.js
  var parsers = {
    "hero-campaign": parse,
    "columns-storytell": parse2,
    "carousel-upcycle": parse3,
    "columns-feature": parse4,
    "cards-product": parse5,
    "cards-benefit": parse6,
    "cards-story": parse7
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "brand-page",
    description: "Brand marketing microsite pages showcasing LG lifestyle and product ecosystems",
    urls: [
      "https://www.lg.com/ae/better-life/index"
    ],
    blocks: [
      {
        name: "hero-campaign",
        instances: [".hacm__article.hero"]
      },
      {
        name: "columns-storytell",
        instances: [".content-variable.more__section"]
      },
      {
        name: "carousel-upcycle",
        instances: [".hacm__swiper"]
      },
      {
        name: "columns-feature",
        instances: [".hacm__video"]
      },
      {
        name: "cards-product",
        instances: [".product-list"]
      },
      {
        name: "cards-benefit",
        instances: [".benefit-more"]
      },
      {
        name: "cards-story",
        instances: [".rectangle-box"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: ".hacm__article.hero",
        style: null,
        blocks: ["hero-campaign"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Story",
        selector: ".content-split",
        style: null,
        blocks: ["columns-storytell"],
        defaultContent: [".content-split .hacm__title", ".content-split .hacm__desc"]
      },
      {
        id: "section-3",
        name: "Upcycle Carousel",
        selector: ".hacm__swiper",
        style: null,
        blocks: ["carousel-upcycle"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "USP Features",
        selector: ".hacm__video",
        style: null,
        blocks: ["columns-feature"],
        defaultContent: [".hacm__video .hacm__title"]
      },
      {
        id: "section-5",
        name: "Product Picks",
        selector: ".column.featured-product",
        style: "light-grey",
        blocks: ["cards-product"],
        defaultContent: [".column.featured-product .hacm__title"]
      },
      {
        id: "section-6",
        name: "Sign Up Benefits",
        selector: ".benefit-more",
        style: null,
        blocks: ["cards-benefit"],
        defaultContent: [".benefit-more .hacm__title"]
      },
      {
        id: "section-7",
        name: "Other Stories",
        selector: ".rectangle-box",
        style: null,
        blocks: ["cards-story"],
        defaultContent: [".rectangle-box .hacm__title"]
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
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
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_brand_page_default = {
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
  return __toCommonJS(import_brand_page_exports);
})();
