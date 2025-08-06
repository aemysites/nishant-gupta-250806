/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match exactly
  const headerRow = ['Cards (cards16)'];
  const cells = [headerRow];

  // Get the card container robustly
  const cardContainer = element.querySelector('.masonry.myList') || element;
  // Select all .brick elements directly (each card)
  const bricks = cardContainer.querySelectorAll('.brick');

  bricks.forEach((brick) => {
    // First cell: the image (may be missing, fallback to empty string)
    const img = brick.querySelector('img');
    const imgCell = img || '';
    
    // Second cell: collect all text content in proper order
    // 1. h3 (title), 2. p (description), 3. .readNdateSec (CTA + date)
    const textSec = brick.querySelector('.mediaTxtSec');
    // We'll build a container div to preserve order and structure
    let textCell = '';
    if (textSec) {
      const contentDiv = document.createElement('div');
      const title = textSec.querySelector('h3');
      if (title) contentDiv.appendChild(title);
      const desc = textSec.querySelector('p');
      if (desc) contentDiv.appendChild(desc);
      const readNdate = textSec.querySelector('.readNdateSec');
      if (readNdate) contentDiv.appendChild(readNdate);
      textCell = contentDiv;
    }
    else {
      // Fallback: use all text content from the brick
      textCell = brick;
    }
    cells.push([imgCell, textCell]);
  });

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
