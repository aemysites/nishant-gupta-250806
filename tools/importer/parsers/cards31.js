/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block spec
  const headerRow = ['Cards (cards31)'];
  const rows = [headerRow];

  // Find the visible cards only
  const stage = element.querySelector('.owl-stage');
  if (!stage) return;
  const cardItems = Array.from(stage.querySelectorAll('.owl-item.active'));

  cardItems.forEach((item) => {
    // Each card: .item > .roadSafetySec > .roadSafetyImgTxt
    const card = item.querySelector('.roadSafetyImgTxt');
    if (!card) return;

    // Use the EXISTING <img> element, set its src if only data-src present
    const img = card.querySelector('img');
    if (img && !img.src && img.getAttribute('data-src')) {
      img.src = img.getAttribute('data-src');
    }

    // Collect all content except the image into the text cell (robust and future-proof)
    const textCellContent = [];
    Array.from(card.childNodes).forEach((node) => {
      // If the node is an element and is the image, skip
      if (node.nodeType === 1 && node.tagName === 'IMG') return;
      // For a <span> (the label), wrap in <strong> as title
      if (node.nodeType === 1 && node.tagName === 'SPAN') {
        const strong = document.createElement('strong');
        strong.textContent = node.textContent;
        textCellContent.push(strong);
      } else if (node.nodeType === 3) {
        // text node, preserve if not whitespace
        if (node.textContent.trim()) {
          textCellContent.push(document.createTextNode(node.textContent));
        }
      } else if (node.nodeType === 1) {
        // If it's another element (eg <p>), keep it as is
        textCellContent.push(node);
      }
    });
    // If nothing, keep as empty string
    const textCell = textCellContent.length ? textCellContent : '';

    rows.push([
      img || '',
      textCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
