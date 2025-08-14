/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the main image element from a card
  function getImage(card) {
    // Try multiple selectors for maximum flexibility
    let img = card.querySelector('.drivingTipsBanner img');
    if (!img) {
      img = card.querySelector('img');
    }
    if (img) {
      // Ensure the image src is present for all images
      const src = img.getAttribute('src') || img.getAttribute('data-src');
      if (src) {
        img.setAttribute('src', src);
        img.removeAttribute('data-src');
      }
      return img;
    }
    return '';
  }

  // Helper to extract text content block for a card
  function getTextContent(card) {
    // Prefer the full drivingTipsTxtSec block (captures h3, description, CTA, etc)
    const txtBlock = card.querySelector('.drivingTipsTxtSec');
    if (txtBlock) {
      return [txtBlock];
    }
    // Fallback: gather h3, summary, cta link
    const items = [];
    const h3 = card.querySelector('h3');
    if (h3) items.push(h3);
    const summary = card.querySelector('.blogcontentSummary');
    if (summary) items.push(summary);
    const cta = card.querySelector('a.readMoreLink');
    if (cta) items.push(cta);
    // If something found, use that
    if (items.length) return items;
    // Final fallback: plain text
    return [document.createTextNode(card.textContent.trim())];
  }

  // Collect unique cards by title text
  const seen = new Set();
  const cards = [];
  element.querySelectorAll('.item > .drivingTipsSec').forEach(card => {
    let key = '';
    const h3 = card.querySelector('h3');
    if (h3) {
      key = h3.textContent.trim();
    } else {
      key = card.textContent.trim();
    }
    if (key && !seen.has(key)) {
      seen.add(key);
      cards.push(card);
    }
  });

  if (!cards.length) return;

  // Build the table structure: header row first, then each card as [image, textBlock]
  const rows = [['Cards (cards33)']];
  cards.forEach(card => {
    const img = getImage(card);
    const text = getTextContent(card);
    rows.push([img, text]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
