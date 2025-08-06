/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the header row (single column as per requirements)
  const headerRow = ['Accordion (accordion22)'];

  // Extract the title:
  // Find the button (usually h3 > button), remove icons, use its text content
  let titleCell = '';
  const cardHeader = element.querySelector('.card-header');
  if (cardHeader) {
    const h3 = cardHeader.querySelector('h3');
    if (h3) {
      const button = h3.querySelector('button');
      if (button) {
        // Remove icons from the button
        Array.from(button.querySelectorAll('em')).forEach(em => em.remove());
        // Reference the existing button element directly (for semantics), but remove icons
        titleCell = button;
      }
    }
  }
  if (!titleCell) {
    // fallback
    titleCell = document.createElement('span');
    titleCell.textContent = 'Untitled Accordion Item';
  }

  // Extract the content cell (card-body)
  let contentCell = '';
  const collapse = element.querySelector('.collapse');
  if (collapse) {
    const cardBody = collapse.querySelector('.card-body');
    if (cardBody) {
      contentCell = cardBody;
    }
  }
  if (!contentCell) {
    contentCell = document.createElement('div');
  }

  // Compose rows: header is a single-column row, data is a two-column row
  const rows = [
    headerRow,      // one column (block name)
    [titleCell, contentCell] // two columns (title, content)
  ];

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
