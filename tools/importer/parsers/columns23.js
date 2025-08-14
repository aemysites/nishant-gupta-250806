/* global WebImporter */
export default function parse(element, { document }) {
  // Find the content layout row (should contain columns)
  const container = element.querySelector('.container');
  if (!container) return;
  const row = container.querySelector('.row');
  if (!row) return;
  // Get the two main columns
  const columns = row.querySelectorAll(':scope > div');
  if (columns.length < 2) return;
  const leftCol = columns[0];
  const rightCol = columns[1];

  // Our block: header row, then one row with both columns
  const headerRow = ['Columns (columns23)'];
  const contentRow = [leftCol, rightCol];
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
