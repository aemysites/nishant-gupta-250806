/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel
  const carousel = element.querySelector('.owl-carousel');
  if (!carousel) return;
  const stage = carousel.querySelector('.owl-stage');
  if (!stage) return;

  // Get unique (non-cloned) items only
  let items = Array.from(stage.querySelectorAll('.owl-item')).filter(item => !item.classList.contains('cloned'));
  if (!items.length) items = Array.from(stage.querySelectorAll('.owl-item'));

  const rows = [['Cards (cards40)']]; // Header matches example

  items.forEach(item => {
    const card = item.querySelector('.item .mediaRptSec');
    if (!card) return;

    // Column 1: Image element
    let img = card.querySelector('.mediaBanner img');
    if (img) {
      let src = img.getAttribute('src') || img.getAttribute('data-src');
      if (src && src.startsWith('//')) src = 'https:' + src;
      if (src) img.setAttribute('src', src);
    }

    // Column 2: All text content (h3, p, links, date) from .mediaTxtSec
    const txtSec = card.querySelector('.mediaTxtSec');
    let col2 = document.createElement('div');
    if (txtSec) {
      // Heading (h3)
      let h3 = txtSec.querySelector('h3');
      if (h3) {
        // Use existing element reference
        col2.appendChild(h3);
      }
      // Description (p)
      let p = txtSec.querySelector('p');
      if (p) {
        col2.appendChild(p);
      }
      // CTA and Date
      let readAndDate = txtSec.querySelector('.readNdateSec');
      if (readAndDate) {
        // Find any anchor (Read More link)
        const ctaLink = readAndDate.querySelector('a.readMoreLink');
        if (ctaLink) col2.appendChild(ctaLink);
        // Date, if present
        const date = readAndDate.querySelector('.datesR');
        if (date) col2.appendChild(date);
      }
    }
    // If col2 is empty, set to null
    if (!col2.hasChildNodes()) col2 = null;

    // Push row if at least one column has meaningful content
    if (img || col2) {
      rows.push([img, col2]);
    }
  });

  // Create the block table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
