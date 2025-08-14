/* global WebImporter */
export default function parse(element, { document }) {
  // Gather direct child columns of the row
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // In provided HTML, the actual column content is inside '.footerLink',
  // so use that for each column if it exists, else fallback to the column itself.
  const colContents = columns.map((col) => {
    const content = col.querySelector('.footerLink');
    return content ? content : col;
  });

  // Prepare table rows: header and content
  // HEADER ROW: must be a single cell (one column)
  const headerRow = ['Columns (columns7)'];
  // CONTENT ROW: as many columns as columns detected
  const contentRow = colContents;

  // The table for createTable must have each row as an array
  // headerRow is [ 'Columns (columns7)' ] (1 element)
  // contentRow is [ col1, col2, col3, col4 ] (N elements)
  // So the cells array will be: [[header], [col1, col2, col3, col4]]

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);
  element.replaceWith(table);
}
