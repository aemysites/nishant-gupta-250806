/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards16)'];

  // Set to track unique cards by a key
  const seenCards = new Set();
  const cards = [];

  // Find all .listboxes inside this block
  let cardNodes = element.querySelectorAll('.listboxes');
  // If none, maybe element itself is a .listboxes
  if (cardNodes.length === 0 && element.classList.contains('listboxes')) {
    cardNodes = [element];
  }
  // If still none, fallback to .brick
  if (cardNodes.length === 0) {
    cardNodes = element.querySelectorAll('.brick');
  }
  if (cardNodes.length === 0 && element.classList.contains('brick')) {
    cardNodes = [element];
  }

  cardNodes.forEach((cardNode) => {
    // Find the .brick for this card
    let brick = cardNode.querySelector('.brick');
    if (!brick && cardNode.classList.contains('brick')) {
      brick = cardNode;
    }
    if (!brick) {
      brick = cardNode;
    }
    // Image: first img inside .mediaBanner
    let imgCell = null;
    const mediaBanner = brick.querySelector('.mediaBanner');
    if (mediaBanner) {
      const img = mediaBanner.querySelector('img');
      if (img) imgCell = img;
    }
    // Text cell: gather heading, description, CTA, date
    let textElements = [];
    const mediaTxtSec = brick.querySelector('.mediaTxtSec');
    if (mediaTxtSec) {
      const h3 = mediaTxtSec.querySelector('h3');
      if (h3) textElements.push(h3);
      const desc = mediaTxtSec.querySelector('p');
      if (desc) textElements.push(desc);
      const readNdateSec = mediaTxtSec.querySelector('.readNdateSec');
      if (readNdateSec) {
        const link = readNdateSec.querySelector('a');
        if (link) textElements.push(link);
        const date = readNdateSec.querySelector('.datesR');
        if (date) textElements.push(date);
      }
    }
    // Create a unique key for deduplication
    let key = '';
    if (imgCell && imgCell.src) {
      key += imgCell.src;
    }
    if (textElements.length) {
      key += textElements.map(e => e.textContent.trim()).join('|');
    }
    if (!key) return; // skip empty
    if (!seenCards.has(key)) {
      seenCards.add(key);
      cards.push([imgCell, textElements]);
    }
  });

  const cells = [headerRow, ...cards];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
