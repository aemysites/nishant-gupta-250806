/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion container: #accordionTab1
  const accordion = element.querySelector('#accordionTab1');
  if (!accordion) return;

  // Table header row matches example exactly
  const headerRow = ['Accordion (accordion6)'];
  const rows = [headerRow];

  // Each accordion item is a div.card
  const cards = accordion.querySelectorAll(':scope > .card');
  cards.forEach(card => {
    // Title cell: find the h2 inside .card-header
    const cardHeader = card.querySelector('.card-header h2');
    let titleCell;
    if (cardHeader) {
      // Remove any child <i> tags (icons), but keep all text and formatting
      const tempHeader = cardHeader.cloneNode(true);
      Array.from(tempHeader.querySelectorAll('i')).forEach(i => i.remove());
      titleCell = tempHeader;
    } else {
      titleCell = '';
    }

    // Content cell: the .card-body
    const cardBody = card.querySelector('.card-body');
    let contentCell;
    if (cardBody) {
      contentCell = cardBody;
    } else {
      contentCell = '';
    }
    rows.push([titleCell, contentCell]);
  });

  // Replace the accordion element with the new block table (reference, do not clone)
  const block = WebImporter.DOMUtils.createTable(rows, document);
  accordion.replaceWith(block);
}
