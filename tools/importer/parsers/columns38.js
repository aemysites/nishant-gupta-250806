/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: single cell, matches example
  const headerRow = ['Columns (columns38)'];

  // Get the four main column divs
  const rowDiv = element.querySelector('.footerLinkMain .container .row');
  let colDivs = [];
  if (rowDiv) {
    colDivs = Array.from(rowDiv.querySelectorAll(':scope > div')).slice(0, 4);
  }

  // Compose left main cell: group the first three columns (navigation/footer lists)
  const leftMain = document.createElement('div');
  [0, 1, 2].forEach(i => { if (colDivs[i]) leftMain.appendChild(colDivs[i]); });

  // Compose right main cell: fourth column (download app/social)
  const rightMain = document.createElement('div');
  if (colDivs[3]) rightMain.appendChild(colDivs[3]);

  // Bottom row left: app images from DOWNLOAD APP
  const appImagesDiv = document.createElement('div');
  if (colDivs[3]) {
    const appImgs = colDivs[3].querySelectorAll('.appStoreGooglePlay img');
    appImgs.forEach(img => appImagesDiv.appendChild(img));
  }

  // Bottom row right: legal notes and copyright
  const notes = Array.from(element.querySelectorAll('.whyusnote'));
  const rightBottomDiv = document.createElement('div');
  notes.forEach(note => rightBottomDiv.appendChild(note));
  const copyrightDiv = element.querySelector('.copyrightTxt');
  if (copyrightDiv && copyrightDiv.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = copyrightDiv.textContent.trim();
    rightBottomDiv.appendChild(p);
  }

  // Compose table
  const tableCells = [
    headerRow,
    [leftMain, rightMain],
    [appImagesDiv, rightBottomDiv]
  ];
  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(block);
}
