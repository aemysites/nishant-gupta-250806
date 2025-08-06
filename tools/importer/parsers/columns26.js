/* global WebImporter */
export default function parse(element, { document }) {
  // Find all unique course slides (.owl-item .item) by their h3 title (avoid duplicates)
  const items = Array.from(element.querySelectorAll('.owl-item .item'));
  const seen = new Set();
  const columns = [];
  for (const item of items) {
    const titleEl = item.querySelector('h3');
    const title = titleEl ? titleEl.textContent.trim() : '';
    if (title && !seen.has(title)) {
      seen.add(title);
      columns.push(item);
    }
    if (columns.length === 2) break; // Only first two unique for two columns
  }
  // Pad with empty divs if there are fewer than 2 columns
  while (columns.length < 2) {
    columns.push(document.createElement('div'));
  }
  // Build the table: header row (1 cell), then content row (2 cells)
  const cells = [
    ['Columns (columns26)'], // header row - exactly one cell
    columns                 // row with one cell per column
  ];
  // Create the table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
