/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure the header is exactly as required
  const cells = [['Cards (cards4)']];

  // Determine if 'element' is a single card or a container of cards
  let cardElements = [];
  if (element.classList.contains('addressSecMain')) {
    // Single card
    cardElements = [element];
  } else {
    // Container: collect all immediate cards
    cardElements = Array.from(element.querySelectorAll(':scope > .addressSecMain'));
  }

  cardElements.forEach(card => {
    // Image cell (mandatory)
    let img = '';
    const imgDiv = card.querySelector(':scope > .addressImg');
    if (imgDiv) {
      const foundImg = imgDiv.querySelector('img');
      if (foundImg) img = foundImg;
    }

    // Text cell (mandatory)
    const addressDetails = card.querySelector(':scope > .addressDetails');
    let textFrag = document.createDocumentFragment();
    if (addressDetails) {
      const txtSec = addressDetails.querySelector(':scope > .addressTxtSec');
      // Title: span and h2 if present
      if (txtSec) {
        const spanTitle = txtSec.querySelector('span');
        if (spanTitle && spanTitle.textContent.trim()) {
          const strong1 = document.createElement('strong');
          strong1.textContent = spanTitle.textContent.trim();
          textFrag.appendChild(strong1);
          textFrag.appendChild(document.createElement('br'));
        }
        const h2Title = txtSec.querySelector('h2');
        if (h2Title && h2Title.textContent.trim()) {
          const strong2 = document.createElement('strong');
          strong2.textContent = h2Title.textContent.trim();
          textFrag.appendChild(strong2);
          textFrag.appendChild(document.createElement('br'));
        }
        // Address/description
        const descP = txtSec.querySelector('p');
        if (descP) {
          // Convert <br> to line breaks for rendering
          const childNodes = Array.from(descP.childNodes);
          let block = document.createElement('div');
          childNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
              if (block.textContent.trim() !== '') {
                textFrag.appendChild(block);
                block = document.createElement('div');
              }
            } else {
              block.appendChild(node.cloneNode(true));
            }
          });
          if (block.textContent.trim() !== '') {
            textFrag.appendChild(block);
          }
        }
      }
      // Phone (call-to-action)
      const dirCall = addressDetails.querySelector(':scope > .directionCallNumber');
      if (dirCall) {
        const telA = dirCall.querySelector('a[href^="tel:"]');
        if (telA && telA.textContent.trim()) {
          textFrag.appendChild(document.createElement('br'));
          const telLink = document.createElement('a');
          telLink.href = telA.getAttribute('href');
          telLink.textContent = telA.textContent.trim();
          textFrag.appendChild(telLink);
        }
      }
    }

    cells.push([
      img || '',
      textFrag
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
