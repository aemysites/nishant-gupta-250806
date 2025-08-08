/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate child by class
  function getChildByClass(parent, className) {
    for (const child of parent.children) {
      if (child.classList.contains(className)) return child;
    }
    return null;
  }

  // Get .container > .row structure
  const container = getChildByClass(element, 'container') || element;
  const row = getChildByClass(container, 'row') || container;
  const columns = row.querySelectorAll(':scope > div'); // Should be two columns

  // Defensive: check number of columns
  let leftCol = columns[0] || row;
  let rightCol = columns[1] || null;

  // Left column: Find text block
  let aboutFirsTxtSec = leftCol.querySelector('.aboutFirsTxtSec') || leftCol;
  let contentDiv = aboutFirsTxtSec.querySelector('.aboutFirsTxtInn') || aboutFirsTxtSec;

  // Defensive: If empty, use leftCol
  if (!contentDiv || !contentDiv.textContent.trim()) contentDiv = leftCol;

  // Right column: Find image
  let imageElement = null;
  if (rightCol) {
    let aboutFirsImgSec = rightCol.querySelector('.aboutFirsImgSec') || rightCol;
    imageElement = aboutFirsImgSec.querySelector('img');
  }

  // If no image found, leave cell empty
  const rightCell = imageElement || '';

  // Fix: Header row should be a single cell (not two!)
  // Content row has two cells (columns)
  const cells = [
    ['Columns (columns46)'], // header row: one cell only!
    [contentDiv, rightCell]  // content row: as many columns as needed
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
