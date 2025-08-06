/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .row element which contains the columns
  const row = element.querySelector('.row');
  if (!row) return;

  // Get the two columns inside the row
  const columns = Array.from(row.querySelectorAll(':scope > div'));
  if (columns.length < 2) return;

  // First column: the main text block
  let firstContent = columns[0].querySelector('.aboutFirsTxtInn');
  if (!firstContent) firstContent = columns[0];

  // Second column: the image
  let secondContent = columns[1].querySelector('img');
  if (!secondContent) secondContent = columns[1];

  // Build the cells array so the header row is a single cell, and the second row has both columns
  const cells = [
    ['Columns (columns46)'],
    [firstContent, secondContent]
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // If the first row is a single cell, set its th to span all columns
  const th = table.querySelector('tr:first-child th');
  if (th) th.setAttribute('colspan', '2');

  // Replace original element
  element.replaceWith(table);
}
