/* global WebImporter */
export default function parse(element, { document }) {
  // Only operate on direct cards, not accordion container wrappers
  // The provided HTML is for a single card, so we create one row per invocation

  // Defensive checks for structure and missing elements
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList && child.classList.contains(className));
  }

  const blogRptSec = element.querySelector('.blogRptSec');
  if (!blogRptSec) return; // No card content

  const blogBanner = getDirectChildByClass(blogRptSec, 'blogBanner');
  const blogTxtSec = getDirectChildByClass(blogRptSec, 'blogTxtSec');

  // Image element (may be missing)
  let imgEl = null;
  if (blogBanner) {
    const foundImg = blogBanner.querySelector('img');
    if (foundImg) imgEl = foundImg;
  }

  // Text cell: collect in order: heading, summary, CTA
  const textCellContent = [];
  if (blogTxtSec) {
    const heading = blogTxtSec.querySelector('h3');
    if (heading && heading.textContent.trim()) {
      textCellContent.push(heading);
    }
    const summary = blogTxtSec.querySelector('.blogcontentSummary');
    if (summary && summary.textContent.trim()) {
      textCellContent.push(summary);
    }
    const readMore = blogTxtSec.querySelector('.readMoreLink');
    if (readMore) {
      textCellContent.push(readMore);
    }
  }

  // The block header must be exactly as specified
  const headerRow = ['Cards (cards19)'];
  // Each card row is [image, text content]
  // If no image, cell is null, but column preserved
  const cardRow = [imgEl, textCellContent];
  const tableRows = [headerRow, cardRow];

  // Create table and replace
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(blockTable);
}
