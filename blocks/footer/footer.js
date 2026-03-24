import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // classify sections: footer-nav, footer-links, footer-social
  const sections = footer.querySelectorAll('.section');
  const sectionNames = ['footer-nav', 'footer-links', 'footer-social'];
  sections.forEach((section, i) => {
    if (sectionNames[i]) section.classList.add(sectionNames[i]);
  });

  // transform nav columns in footer-nav and footer-links sections
  footer.querySelectorAll('.footer-nav, .footer-links').forEach((section) => {
    const ul = section.querySelector('ul');
    if (!ul) return;
    const columns = document.createElement('div');
    columns.className = 'footer-columns';
    [...ul.children].forEach((li) => {
      const col = document.createElement('div');
      col.className = 'footer-column';
      const strong = li.querySelector(':scope > strong');
      if (strong) {
        const heading = document.createElement('h3');
        heading.textContent = strong.textContent;
        col.append(heading);
      }
      const nestedUl = li.querySelector(':scope > ul');
      if (nestedUl) col.append(nestedUl);
      columns.append(col);
    });
    const wrapper = section.querySelector('.default-content-wrapper');
    if (wrapper) {
      wrapper.textContent = '';
      wrapper.append(columns);
    }
  });

  // classify social section elements
  const socialSection = footer.querySelector('.footer-social');
  if (socialSection) {
    const wrapper = socialSection.querySelector('.default-content-wrapper');
    if (wrapper) {
      const lists = wrapper.querySelectorAll(':scope > ul');
      const paragraph = wrapper.querySelector(':scope > p');
      if (lists[0]) lists[0].classList.add('footer-social-links');
      if (paragraph) paragraph.classList.add('footer-copyright');
      if (lists[1]) lists[1].classList.add('footer-legal-links');
    }
  }

  block.append(footer);
}
