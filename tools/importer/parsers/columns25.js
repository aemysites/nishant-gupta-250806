/* global WebImporter */
export default function parse(element, { document }) {
  // Find the row container
  const row = element.querySelector(':scope > .row');
  if (!row) return;
  // Find all immediate columns
  const columns = Array.from(row.children).filter(col => col.classList.contains('col-12'));
  // For each column, extract its main content
  const columnCells = columns.map(col => {
    const content = col.querySelector(':scope > .blueBgNumbers');
    return content || document.createTextNode('');
  });
  // Create the table: header row is a single cell, content row has as many cells as columns
  const cells = [
    ['Columns (columns25)'],
    columnCells
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
