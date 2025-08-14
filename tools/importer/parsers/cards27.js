/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the header row exactly as specified
  const cells = [
    ['Cards (cards27)']
  ];

  // Find the set of card columns
  const cardColumns = element.querySelectorAll('.row > .col-lg-6');

  cardColumns.forEach((col) => {
    // First cell: the card image (existing DOM element)
    let img = null;
    const imgBox = col.querySelector('.quizScoreCourseImg');
    if (imgBox) {
      img = imgBox.querySelector('img');
    }
    // Second cell: all card text and CTA (existing DOM elements)
    const textElements = [];
    const txtBox = col.querySelector('.quizScoreCourseTxt');
    if (txtBox) {
      // Title
      const h2 = txtBox.querySelector('h2');
      if (h2) textElements.push(h2);
      // Description
      const p = txtBox.querySelector('p');
      if (p) textElements.push(p);
      // CTA button
      const ctaDiv = txtBox.querySelector('.blueButton');
      if (ctaDiv) {
        const ctaLink = ctaDiv.querySelector('a');
        if (ctaLink) textElements.push(ctaLink);
      }
    }
    // Add row if at least image or text exists
    if (img || textElements.length) {
      cells.push([
        img,
        textElements
      ]);
    }
  });

  // Create and replace with the new table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
