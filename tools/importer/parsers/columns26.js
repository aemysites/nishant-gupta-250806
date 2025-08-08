/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match example exactly: single cell
  const headerRow = ['Columns (columns26)'];

  // Find all .item > .coursesRptSec blocks representing each column
  const itemEls = element.querySelectorAll('.item');
  const seenTitles = new Set();
  const columns = [];

  itemEls.forEach(item => {
    const courseBlock = item.querySelector('.coursesRptSec');
    if (!courseBlock) return;
    const titleEl = courseBlock.querySelector('h3');
    if (!titleEl) return;
    const title = titleEl.textContent.trim();
    if (seenTitles.has(title)) return;
    seenTitles.add(title);

    // Reference all children of each courseBlock, preserving structure and all text content
    // Do not filter or clone, just reference existing nodes
    const colContent = Array.from(courseBlock.childNodes).filter(node => {
      // Exclude input elements (used for GA, not content), otherwise preserve all
      return !(node.nodeType === Node.ELEMENT_NODE && node.tagName === 'INPUT');
    });
    columns.push(colContent);
  });

  // Only build and replace if we have actual columns
  if (columns.length > 0) {
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      columns
    ], document);
    element.replaceWith(table);
  }
}