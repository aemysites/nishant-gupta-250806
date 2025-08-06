/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel containing the cards
  const carousel = element.querySelector('.owl-carousel');
  if (!carousel) return;

  // Get all possible .item nodes inside .owl-item, referencing only unique ones
  const items = Array.from(carousel.querySelectorAll('.owl-item > .item'));
  const seen = new Set();
  const uniqueItems = [];
  items.forEach(item => {
    const content = item.querySelector('.coachContent');
    const text = content ? content.textContent.trim().replace(/\s+/g, ' ') : '';
    if (text && !seen.has(text)) {
      seen.add(text);
      uniqueItems.push(item);
    }
  });

  // Set up the header row exactly as in the spec/example
  const rows = [['Cards (cards32)']];

  // Build each card row
  uniqueItems.forEach(item => {
    // First column: the image element
    let img = item.querySelector('.coachImg img');
    if (img && !img.src) {
      const ds = img.getAttribute('data-src');
      if (ds) img.src = ds;
    }
    const imageCell = img || '';

    // Second column: all content from .coachContent, preserving all formatting and text
    const content = item.querySelector('.coachContent');
    let contentCell = '';
    if (content) {
      contentCell = Array.from(content.childNodes).filter(n => {
        if (n.nodeType === Node.TEXT_NODE && !n.textContent.trim()) return false;
        return true;
      });
    }
    rows.push([imageCell, contentCell]);
  });

  // Create the table block and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
