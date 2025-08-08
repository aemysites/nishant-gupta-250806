/* global WebImporter */
export default function parse(element, { document }) {
  // Find columns: left main/article and right sidebar
  const container = element.querySelector('.container');
  if (!container) return;
  const row = container.querySelector('.row');
  if (!row) return;
  const cols = row.querySelectorAll(':scope > div');
  if (cols.length < 2) return;

  // Left column: main content (col-lg-8)
  const mainCol = cols[0];
  // Right column: sidebar (col-lg-4)
  const rightCol = cols[1];

  // For the left, extract the entire .mediaDetailSec (article body)
  let mainBlock = mainCol.querySelector('.mediaDetailSec');
  // Fallback: if not found, use mainCol itself
  if (!mainBlock) mainBlock = mainCol;

  // For the right, gather all block-level children (cards + mediaRecentArticle)
  // Only direct children to avoid duplication
  const rightBlocks = [];
  Array.from(rightCol.children).forEach(child => {
    // Only include visible blocks (skip empty divs)
    if (child.textContent.trim() || child.querySelector('img')) {
      rightBlocks.push(child);
    }
  });

  // Table header as per spec, exactly
  const headerRow = ['Columns (columns3)'];

  // Second row: left (main), right (sidebar blocks)
  const row2 = [mainBlock, rightBlocks];

  const cells = [headerRow, row2];

  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
