/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract text content block (preserving structure)
  function extractTextContent(el) {
    // Return all child nodes as-is (preserving semantic HTML)
    return Array.from(el.childNodes).filter(node => {
      // Skip empty text nodes
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      return true;
    });
  }

  // Find carousel
  const carousel = element.querySelector('.owl-carousel');
  if (!carousel) return;

  // Get all .owl-item that are NOT .cloned
  const items = Array.from(carousel.querySelectorAll('.owl-item'))
    .filter(item => !item.classList.contains('cloned'));

  // Header row: matches exactly
  const rows = [['Cards (cards32)']];

  items.forEach(item => {
    const card = item.querySelector('.item');
    if (!card) return;
    const mediaRptSec = card.querySelector('.mediaRptSec');
    if (!mediaRptSec) return;

    // Image cell: use referenced img element
    let imgEl = null;
    const img = mediaRptSec.querySelector('.coachImg img');
    if (img) {
      // Always set src from data-src if no src
      if (!img.getAttribute('src')) {
        const dataSrc = img.getAttribute('data-src');
        if (dataSrc) img.setAttribute('src', dataSrc);
      }
      imgEl = img;
    }

    // Text cell: reference all child nodes of coachContent
    let textNodes = '';
    const coachContent = mediaRptSec.querySelector('.coachContent');
    if (coachContent) {
      textNodes = extractTextContent(coachContent);
    }

    rows.push([imgEl, textNodes]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
