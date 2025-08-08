/* global WebImporter */
export default function parse(element, { document }) {
  // Compose table header
  const rows = [['Cards (cards27)']];

  // Get all card boxes (columns)
  const cardBoxes = element.querySelectorAll('.quizScoreCourseBox');
  cardBoxes.forEach((cardBox) => {
    // Image (first column)
    const imgDiv = cardBox.querySelector('.quizScoreCourseImg');
    let imgEl = imgDiv && imgDiv.querySelector('img') ? imgDiv.querySelector('img') : null;
    // Reference the actual <img> from the doc

    // Text content (second column)
    const txtDiv = cardBox.querySelector('.quizScoreCourseTxt');
    const textCell = document.createElement('div');

    // Title (h2) as <strong>
    const h2 = txtDiv && txtDiv.querySelector('h2');
    if (h2 && h2.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = h2.textContent;
      textCell.appendChild(strong);
    }

    // Description (p)
    const p = txtDiv && txtDiv.querySelector('p');
    if (p && p.textContent.trim()) {
      const para = document.createElement('p');
      para.textContent = p.textContent;
      textCell.appendChild(para);
    }

    // CTA (link)
    const btnDiv = txtDiv && txtDiv.querySelector('.blueButton');
    const a = btnDiv && btnDiv.querySelector('a');
    if (a && a.textContent.trim()) {
      const ctaP = document.createElement('p');
      // Reference the existing <a> directly
      ctaP.appendChild(a);
      textCell.appendChild(ctaP);
    }

    rows.push([
      imgEl,
      textCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
