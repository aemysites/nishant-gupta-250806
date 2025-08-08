/* global WebImporter */
export default function parse(element, { document }) {
  // The header row should be a single cell (one column)
  const headerRow = ['Cards (cards2)'];

  // Card row: two cells (first: image/icon or empty string, second: text content)
  // Extract question (title) from header
  let titleEl = null;
  const headerButton = element.querySelector('.card-header button');
  if (headerButton) {
    // Only use text nodes for title (ignore icon <em> elements)
    let btnText = '';
    Array.from(headerButton.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        btnText += node.textContent;
      }
    });
    btnText = btnText.trim();
    if (btnText) {
      titleEl = document.createElement('strong');
      titleEl.textContent = btnText;
    }
  }

  // Extract answer (description)
  let descEl = null;
  const cardBody = element.querySelector('.card-body');
  if (cardBody) {
    const p = cardBody.querySelector('p');
    if (p) {
      descEl = p;
    } else if (cardBody.textContent.trim()) {
      descEl = document.createElement('p');
      descEl.textContent = cardBody.textContent.trim();
    }
  }

  // Assemble card content (title then description)
  const cardContent = [];
  if (titleEl) cardContent.push(titleEl);
  if (descEl) cardContent.push(descEl);
  
  // Cards2 expects: [header], [image/icon, text content]
  const cells = [
    headerRow,                              // first row: one cell
    ['', cardContent]                       // second row: two cells
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
