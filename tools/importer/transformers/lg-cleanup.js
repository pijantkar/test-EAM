/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: LG UAE site cleanup.
 * Selectors from captured DOM of lg.com/ae pages.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie/consent overlays and notice banners (from captured DOM)
    // #onetrust-consent-sdk - OneTrust cookie banner (site-wide)
    // .gnb-notice-banner-wrap - global notice banner (site-wide)
    // #modal_browse_supported_guide - browser compatibility popup (found in cleaned.html line 6)
    // #navigation_search - search overlay panel (found in cleaned.html line 1933)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '.gnb-notice-banner-wrap',
      '#modal_browse_supported_guide',
      '#navigation_search',
    ]);

    // Remove canvas placeholders used for lazy loading (from captured DOM: canvas.image-placeholder)
    element.querySelectorAll('canvas.image-placeholder').forEach((el) => el.remove());

    // Remove clearfix divs that add no content (from captured DOM: div.clearfix)
    element.querySelectorAll('.clearfix').forEach((el) => {
      if (el.children.length === 0 && el.textContent.trim() === '') {
        el.remove();
      }
    });
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site chrome (from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      '.skip_nav',
      '.gt-header',
      '.progress',
      '.share-container',
      '.breadcrumb-article',
      'nav.breadcrumb',
      'iframe',
      'link',
      'noscript',
      '.sr-only',
    ]);

    // Clean tracking attributes (from captured DOM: data-link-name, onclick)
    element.querySelectorAll('[data-link-name]').forEach((el) => el.removeAttribute('data-link-name'));
    element.querySelectorAll('[onclick]').forEach((el) => el.removeAttribute('onclick'));
  }
}
