/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the actual src from an <img>
  function getImgSrc(img) {
    return img.getAttribute('src') || img.getAttribute('data-src');
  }
  // Find the .owl-stage element containing all cards
  const owlStage = element.querySelector('.owl-stage');
  if (!owlStage) return;
  // Select all .owl-item .item .drivingTipsSec in order
  const cardSecList = owlStage.querySelectorAll('.owl-item .item .drivingTipsSec');
  // To avoid duplicates, use a Set
  const seen = new Set();
  const cardRows = [];
  cardSecList.forEach(drivingTipsSec => {
    // Get the image (first .drivingTipsBanner img in this section)
    const imgBanner = drivingTipsSec.querySelector('.drivingTipsBanner');
    const img = imgBanner && imgBanner.querySelector('img');
    // Get the text section
    const txtSec = drivingTipsSec.querySelector('.drivingTipsTxtSec');
    // Compose text cell to ensure all text content is included
    const textCell = document.createElement('div');
    if (txtSec) {
      // Title: h3
      const h3 = txtSec.querySelector('h3');
      if (h3) {
        // Use the actual h3 as it is in the DOM
        textCell.appendChild(h3);
      }
      // Description: .blogcontentSummary
      const desc = txtSec.querySelector('.blogcontentSummary');
      if (desc) {
        // Use the actual element (span/div) from DOM
        textCell.appendChild(desc);
      }
      // CTA: a.readMoreLink
      const cta = txtSec.querySelector('a.readMoreLink');
      if (cta) {
        textCell.appendChild(cta);
      }
    }
    // Compose unique key to avoid duplicate cards
    const imgKey = img ? getImgSrc(img) : '';
    const titleKey = txtSec && txtSec.querySelector('h3') ? txtSec.querySelector('h3').textContent.trim() : '';
    const uniqueKey = imgKey + '|' + titleKey;
    // Only add row if there's both image and text content, and not already seen
    if (!seen.has(uniqueKey) && img && textCell.textContent.trim()) {
      cardRows.push([
        img,
        textCell
      ]);
      seen.add(uniqueKey);
    }
  });
  // Table header: exactly as the example
  const tableRows = [
    ['Cards (cards33)'],
    ...cardRows
  ];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
