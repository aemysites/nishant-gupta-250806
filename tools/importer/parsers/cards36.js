/* global WebImporter */
export default function parse(element, { document }) {
  // The provided HTML only contains a close modal button (no card content, images, headings, or text as required by Cards block)
  // Therefore, the only valid output is a block table with just the header row, per spec for empty content
  const headerRow = ['Cards (cards36)'];
  const cells = [headerRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new structured block
  element.replaceWith(block);
}
