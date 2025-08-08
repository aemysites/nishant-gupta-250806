/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match example exactly
  const headerRow = ['Cards (cards45)'];
  const cells = [headerRow];

  // Find the carousel containing the cards
  const carousel = element.querySelector('.owl-carousel');
  if (!carousel) return;

  // Select all .owl-item .item elements
  const items = carousel.querySelectorAll('.owl-item .item');

  // Deduplication: Use a set to track unique card content
  const seen = new Set();
  items.forEach(item => {
    // Get the card main container
    const mediaRptSec = item.querySelector('.mediaRptSec');
    if (!mediaRptSec) return;

    // Image/Icon
    let img = mediaRptSec.querySelector('.mediaBanner img');
    if (img) {
      // Ensure 'src' is set (for lazy-loaded images)
      if (!img.src && img.getAttribute('data-src')) {
        img.src = img.getAttribute('data-src');
      }
    }
    // If no image, skip this card
    if (!img) return;

    // Text content (title, description, etc.)
    const txtSec = mediaRptSec.querySelector('.mediaTxtSec');
    let textEl = null;
    if (txtSec) {
      // Use the whole text block as a single cell
      textEl = txtSec;
    } else {
      // If no .mediaTxtSec, fallback: gather all text nodes after the image
      textEl = document.createElement('div');
      Array.from(mediaRptSec.childNodes).forEach(child => {
        if (child !== img && child.nodeType === 1) {
          textEl.appendChild(child);
        }
      });
    }
    // Deduplicate by signature
    const sig = img.src + '|' + textEl.textContent.trim();
    if (seen.has(sig)) return;
    seen.add(sig);

    // Add card row
    cells.push([
      img,
      textEl
    ]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
