/* global WebImporter */
export default function parse(element, { document }) {
  // Find hero image: prefer desktop, fallback to mobile
  let imgEl = null;
  const desktopImg = element.querySelector('.col-lg-7.d-none.d-lg-block .corporateTrainingImg img');
  if (desktopImg && (desktopImg.getAttribute('src') || desktopImg.getAttribute('data-src'))) {
    imgEl = desktopImg;
  } else {
    const mobileImg = element.querySelector('.col-lg-7.d-block.d-lg-none .corporateTrainingImg img');
    if (mobileImg && (mobileImg.getAttribute('src') || mobileImg.getAttribute('data-src'))) {
      imgEl = mobileImg;
    }
  }

  // Gather the title, paragraph, and CTA from the text column
  const txtCol = element.querySelector('.col-lg-5.col-sm-12 .corporateTrainingTxt');
  const textContent = [];
  if (txtCol) {
    // Title (h2)
    const heading = txtCol.querySelector('h2');
    if (heading) textContent.push(heading);
    // Paragraph
    const paragraph = txtCol.querySelector('p');
    if (paragraph) textContent.push(paragraph);
    // CTA Button
    const cta = txtCol.querySelector('.blueButton a');
    if (cta) textContent.push(cta);
  }

  // Build the table for Hero (hero29)
  const cells = [
    ['Hero (hero29)'],
    [imgEl ? imgEl : ''],
    [textContent.length > 0 ? textContent : ''],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
