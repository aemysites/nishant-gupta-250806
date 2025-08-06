/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by selector
  function getDirectChild(parent, selector) {
    return Array.from(parent.children).find(el => el.matches(selector));
  }

  // Traverse the expected structure
  const container = getDirectChild(element, '.container');
  if (!container) return;
  const txtBlock = getDirectChild(container, '.coursesTxtBlock');
  if (!txtBlock) return;
  const rptSec = getDirectChild(txtBlock, '.coursesRptSec');
  const imgSec = getDirectChild(txtBlock, '.courseSecImg');

  // Prepare column cells
  const col1 = rptSec ? [rptSec] : [];
  let col2 = [];
  if (imgSec) {
    const img = imgSec.querySelector('img');
    if (img) col2.push(img);
  }

  // The header row should span the correct number of columns
  // This must match the number of columns in the data row
  const columnsCount = 2; // two columns: content & image
  // Create the table using the helper
  const cells = [];

  // Create header row with correct colspan
  const headerRow = [];
  const th = document.createElement('th');
  th.textContent = 'Columns (columns43)';
  if (columnsCount > 1) {
    th.setAttribute('colspan', columnsCount);
  }
  headerRow.push(th);
  cells.push(headerRow);

  // Add the columns row
  cells.push([col1, col2]);

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
