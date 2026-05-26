import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');

  if (navSections) {
    const navDrops = navSections.querySelectorAll('.nav-drop');
    if (isDesktop.matches) {
      navDrops.forEach((drop) => {
        if (!drop.hasAttribute('tabindex')) {
          drop.setAttribute('tabindex', 0);
          drop.addEventListener('focus', focusNavSection);
        }
      });
    } else {
      navDrops.forEach((drop) => {
        drop.removeAttribute('tabindex');
        drop.removeEventListener('focus', focusNavSection);
      });
    }
  }

  if (!expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

function toggleSearchOverlay(nav) {
  let overlay = nav.querySelector('.nav-search-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'nav-search-overlay';
    overlay.innerHTML = `
      <div class="nav-search-inner">
        <form action="/ae/search/search-all" method="get" class="nav-search-form">
          <input type="search" name="q" placeholder="Search LG products, support, and more..." aria-label="Search" autocomplete="off">
          <button type="submit" aria-label="Submit search">
            <span class="icon icon-search"><img src="/icons/search.svg" alt="" width="24" height="24"></span>
          </button>
        </form>
        <button type="button" class="nav-search-close" aria-label="Close search">
          <span>&times;</span>
        </button>
      </div>`;
    overlay.querySelector('.nav-search-close').addEventListener('click', () => {
      overlay.classList.remove('active');
    });
    overlay.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') overlay.classList.remove('active');
    });
    nav.closest('.nav-wrapper').appendChild(overlay);
  }
  overlay.classList.toggle('active');
  if (overlay.classList.contains('active')) {
    overlay.querySelector('input').focus();
  }
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';

  const validChildren = [...fragment.children].filter(
    (child) => child.tagName === 'DIV' && child.querySelector('.section'),
  );

  if (validChildren.length > 0) {
    validChildren.forEach((child) => nav.append(child));
  } else {
    const sections = fragment.querySelectorAll('.section');
    sections.forEach((section) => nav.append(section));
  }

  const navChildren = [...nav.children];
  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = navChildren[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    const brandLink = navBrand.querySelector('a');
    if (brandLink) {
      brandLink.className = '';
      brandLink.setAttribute('aria-label', 'LG logo (Life\'s Good)');
      const logo = document.createElement('img');
      logo.src = '/icons/lg-logo.svg';
      logo.alt = 'LG logo (Life\'s Good)';
      logo.width = 86;
      logo.height = 38;
      brandLink.textContent = '';
      brandLink.appendChild(logo);
      const buttonContainer = brandLink.closest('.button-container');
      if (buttonContainer) buttonContainer.className = '';
    }
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll('.button').forEach((button) => {
      button.className = '';
      const buttonContainer = button.closest('.button-container');
      if (buttonContainer) buttonContainer.className = '';
    });

    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }

  const navTools = nav.querySelector('.nav-tools');
  if (navTools) {
    const searchLink = navTools.querySelector('a[href*="search"]');
    if (searchLink) {
      const searchBtn = document.createElement('button');
      searchBtn.type = 'button';
      searchBtn.setAttribute('aria-label', 'Search');
      searchBtn.innerHTML = searchLink.querySelector('.icon') ? searchLink.querySelector('.icon').outerHTML : '';
      searchBtn.addEventListener('click', () => {
        toggleSearchOverlay(nav);
      });
      searchLink.replaceWith(searchBtn);
    }
    navTools.querySelectorAll('a').forEach((link) => {
      const textNode = link.childNodes[link.childNodes.length - 1];
      if (textNode && textNode.nodeType === Node.TEXT_NODE && textNode.textContent.trim()) {
        const span = document.createElement('span');
        span.className = 'nav-tools-text';
        span.textContent = textNode.textContent.trim();
        textNode.replaceWith(span);
      }
      link.className = '';
      const buttonContainer = link.closest('.button-container');
      if (buttonContainer) buttonContainer.className = '';
    });
  }

  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
