/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .container > .row, which holds two main columns
  const row = element.querySelector('.container > .row');
  if (!row) return;
  // Collect left column (main article)
  const colLeft = row.querySelector('.col-lg-8.col-md-12');
  // Collect right column (related articles, recent article)
  const colRight = row.querySelector('.col-lg-4.col-md-12');

  // Defensive: If one of the columns is missing, fallback
  let leftContent, rightContent;
  if (colLeft) {
    // Use all content of colLeft (main article and image)
    leftContent = colLeft;
  } else {
    leftContent = document.createElement('div');
    leftContent.textContent = '';
  }
  if (colRight) {
    // Use all sidebar content (related/recent articles)
    rightContent = colRight;
  } else {
    rightContent = document.createElement('div');
    rightContent.textContent = '';
  }

  // Table header as per spec
  const headerRow = ['Columns (columns1)'];
  // Second row: two columns, leftContent and rightContent
  const dataRow = [leftContent, rightContent];
  // Structure as required
  const tableData = [headerRow, dataRow];
  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}
