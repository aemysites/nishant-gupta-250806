/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards35) block header row (should match example EXACTLY)
  const headerRow = ['Cards (cards35)'];

  // Find the carousel's stage that contains the card items
  const stage = element.querySelector('.owl-stage');
  if (!stage) return;

  // Get all .owl-item > .item inside the stage (use only direct children of .owl-stage)
  const cardItems = Array.from(stage.querySelectorAll('.owl-item .item'));

  // Defensive: skip if no cards
  if (!cardItems.length) return;

  // Build each row: image in first cell, text content in second cell (heading, summary, CTA)
  const rows = cardItems.map(item => {
    // 1. Image cell
    const imgBox = item.querySelector('.howGetLicenceImg img');
    let imgEl = null;
    if (imgBox) {
      // Use existing element directly if src
      if (imgBox.src) {
        imgEl = imgBox;
      } else if (imgBox.getAttribute('data-src')) {
        // If only data-src, create a new element with it
        const img = document.createElement('img');
        img.src = imgBox.getAttribute('data-src');
        img.alt = imgBox.getAttribute('alt') || '';
        imgEl = img;
      }
    }

    // 2. Text content cell
    const contentEls = [];
    const contentBox = item.querySelector('.howGetLicenceContent');
    if (contentBox) {
      // a. Heading (h3)
      const h3 = contentBox.querySelector('h3');
      if (h3) contentEls.push(h3);
      // b. Summary/description
      const desc = contentBox.querySelector('.blogcontentSummary');
      if (desc) contentEls.push(desc);
    }
    // c. CTA (read more), outside content box
    const cta = item.querySelector('.readMoreLink');
    if (cta) contentEls.push(cta);

    // Return row: [image, [all text content blocks]]
    return [imgEl, contentEls];
  });

  // Compose the final table with header and rows
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
