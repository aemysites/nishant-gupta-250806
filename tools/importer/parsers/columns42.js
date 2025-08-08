/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as required
  const header = ['Columns (columns42)'];

  // Helper to safely extract an element, or return empty string if not found
  function safeQuery(root, selector) {
    const el = root.querySelector(selector);
    return el ? el : '';
  }

  // LEFT COLUMN: Why Choose Section
  let leftContent = '';
  const leftCol = element.querySelector('.col-lg-8');
  if (leftCol) {
    const whyChooseSec = leftCol.querySelector('.whyChooseSec');
    if (whyChooseSec) {
      leftContent = whyChooseSec;
    }
  }

  // RIGHT COLUMN: Ready Drive Section
  let rightContent = '';
  const rightCol = element.querySelector('.col-lg-4');
  if (rightCol) {
    const readyDriveSec = rightCol.querySelector('.readyDriveSec');
    if (readyDriveSec) {
      rightContent = readyDriveSec;
    }
  }

  // If one of the columns is missing, fallback gracefully
  const row = [leftContent || '', rightContent || ''];

  // Compose the table
  const cells = [header, row];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the element
  element.replaceWith(table);
}
