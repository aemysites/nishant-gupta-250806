/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the carousel stage containing the testimonial items
  const stage = element.querySelector('.owl-stage');
  if (!stage) return;

  // Select all non-cloned owl-items (the true testimonials)
  const owlItems = Array.from(stage.querySelectorAll(':scope > .owl-item')).filter(item => !item.classList.contains('cloned'));

  // Helper function to extract all meaningful text/HTML except image
  function getTextCell(txtSec, box) {
    const nodes = [];
    // Add all children except .testimonialImg
    Array.from(txtSec.children).forEach(child => {
      if (!child.classList.contains('testimonialImg')) {
        nodes.push(child);
      }
    });
    // If .captionNameLocation not in txtSec, look for it in box
    if (!txtSec.querySelector('.captionNameLocation')) {
      const cap = box.querySelector('.captionNameLocation');
      if (cap) nodes.push(cap);
    }
    return nodes.length > 0 ? nodes : [document.createTextNode(txtSec.textContent.trim())];
  }

  // Build each card (row)
  const cards = owlItems.map(owlItem => {
    const box = owlItem.querySelector('.testimonialBox');
    if (!box) return null;
    const txtSec = box.querySelector('.testimonialTxtSec');
    if (!txtSec) return null;

    // --- Image cell ---
    let img = '';
    const imgDiv = txtSec.querySelector('.testimonialImg');
    if (imgDiv) {
      const foundImg = imgDiv.querySelector('img');
      if (foundImg) {
        // Make sure 'src' is set
        if (!foundImg.getAttribute('src') && foundImg.getAttribute('data-src')) {
          foundImg.setAttribute('src', foundImg.getAttribute('data-src'));
        }
        img = foundImg;
      }
    }

    // --- Text cell ---
    const textCell = getTextCell(txtSec, box);
    // Only add row if there's meaningful content
    if (!img && (!textCell || (Array.isArray(textCell) && textCell.length === 1 && !textCell[0].textContent.trim()))) {
      return null;
    }
    return [img || '', textCell];
  }).filter(Boolean);

  // Construct the table with header as in the example
  const cells = [
    ['Cards (cards34)'],
    ...cards
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
