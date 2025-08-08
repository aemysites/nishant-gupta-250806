/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure header row matches exactly
  const headerRow = ['Columns (columns44)'];

  // Find the main container content. The closest approximation to the column structure in the example is the possible split between text info and the form
  let leftColumn = [];
  let rightColumn = [];

  // Attempt to get all relevant elements
  // Left column: heading and locate text
  const heading = element.querySelector('h2');
  let locatePara = null;
  let selectCitySec = element.querySelector('.selectCitySec');
  if (selectCitySec) {
    locatePara = selectCitySec.querySelector('p');
  }

  if (heading) leftColumn.push(heading);
  if (locatePara) leftColumn.push(locatePara);

  // Right column: form
  let form = selectCitySec ? selectCitySec.querySelector('form') : null;
  if (form) rightColumn.push(form);

  // If both columns are empty, fallback to placing the entire element content in one column
  let cellRow;
  if (leftColumn.length === 0 && rightColumn.length === 0) {
    cellRow = [element];
  } else {
    cellRow = [leftColumn.length ? leftColumn : '', rightColumn.length ? rightColumn : ''];
  }

  // Always produce a table with a header and one row
  const cells = [headerRow, cellRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
