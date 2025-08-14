/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per block definition
  const cells = [['Cards (cards30)']];

  // Get all the card elements (valueAddedBox) in DOM order
  const boxes = Array.from(element.querySelectorAll('.owl-item .item .valueAddedBox'));
  boxes.forEach((box) => {
    // First cell: image (inside a span > img, reference the original img element)
    let img = null;
    const span = box.querySelector('span');
    if (span) {
      img = span.querySelector('img');
    }

    // Second cell: heading and description, keeping DOM references and structure
    const content = box.querySelector('.valueAddBoxContent');
    const contentParts = [];
    if (content) {
      const heading = content.querySelector('h3');
      if (heading) {
        contentParts.push(heading);
      }
      const para = content.querySelector('p');
      if (para) {
        if (contentParts.length > 0) {
          contentParts.push(document.createElement('br'));
        }
        contentParts.push(para);
      }
    }
    cells.push([
      img,
      contentParts
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
