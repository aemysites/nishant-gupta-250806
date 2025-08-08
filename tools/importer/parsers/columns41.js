/* global WebImporter */
export default function parse(element, { document }) {
  // Header row (must match example exactly)
  const headerRow = ['Columns (columns41)'];

  // Defensive: Locate main columns
  // Find the direct children of .row
  const rowDiv = element.querySelector('.row');
  const columns = rowDiv ? rowDiv.querySelectorAll(':scope > div') : [];

  // Column 1: the image in .borderR
  let col1Content = '';
  if (columns.length > 0) {
    const borderR = columns[0].querySelector('.borderR');
    if (borderR) {
      const img = borderR.querySelector('img');
      if (img) {
        col1Content = img;
      } else {
        // If there is no image, use the borderR itself (could be empty)
        col1Content = borderR;
      }
    } else {
      // Fallback: use the whole first column block if .borderR not found
      col1Content = columns[0];
    }
  }

  // Column 2: the rich text block (aboutMsilSec)
  let col2Content = '';
  if (columns.length > 1) {
    // Find .aboutMsilSec inside the second column
    const aboutSec = columns[1].querySelector('.aboutMsilSec');
    if (aboutSec) {
      col2Content = aboutSec;
    } else {
      // Fallback: use the whole second column block if .aboutMsilSec not found
      col2Content = columns[1];
    }
  }

  // Ensure both cells are filled so the table is correct
  const blockRow = [col1Content, col2Content];

  // Compose the table block
  const cells = [
    headerRow,
    blockRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the element with the table
  element.replaceWith(table);
}
