/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the title from the header button, stripping icons
  const headerBtn = element.querySelector('.card-header button');
  let titleCell;
  if (headerBtn) {
    // Remove <i> icons
    headerBtn.querySelectorAll('i').forEach(i => i.remove());
    // Collect text and inline elements
    const titleDiv = document.createElement('div');
    headerBtn.childNodes.forEach(node => {
      if (
        (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length) ||
        node.nodeType === Node.ELEMENT_NODE
      ) {
        titleDiv.appendChild(node.cloneNode(true));
      }
    });
    titleCell = titleDiv;
  } else {
    titleCell = document.createTextNode('');
  }

  // Extract the body/content
  const cardBody = element.querySelector('.card-body');
  let contentCell;
  if (cardBody) {
    const contentDiv = document.createElement('div');
    cardBody.childNodes.forEach(n => {
      if (
        (n.nodeType === Node.TEXT_NODE && n.textContent.trim().length) ||
        n.nodeType === Node.ELEMENT_NODE
      ) {
        contentDiv.appendChild(n.cloneNode(true));
      }
    });
    contentCell = contentDiv;
  } else {
    contentCell = document.createTextNode('');
  }

  // Create the table with the correct structure
  const rows = [];
  // The header row must be a single cell, but must span the full table width (2 columns)
  // So after table creation, set colspan=2 on the first th
  rows.push(['Accordion (accordion11)']);
  rows.push([titleCell, contentCell]);

  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Fix the <th> colspan if table is at least two columns wide
  const th = table.querySelector('tr th');
  if (th && table.rows[1] && table.rows[1].cells.length === 2) {
    th.setAttribute('colspan', '2');
  }

  element.replaceWith(table);
}
