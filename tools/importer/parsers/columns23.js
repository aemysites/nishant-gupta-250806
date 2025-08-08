/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: block name as required
  const headerRow = ['Columns (columns23)'];

  // 2. Find the two top-level columns (left: main details, right: related articles)
  // The container uses Bootstrap grid, so columns are col-lg-8 and col-lg-4
  let left = element.querySelector('.col-lg-8');
  let right = element.querySelector('.col-lg-4');

  // Fallback if not found (handle edge case)
  if (!left || !right) {
    const cols = element.querySelectorAll("[class*='col-lg']");
    left = cols[0];
    right = cols[1];
    // Further fallback: if still undefined, use any direct .col- element
    if (!left || !right) {
      const anyCols = element.querySelectorAll("[class*='col-']");
      left = anyCols[0];
      right = anyCols[1];
    }
  }

  // Defensive: if column is missing, use an empty div
  if (!left) {
    left = document.createElement('div');
  }
  if (!right) {
    right = document.createElement('div');
  }

  // 3. Compose the rows array (first row: header, second row: columns)
  const rows = [headerRow, [left, right]];

  // 4. Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // 5. Replace the original element with the block table
  element.replaceWith(block);
}
