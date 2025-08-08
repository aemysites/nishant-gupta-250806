/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get all immediate siblings that are .card, starting at 'element'
  function getCardGroup(startCard) {
    const parent = startCard.parentNode;
    if (!parent) return [startCard];
    const cards = Array.from(parent.querySelectorAll(':scope > .card'));
    // Only build a group if 'element' is the first consecutive .card
    if (cards[0] === startCard) return cards;
    // Otherwise, just this card
    return [startCard];
  }

  const cards = getCardGroup(element);
  const headerRow = ['Accordion (accordion18)'];
  const rows = [headerRow];
  cards.forEach(card => {
    // Title: find .card-header > h3 > button
    let titleCell;
    const cardHeader = card.querySelector('.card-header');
    if (cardHeader) {
      const btn = cardHeader.querySelector('button');
      if (btn) {
        // Remove icons (fa)
        const btnCopy = btn.cloneNode(true);
        btnCopy.querySelectorAll('i.fa').forEach(icon => icon.remove());
        // Remove all collapse/aria/data- attributes
        Array.from(btnCopy.attributes).forEach(attr => {
          if (/^(aria-|data-|class|id)/i.test(attr.name)) btnCopy.removeAttribute(attr.name);
        });
        // If the button only contains a text node, use just the text in a <span>
        if (btnCopy.childNodes.length === 1 && btnCopy.childNodes[0].nodeType === Node.TEXT_NODE) {
          const span = document.createElement('span');
          span.textContent = btnCopy.textContent.trim();
          titleCell = span;
        } else {
          // Use button, trimmed
          btnCopy.innerHTML = btnCopy.innerHTML.trim();
          titleCell = btnCopy;
        }
      } else {
        // fallback: use header text
        titleCell = document.createElement('span');
        titleCell.textContent = cardHeader.textContent.trim();
      }
    } else {
      titleCell = document.createElement('span');
      titleCell.textContent = '';
    }
    // Content: use .card-body (reference existing element)
    let contentCell = card.querySelector('.card-body');
    if (!contentCell) {
      contentCell = document.createElement('div');
    }
    rows.push([titleCell, contentCell]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace all cards in group if grouped
  if (cards.length > 1) {
    cards[0].parentNode.insertBefore(table, cards[0]);
    cards.forEach(card => card.remove());
  } else {
    element.replaceWith(table);
  }
}
