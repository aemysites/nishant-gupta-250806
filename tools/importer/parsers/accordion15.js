/* global WebImporter */
export default function parse(element, { document }) {
  // Block table header row as in the example
  const headerRow = ['Accordion (accordion15)'];

  // Defensive: Find the .card element(s). For this case, element is always a single .card.
  // But for generality, allow multiple .card children (future proof).
  const cards = element.classList.contains('card') ? [element] : Array.from(element.querySelectorAll(':scope > .card'));

  const rows = [headerRow];

  cards.forEach(card => {
    // Title extraction
    // The title is in .card-header > h3 > button (text only, icons removed)
    const cardHeader = card.querySelector('.card-header');
    let title = '';
    if (cardHeader) {
      const btn = cardHeader.querySelector('button');
      if (btn) {
        // Remove icons (they should not appear in the title cell)
        btn.querySelectorAll('i').forEach(i => i.remove());
        title = btn.textContent.trim();
      }
    }
    // Content extraction: everything inside .card-body
    const cardBody = card.querySelector('.card-body');
    let contentCell;
    if (cardBody) {
      // Instead of cloning, reference the existing .card-body element (per spec)
      contentCell = cardBody;
    } else {
      // Defensive: empty cell if no body
      contentCell = '';
    }
    // Add row (title, content)
    rows.push([title, contentCell]);
  });

  // Create table using the provided helper
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original accordion with new block table
  element.replaceWith(table);
}
