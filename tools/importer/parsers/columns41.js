/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children matching selector
  function getImmediateChild(parent, selector) {
    for (const child of parent.children) {
      if (child.matches(selector)) return child;
    }
    return null;
  }

  // Get the main row containing the two columns
  const row = getImmediateChild(element, '.row');
  if (!row) return;
  const columns = row.querySelectorAll(':scope > div');
  if (columns.length < 2) return;

  // LEFT COLUMN: contains the image (wrapped in borderR)
  let leftContent = null;
  const leftCol = columns[0];
  // Prefer the .borderR wrapper if present (retains original markup)
  leftContent = getImmediateChild(leftCol, '.borderR') || leftCol.querySelector('img') || '';

  // RIGHT COLUMN: contains the about text (aboutMsilSec)
  let rightContent = null;
  const rightCol = columns[1];
  // The desired content is inside .aboutMsilSec
  rightContent = rightCol.querySelector('.aboutMsilSec') || rightCol;

  // Table header row exactly as required
  const headerRow = ['Columns (columns41)'];
  // Table body row: two columns
  const bodyRow = [leftContent, rightContent];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bodyRow,
  ], document);

  element.replaceWith(table);
}
