/* global WebImporter */
export default function parse(element, { document }) {
  // Define header matching the block name from the instructions
  const headerRow = ['Cards (cards39)'];
  const rows = [headerRow];

  // Find the main card container
  const collapseDiv = element.querySelector('.collapse');
  if (!collapseDiv) return;
  const cardBody = collapseDiv.querySelector('.card-body');
  if (!cardBody) return;
  const blogRptSec = cardBody.querySelector('.blogRptSec');
  if (!blogRptSec) return;

  // Extract the image for the left cell
  let imgCell = null;
  const banner = blogRptSec.querySelector('.blogBanner');
  if (banner) {
    const img = banner.querySelector('img');
    if (img) {
      // Use src if available, otherwise use data-src
      if (!img.getAttribute('src') && img.getAttribute('data-src')) {
        img.setAttribute('src', img.getAttribute('data-src'));
        img.removeAttribute('data-src');
      }
      imgCell = img;
    }
  }

  // Create the right cell containing title, description, and CTA
  const txtSec = blogRptSec.querySelector('.blogTxtSec');
  const cellFragments = [];
  if (txtSec) {
    // Title: use the original h3 element for semantic meaning
    const h3 = txtSec.querySelector('h3');
    if (h3) {
      cellFragments.push(h3);
    }
    // Description: use the original summary div
    const summary = txtSec.querySelector('.blogcontentSummary');
    if (summary && summary.textContent.trim()) {
      cellFragments.push(summary);
    }
    // CTA: use the actual link if present
    const readSec = txtSec.querySelector('.readNdateSec');
    if (readSec) {
      const readLink = readSec.querySelector('a.readMoreLink');
      if (readLink) {
        cellFragments.push(readLink);
      }
    }
  }

  // Only add the row if at least image or text is present
  if (imgCell || cellFragments.length) {
    rows.push([imgCell, cellFragments]);
  }

  // Create and replace block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
