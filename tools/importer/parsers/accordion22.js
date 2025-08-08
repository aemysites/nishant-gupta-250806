/* global WebImporter */
export default function parse(element, { document }) {
  // Build the header row as specified in example
  const headerRow = ['Accordion (accordion22)'];
  const rows = [headerRow];

  // Accordion structure: find title and content
  // Title: from button inside h5 inside .card-header
  let titleText = '';
  const cardHeader = element.querySelector('.card-header');
  if (cardHeader) {
    const h5 = cardHeader.querySelector('h5');
    if (h5) {
      const button = h5.querySelector('button');
      if (button) {
        // Remove icon content, get only the text portion
        // Some sites put icons at the end, so get the text up to the first icon
        // We'll get only the text nodes
        const textNodes = Array.from(button.childNodes).filter((n) => n.nodeType === Node.TEXT_NODE);
        if (textNodes.length > 0) {
          titleText = textNodes.map((n) => n.textContent).join('').trim();
        } else {
          titleText = button.textContent.trim();
        }
      }
    }
  }

  // Content: all content inside .card-body
  let contentCell = '';
  const collapseDiv = element.querySelector('.collapse');
  if (collapseDiv) {
    const cardBody = collapseDiv.querySelector('.card-body');
    if (cardBody) {
      contentCell = cardBody;
    }
  }

  rows.push([titleText, contentCell]);

  // Create and replace block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
