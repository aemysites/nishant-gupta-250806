/* global WebImporter */
export default function parse(element, { document }) {
  // Extract title from the button in .card-header
  let titleElem = null;
  const headerDiv = element.querySelector('.card-header');
  if (headerDiv) {
    const btn = headerDiv.querySelector('button');
    if (btn) {
      const btnClone = btn.cloneNode(true);
      btnClone.querySelectorAll('i').forEach(i => i.remove());
      [...btnClone.attributes].forEach(attr => btnClone.removeAttribute(attr.name));
      titleElem = btnClone;
    } else {
      titleElem = document.createElement('div');
      titleElem.textContent = headerDiv.textContent.trim();
    }
  } else {
    titleElem = document.createElement('div');
  }

  // Extract content from .card-body in .collapse
  let contentElem = null;
  const collapseDiv = element.querySelector('.collapse');
  if (collapseDiv) {
    const cardBody = collapseDiv.querySelector('.card-body');
    if (cardBody) {
      contentElem = cardBody;
    } else {
      contentElem = document.createElement('div');
    }
  } else {
    contentElem = document.createElement('div');
  }

  // Create the table as usual
  const cells = [
    ['Accordion (accordion15)'],
    [titleElem, contentElem]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Fix: Set header cell colspan to number of columns in data row
  const headerRow = block.querySelector('tr:first-child');
  if (headerRow && headerRow.children.length === 1) {
    headerRow.children[0].setAttribute('colspan', '2');
  }

  element.replaceWith(block);
}
