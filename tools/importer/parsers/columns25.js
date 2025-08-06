/* global WebImporter */
export default function parse(element, { document }) {
  // Find all column content blocks
  const row = element.querySelector(':scope > .row');
  if (!row) return;
  const colDivs = Array.from(row.children);
  const cellsRow = colDivs.map(col => {
    const card = col.querySelector('.blueBgNumbers');
    return card || document.createTextNode('');
  });

  // Header row: single cell array
  const headerRow = ['Columns (columns25)'];
  // The table must have one column in the header row, and the next row has as many columns as needed
  // So, structure: [ [header], [...cols] ]
  const tableArray = [headerRow, cellsRow];

  // Create block table and replace original element
  const table = WebImporter.DOMUtils.createTable(tableArray, document);
  element.replaceWith(table);
}
