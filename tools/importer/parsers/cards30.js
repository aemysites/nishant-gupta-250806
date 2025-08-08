/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Cards (cards30)'];

  // Find the carousel that contains the cards
  const carousel = element.querySelector('.owl-carousel');
  if (!carousel) {
    // If the structure changes or is missing, do nothing
    return;
  }
  // Drill down to .owl-stage-outer > .owl-stage
  const stageOuter = carousel.querySelector('.owl-stage-outer');
  if (!stageOuter) return;
  const stage = stageOuter.querySelector('.owl-stage');
  if (!stage) return;

  // Get all card elements: .owl-item .item .valueAddedBox
  const valueAddedBoxes = Array.from(stage.querySelectorAll('.owl-item .item .valueAddedBox'));
  if (valueAddedBoxes.length === 0) return;

  const rows = valueAddedBoxes.map(box => {
    // First cell: image or icon (mandatory)
    let image = null;
    const span = box.querySelector('span');
    if (span) {
      const img = span.querySelector('img');
      if (img) {
        image = img;
      }
    }
    // Second cell: text content
    const content = box.querySelector('.valueAddBoxContent');
    const textElements = [];
    if (content) {
      // Heading (h3)
      const heading = content.querySelector('h3');
      if (heading) {
        textElements.push(heading);
      }
      // Description (p)
      const desc = content.querySelector('p');
      if (desc) {
        textElements.push(desc);
      }
    }
    // Always ensure both cells are present, even if empty
    return [image, textElements];
  });

  // Compile the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
