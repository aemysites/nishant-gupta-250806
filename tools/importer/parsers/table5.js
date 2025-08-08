/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .mediaDetailTxtBox which contains the table and all relevant text content
  const detailBox = element.querySelector('.mediaDetailTxtBox');
  if (!detailBox) return;

  // To ensure all content (including text nodes, tables, etc) is included,
  // we collect references to all child nodes from the original DOM (do not clone)
  const cellContent = Array.from(detailBox.childNodes)
    .filter(node => {
      // Only skip empty text nodes
      if (node.nodeType === 3) {
        return node.textContent.trim().length > 0;
      }
      // Always include element nodes
      return true;
    });

  // If all nodes are empty (edge case), just return
  if (cellContent.length === 0) return;

  // Build the table block as per requirements
  const cells = [
    ['Table'],
    [cellContent]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
