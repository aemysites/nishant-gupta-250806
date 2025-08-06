/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the accordion title (as string, without plus/minus icons)
  let titleText = '';
  const header = element.querySelector('.card-header');
  if (header) {
    const btn = header.querySelector('button');
    if (btn) {
      // Remove any <em> icons so only the text is left
      btn.querySelectorAll('em').forEach(em => em.remove());
      // Use textContent for all visible title text
      titleText = btn.textContent.trim();
    }
  }
  // Fallback: empty string if title not found

  // Extract the accordion content (as a document fragment, preserve HTML structure)
  let contentFragment = document.createDocumentFragment();
  const collapse = element.querySelector('.collapse');
  if (collapse) {
    const body = collapse.querySelector('.card-body');
    if (body) {
      // Move all child nodes to the fragment (preserves all text and markup)
      while (body.firstChild) {
        contentFragment.appendChild(body.firstChild);
      }
    }
  }
  // If no content, add empty string
  if (!contentFragment.hasChildNodes()) {
    contentFragment.appendChild(document.createTextNode(''));
  }

  // Compose the table rows as per the example block
  const rows = [
    ['Accordion (accordion2)'],
    [titleText, contentFragment]
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Ensure the header spans two columns, as in the example
  const firstRow = table.querySelector('tr');
  if (firstRow && firstRow.children.length === 1) {
    firstRow.children[0].setAttribute('colspan', '2');
  }

  // Replace the original element in the DOM with our new table
  element.replaceWith(table);
}
