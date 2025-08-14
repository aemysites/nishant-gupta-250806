/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main .row containing the two columns
  const row = element.querySelector(':scope > .row');
  let leftCol = null;
  let rightCol = null;

  if (row) {
    // Should have two columns
    const cols = Array.from(row.children);
    // Find left and right by class
    leftCol = cols.find(c => c.classList.contains('col-lg-8')) || cols[0];
    rightCol = cols.find(c => c.classList.contains('col-lg-4')) || cols[1];
  } else {
    // Fallback if structure is different
    leftCol = element.querySelector('.col-lg-8') || element;
    rightCol = element.querySelector('.col-lg-4') || null;
  }

  // For left column: only include the main whyChooseSec block (not any forms below)
  let leftContent = leftCol ? leftCol.querySelector('.whyChooseSec') : null;
  // fallback: if .whyChooseSec not found, use the column itself
  if (!leftContent && leftCol) leftContent = leftCol;

  // For right column: only include the main readyDriveSec block
  let rightContent = rightCol ? rightCol.querySelector('.readyDriveSec') : null;
  if (!rightContent && rightCol) rightContent = rightCol;

  // Edge cases: if columns are missing, fill with empty placeholders
  const contentRow = [
    leftContent || document.createElement('div'),
    rightContent || document.createElement('div')
  ];

  // Table header must exactly match block name
  const headerRow = ['Columns (columns42)'];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
