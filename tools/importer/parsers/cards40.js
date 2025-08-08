/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards40) block header
  const headerRow = ['Cards (cards40)'];
  const cells = [headerRow];

  // Find the carousel container
  const carousel = element.querySelector('.owl-carousel');
  if (!carousel) return;

  // Get all .item elements (each card)
  const items = carousel.querySelectorAll('.item');

  items.forEach((item) => {
    // Card image
    const imgContainer = item.querySelector('.mediaBanner');
    let imgEl = null;
    if (imgContainer) {
      imgEl = imgContainer.querySelector('img');
      if (imgEl) {
        // Ensure src is set
        if (!imgEl.getAttribute('src')) {
          const dataSrc = imgEl.getAttribute('data-src');
          if (dataSrc) {
            imgEl.setAttribute('src', dataSrc);
          }
        }
      }
    }

    // Card text content (title, description, CTA, date)
    const txtSec = item.querySelector('.mediaTxtSec');
    const textElements = [];
    if (txtSec) {
      const h3 = txtSec.querySelector('h3');
      if (h3) textElements.push(h3);
      const p = txtSec.querySelector('p');
      if (p) textElements.push(p);
      const readNdateSec = txtSec.querySelector('.readNdateSec');
      if (readNdateSec) {
        const a = readNdateSec.querySelector('a.readMoreLink');
        if (a) textElements.push(a);
        const dateDiv = readNdateSec.querySelector('.datesR');
        if (dateDiv) textElements.push(dateDiv);
      }
    }

    // Only add the card if both image and text are present
    if (imgEl && textElements.length > 0) {
      cells.push([imgEl, textElements]);
    }
  });

  // Create and replace block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
