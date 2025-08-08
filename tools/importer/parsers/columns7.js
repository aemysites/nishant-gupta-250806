/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Block Header: must match the spec exactly
  const headerRow = ['Columns (columns7)'];

  // 2. Gather columns (immediate children with content)
  const colDivs = Array.from(element.querySelectorAll(':scope > div'));

  // 3. For each column, reference its .footerLink (which contains the heading and links),
  //    or the column itself if .footerLink missing (defensive)
  const columns = colDivs.map(col => {
    const content = col.querySelector('.footerLink');
    return content || col;
  });

  // 4. Only include non-empty columns (all given HTMLs have content)
  //    The HTML structure is guaranteed, but for resilience:
  const filteredColumns = columns.filter(col => col && (col.textContent.trim() || col.querySelector('img') || col.querySelector('ul')));

  // 5. Final table array: header row, then content row (columns)
  const tableRows = [headerRow, filteredColumns];

  // 6. Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // 7. Replace the original element with the new block table
  element.replaceWith(block);
}
