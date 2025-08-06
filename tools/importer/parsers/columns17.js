/* global WebImporter */
export default function parse(element, { document }) {
  // Extract address (left column)
  const addressSecMain = element.querySelector('.addressSecMain');
  let addressCellContent = [];
  if (addressSecMain) {
    const addressImg = addressSecMain.querySelector('.addressImg');
    const addressDetails = addressSecMain.querySelector('.addressDetails');
    if (addressImg && addressDetails) {
      addressCellContent = [addressImg, addressDetails];
    } else if (addressImg) {
      addressCellContent = [addressImg];
    } else if (addressDetails) {
      addressCellContent = [addressDetails];
    }
  }

  // Extract toll-free and email columns
  const tollFreeEmailBox = element.querySelector('.tollFreeEmailBox');
  let tollFreeCellContent = [];
  let emailCellContent = [];
  if (tollFreeEmailBox) {
    const callEmailSecs = tollFreeEmailBox.querySelectorAll('.callEmailSec');
    if (callEmailSecs.length > 0) {
      tollFreeCellContent = [callEmailSecs[0]];
    }
    if (callEmailSecs.length > 1) {
      emailCellContent = [callEmailSecs[1]];
    }
  }

  // The header row must have three cells: first with block name, two empty
  const headerRow = ['Columns (columns17)', '', ''];

  const tableCells = [
    headerRow,
    [addressCellContent, tollFreeCellContent, emailCellContent]
  ];

  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(block);
}
