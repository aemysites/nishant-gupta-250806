/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the best (desktop) background image
  function getHeroImg() {
    // Try to find a visible desktop image first
    const desktopImg = element.querySelector('.col-lg-7.d-none.d-lg-block .corporateTrainingImg img[src]');
    if (desktopImg && desktopImg.getAttribute('src')) {
      return desktopImg;
    }
    // Fallback to mobile image if desktop not present
    const mobileImg = element.querySelector('.col-lg-7.d-block.d-lg-none .corporateTrainingImg img[data-src]');
    if (mobileImg && mobileImg.getAttribute('data-src')) {
      mobileImg.setAttribute('src', mobileImg.getAttribute('data-src'));
      mobileImg.removeAttribute('data-src');
      return mobileImg;
    }
    return '';
  }

  // Build the content cell with headline, description, CTA
  function getHeroContent() {
    const contentArr = [];
    // Headline
    const h2 = element.querySelector('.corporateTrainingTxt h2');
    if (h2) contentArr.push(h2);
    // Description
    const p = element.querySelector('.corporateTrainingTxt p');
    if (p) contentArr.push(p);
    // CTA/Button
    const btnDiv = element.querySelector('.corporateTrainingTxt .blueButton');
    if (btnDiv) {
      const a = btnDiv.querySelector('a');
      if (a) contentArr.push(a);
    }
    return contentArr;
  }

  const headerRow = ['Hero (hero29)'];
  const img = getHeroImg();
  const backgroundRow = [img ? img : ''];
  const contentArr = getHeroContent();
  const contentRow = [contentArr.length ? contentArr : ''];

  const cells = [
    headerRow,
    backgroundRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
