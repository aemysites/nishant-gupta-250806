/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block table header as specified
  const headerRow = ['Accordion (accordion19)'];

  // --- Title cell extraction ---
  // Find the header text (inside <h2> in .card-header)
  let titleCell = '';
  const cardHeader = element.querySelector('.card-header');
  if (cardHeader) {
    const h2 = cardHeader.querySelector('h2');
    if (h2) {
      // Remove the icons <i> elements ONLY for text extraction, but reference the h2 directly for semantics
      // So we reference the existing h2, not a clone or textContent, to preserve formatting
      // Remove the icons (as they are visual only)
      h2.querySelectorAll('i').forEach(i => i.remove());
      titleCell = h2;
    }
  }

  // --- Content cell extraction ---
  // Use the .card-body as the content cell
  let contentCell = '';
  const collapseDiv = element.querySelector('.collapse');
  if (collapseDiv) {
    const cardBody = collapseDiv.querySelector('.card-body');
    if (cardBody) {
      // We want to reference the direct child .card-body for all content (including images, text, links)
      contentCell = cardBody;
    }
  }

  // Compose the rows for the Accordion block
  const rows = [
    headerRow,
    [titleCell, contentCell]
  ];

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}