/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main .container
  const container = element.querySelector('.container');
  if (!container) return;
  // Find the direct row for columns
  const row = container.querySelector('.row');
  if (!row) return;
  const cols = Array.from(row.children);
  // Identify left (main) and right (sidebar) columns
  let mainCol = cols.find(col => col.classList.contains('col-lg-8'));
  let sideCol = cols.find(col => col.classList.contains('col-lg-4'));
  if (!mainCol || !sideCol) return;

  // 1. LEFT COLUMN: Find main article content (mediaDetailSec)
  let mainContent = mainCol.querySelector('.mediaDetailSec');
  if (!mainContent) mainContent = mainCol;
  // 2. RIGHT COLUMN: sidebar (the entire side column, as content blocks can vary)
  let sidebarContent = sideCol;

  // Build the columns3 block structure
  // The first row is the block name, per requirements
  const headerRow = ['Columns (columns3)'];
  const contentRow = [mainContent, sidebarContent];
  const cells = [headerRow, contentRow];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the block table
  element.replaceWith(table);
}
