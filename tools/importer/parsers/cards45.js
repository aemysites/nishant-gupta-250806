/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel containing the cards
  const carousel = element.querySelector('.owl-carousel');
  if (!carousel) return;

  // Select all visible, unique cards: .owl-item.active > .item
  // But for resilience, fallback to all .owl-item > .item
  let cardNodes = Array.from(carousel.querySelectorAll('.owl-item.active > .item'));
  if (cardNodes.length === 0) {
    cardNodes = Array.from(carousel.querySelectorAll('.owl-item > .item'));
  }

  // To avoid duplicates, filter out cards with duplicate text (compare trimmed text content)
  const seen = new Set();
  const uniqueCards = [];
  cardNodes.forEach((item) => {
    const txtSec = item.querySelector('.mediaTxtSec');
    const txt = txtSec ? txtSec.textContent.trim().replace(/\s+/g, ' ') : '';
    if (!seen.has(txt)) {
      seen.add(txt);
      uniqueCards.push(item);
    }
  });

  // Start table with header row
  const cells = [['Cards (cards45)']];

  uniqueCards.forEach((item) => {
    const rpt = item.querySelector('.mediaRptSec');
    if (!rpt) return;
    // Image/icon cell (reference the existing img element)
    let imgElem = null;
    const banner = rpt.querySelector('.mediaBanner img');
    if (banner) {
      // Ensure src is set
      if (!banner.getAttribute('src') && banner.getAttribute('data-src')) {
        let src = banner.getAttribute('data-src');
        if (src.startsWith('//')) src = 'https:' + src;
        banner.setAttribute('src', src);
      }
      imgElem = banner;
    }
    // Text cell: include all content from .mediaTxtSec, preserving heading and description
    const txtSec = rpt.querySelector('.mediaTxtSec');
    let textCell = null;
    if (txtSec) {
      // Create a fragment to hold all children (reference existing elements)
      const fragment = document.createDocumentFragment();
      Array.from(txtSec.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
          fragment.appendChild(node);
        }
      });
      textCell = fragment;
    }
    cells.push([imgElem, textCell]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
