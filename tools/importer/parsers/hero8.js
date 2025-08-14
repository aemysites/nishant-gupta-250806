/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row must exactly match: Hero (hero8)
  const headerRow = ['Hero (hero8)'];

  // 2. Background image row: the picture element (if present)
  // Look for <picture> direct child
  const picture = element.querySelector('picture');
  const imageRow = [picture];

  // 3. Title/subheading/cta row: relevant text content (h1, subheading, paragraph, etc.)
  // Find .innerBannerTxt > .container, and include all non-empty child elements
  let contentCell = [];
  const innerBannerTxt = element.querySelector('.innerBannerTxt');
  if (innerBannerTxt) {
    const container = innerBannerTxt.querySelector('.container');
    if (container) {
      // Collect all non-empty element children (h1, p, etc.)
      contentCell = Array.from(container.children).filter(child => {
        if (child.tagName && child.textContent && child.textContent.trim()) {
          return true;
        }
        return false;
      });
      // If there are none (edge case), contentCell will be empty
    } else {
      // Fallback: add innerBannerTxt if container missing
      contentCell = [innerBannerTxt];
    }
  }
  const contentRow = [contentCell];

  // Final table assembly
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
