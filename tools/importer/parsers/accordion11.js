/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: match example exactly
  const headerRow = ['Accordion (accordion11)'];

  // --- Title Cell Extraction ---
  let titleCell = '';
  const cardHeader = element.querySelector('.card-header');
  if (cardHeader) {
    // Find first h3 (should always exist for this accordion)
    const h3 = cardHeader.querySelector('h3');
    if (h3) {
      // The button inside h3 contains the title and icons
      const btn = h3.querySelector('button');
      if (btn) {
        // Only include the text content and inline child nodes except icons
        // Use all child nodes except <em>
        const nodes = [];
        btn.childNodes.forEach(node => {
          if (!(node.nodeType === Node.ELEMENT_NODE && node.tagName === 'EM')) {
            nodes.push(node);
          }
        });
        // If result is empty, fallback to btn.textContent
        titleCell = nodes.length > 0 ? nodes : [btn.textContent.trim()];
      } else {
        titleCell = [h3.textContent.trim()];
      }
    } else {
      titleCell = [cardHeader.textContent.trim()];
    }
  } else {
    titleCell = [''];
  }

  // --- Content Cell Extraction ---
  let contentCell = '';
  const collapse = element.querySelector('.collapse');
  if (collapse) {
    const cardBody = collapse.querySelector('.card-body');
    if (cardBody) {
      // Include ALL children of card-body, not just paragraphs
      const children = Array.from(cardBody.childNodes).filter(node => {
        // Remove empty text nodes
        return !(node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '');
      });
      contentCell = children.length > 0 ? children : [cardBody.textContent.trim()];
    } else {
      contentCell = [collapse.textContent.trim()];
    }
  } else {
    contentCell = [''];
  }

  // --- Cells Array Construction ---
  const cells = [
    headerRow,
    [titleCell, contentCell]
  ];

  // --- Table Creation ---
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(block);
}
