/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per block name from example
  const headerRow = ['Hero (hero8)'];

  // 2nd row: Background image (reference <picture> if present, else <img>)
  let bgElement = element.querySelector('picture');
  if (!bgElement) {
    bgElement = element.querySelector('img');
  }

  // 3rd row: Text content (h1, subheadings, cta, paragraphs)
  let textCell = null;
  // This should include all relevant text elements for resilience
  const bannerTxt = element.querySelector('.innerBannerTxt');
  if (bannerTxt) {
    // Try to find the .container, if it exists, use its children
    const container = bannerTxt.querySelector('.container');
    if (container) {
      // Only keep children with non-empty text or elements (skip empty p)
      const children = Array.from(container.children).filter(el => el.textContent.trim().length > 0);
      if (children.length > 0) {
        textCell = children;
      } else {
        // Edge case: container exists but is empty
        textCell = null;
      }
    } else {
      // If no .container, but text exists in .innerBannerTxt, use it
      const txtChildren = Array.from(bannerTxt.children).filter(el => el.textContent.trim().length > 0);
      textCell = txtChildren.length > 0 ? txtChildren : null;
    }
  }

  // Compose table rows
  const cells = [
    headerRow,
    [bgElement],
    [textCell],
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
