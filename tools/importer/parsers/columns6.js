/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main columns
  const row = element.querySelector('.container > .row');
  if (!row) return;
  const colDivs = row.querySelectorAll(':scope > div');

  // Find main (left) content and side (right) content
  let leftCol = null;
  let rightCol = null;
  colDivs.forEach(col => {
    if (col.classList.contains('col-lg-8')) leftCol = col;
    if (col.classList.contains('col-lg-4')) rightCol = col;
  });
  if (!leftCol || !rightCol) return;

  // Extract main article content
  // We'll try to mirror the visual grid: 2 columns, and for each row, left = article part, right = card/recent

  // For left, the main block is .mediaDetailSec
  const mainBlock = leftCol.querySelector('.mediaDetailSec');
  // For right, get all .card (related articles) and .mediaRecentArticle (recent)
  const cardNodes = Array.from(rightCol.querySelectorAll('.mediaDetailList .card'));
  const recentNode = rightCol.querySelector('.mediaRecentArticle');
  let rightBlocks = [...cardNodes];
  if (recentNode) rightBlocks.push(recentNode);

  // Determine the number of rows: maximum of blocks in either column
  // left is always one main block, right could have multiple cards
  // Based on the markdown, it appears to be a 2-column grid with as many rows as needed
  const numRows = Math.max(1, rightBlocks.length);
  const cells = [];
  // Header - one column, as per example
  cells.push(['Columns (columns6)']);
  // For each row, left: mainBlock only for first row, empty for others; right: card or recent
  for (let i = 0; i < numRows; i++) {
    const leftCell = i === 0 ? mainBlock : '';
    const rightCell = rightBlocks[i] || '';
    cells.push([leftCell, rightCell]);
  }
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
