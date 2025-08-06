/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Block header row - must match example exactly
  const cells = [['Table (striped, bordered)']];

  // 2. Find the main content section (left column), be robust in case of structure changes
  // Use .mediaDetailSec if available, else .col-lg-8, else the element itself
  let mainContent = element.querySelector('.mediaDetailSec');
  if (!mainContent) {
    mainContent = element.querySelector('.col-lg-8');
  }
  if (!mainContent) {
    mainContent = element;
  }

  // 3. Gather all content nodes (to capture headings, images, paragraphs, and tables)
  // Reference the existing nodes, do not clone or create new nodes
  const contentParts = [];
  Array.from(mainContent.childNodes).forEach(node => {
    // Only add elements or non-empty text nodes
    if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim() !== '')) {
      contentParts.push(node);
    }
  });

  // 4. Fallback: If for some reason contentParts is empty, fallback to element content
  if (!contentParts.length) {
    Array.from(element.childNodes).forEach(node => {
      if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim() !== '')) {
        contentParts.push(node);
      }
    });
  }

  // 5. Add as a single cell in the second row (not creating extra rows or cells)
  cells.push([contentParts]);

  // 6. Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
