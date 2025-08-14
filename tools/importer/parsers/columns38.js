/* global WebImporter */
export default function parse(element, { document }) {
  // 1. HEADER ROW: Single cell as per spec
  const headerRow = ['Columns (columns38)'];

  // 2. CONTENT ROW: Each column from the .footerLinkMain .row > div
  const footerLinkMain = element.querySelector('.footerLinkMain');
  let columns = [];
  if (footerLinkMain) {
    const row = footerLinkMain.querySelector('.row');
    if (row) {
      columns = Array.from(row.children);
    }
  }
  if (columns.length === 0) {
    element.remove();
    return;
  }
  const contentRow = columns;

  // 3. FOOTNOTE ROWS: If present, span all columns (put all in a single cell spanning all columns)
  const notes = Array.from(element.querySelectorAll('.whyusnote'));
  const copyright = element.querySelector('.copyrightTxt');

  let tableRows = [headerRow, contentRow];
  if (notes.length > 0 || copyright) {
    // Make a container for all footnotes/copyright
    const container = document.createElement('div');
    notes.forEach(note => container.appendChild(note));
    if (copyright) container.appendChild(copyright);
    // Row with one cell, spanning all columns
    tableRows.push([container]);
  }

  // 4. Build and replace
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
