/* global WebImporter */
export default function parse(element, { document }) {
  // Compose the header row
  const headerRow = ['Accordion (accordion18)'];

  // Extract the title cell: the button inside the card-header, minus icons
  let titleCell = '';
  const cardHeader = element.querySelector('.card-header');
  if (cardHeader) {
    const button = cardHeader.querySelector('button');
    if (button) {
      // Make a copy so we don't mutate the DOM
      const buttonCopy = button.cloneNode(true);
      // Remove any icons (fa-minus/fa-plus)
      buttonCopy.querySelectorAll('i').forEach(i => i.remove());
      // Remove any whitespace-only text nodes
      [...buttonCopy.childNodes].forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) {
          buttonCopy.removeChild(node);
        }
      });
      // Use the button's content
      // Wrap in a <div> for a clean cell (since button is not needed for display)
      const div = document.createElement('div');
      div.innerHTML = buttonCopy.innerHTML.trim();
      titleCell = div;
    }
  }

  // Extract the content cell: the .card-body element
  let contentCell = '';
  const cardBody = element.querySelector('.card-body');
  if (cardBody) {
    contentCell = cardBody;
  }

  // Build the table rows
  const rows = [
    headerRow,
    [titleCell, contentCell]
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
