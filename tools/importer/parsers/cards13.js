/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell, regardless of the number of columns in content rows
  const headerRow = ['Cards (cards13)'];

  // Extract button element (icon/cta) for the first cell
  const button = element.querySelector('button');

  // Create card row with two cells: button in first, empty string in second (no text content)
  const cardRow = [button || '', ''];

  // Construct the table with the header row and the card row
  const tableCells = [headerRow, cardRow];

  // Use createTable to generate the block
  const blockTable = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the original element with the new block table
  element.replaceWith(blockTable);
}
