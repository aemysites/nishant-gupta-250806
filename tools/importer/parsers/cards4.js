/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // Helper to extract one card's data from a single .addressSecMain element
  function extractCard(cardEl) {
    // First column: image (mandatory)
    const imgContainer = cardEl.querySelector('.addressImg');
    let img = null;
    if (imgContainer) {
      img = imgContainer.querySelector('img');
    }

    // Second column: text content
    const detailsContainer = cardEl.querySelector('.addressDetails');
    const textContent = [];
    if (detailsContainer) {
      const txtSec = detailsContainer.querySelector('.addressTxtSec');
      if (txtSec) {
        // Location name in <span> (as bold heading)
        const span = txtSec.querySelector('span');
        if (span && span.textContent.trim()) {
          // Use <strong> to match heading style, same as markdown example
          const strong = document.createElement('strong');
          strong.textContent = span.textContent.trim();
          textContent.push(strong);
          // Add a <br> after heading for separation (optional, readability)
          textContent.push(document.createElement('br'));
        }
        // Company name in <h2>, styled as strong block
        const h2 = txtSec.querySelector('h2');
        if (h2 && h2.textContent.trim()) {
          const strongCompany = document.createElement('strong');
          strongCompany.textContent = h2.textContent.trim();
          textContent.push(strongCompany);
          textContent.push(document.createElement('br'));
        }
        // Address in <p>
        const p = txtSec.querySelector('p');
        if (p) {
          textContent.push(p);
        }
      }
      // Call-to-action (phone link) in .directionCallNumber
      const callUl = detailsContainer.querySelector('.directionCallNumber ul');
      if (callUl && callUl.children.length > 0) {
        Array.from(callUl.children).forEach(li => {
          const a = li.querySelector('a');
          if (a) {
            // Add a <br> before CTA if there was address content
            if (textContent.length > 0) textContent.push(document.createElement('br'));
            textContent.push(a);
          }
        });
      }
    }
    return [img, textContent];
  }

  // Identify which elements are cards
  let cards = [];
  if (element.classList.contains('addressSecMain')) {
    cards = [element];
  } else {
    cards = Array.from(element.querySelectorAll(':scope > .addressSecMain'));
    // If none, maybe all direct children are cards
    if (cards.length === 0) {
      cards = Array.from(element.children).filter(e => e.classList.contains('addressSecMain'));
    }
  }

  // Extract card rows
  cards.forEach(cardEl => {
    const row = extractCard(cardEl);
    rows.push(row);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
