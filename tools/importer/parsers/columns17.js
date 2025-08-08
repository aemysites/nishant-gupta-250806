/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: convert relative image srcs to absolute
  function absolutizeImgSrc(img) {
    if (img && img.src && img.src.startsWith('//')) {
      img.src = 'https:' + img.src;
    }
    return img;
  }

  // Get the two major blocks for columns: address and contact
  const tollFreeEmailBox = element.querySelector('.tollFreeEmailBox');
  const addressSecMain = element.querySelector('.addressSecMain');

  // Prepare the right column: contact details
  let contactCol = null;
  if (tollFreeEmailBox) {
    contactCol = document.createElement('div');
    Array.from(tollFreeEmailBox.children).forEach(box => {
      // For each .callEmailSec
      // Make sure to reference the actual children, not clones
      const iconSpan = box.querySelector('span');
      const label = box.querySelector('label');
      const h3 = box.querySelector('h3');
      if (iconSpan && iconSpan.querySelector('img')) {
        absolutizeImgSrc(iconSpan.querySelector('img'));
      }
      if (iconSpan) contactCol.appendChild(iconSpan);
      if (label) contactCol.appendChild(label);
      if (h3) contactCol.appendChild(h3);
    });
  } else {
    contactCol = document.createElement('div');
  }

  // Prepare the left column: address
  let addressCol = null;
  if (addressSecMain) {
    addressCol = document.createElement('div');
    // Address image
    const addressImg = addressSecMain.querySelector('.addressImg img');
    if (addressImg) {
      absolutizeImgSrc(addressImg);
      addressCol.appendChild(addressImg);
    }
    // Details
    const addressDetails = addressSecMain.querySelector('.addressDetails');
    if (addressDetails) {
      // Only append .addressTxtSec if present
      const txtSec = addressDetails.querySelector('.addressTxtSec');
      if (txtSec) {
        addressCol.appendChild(txtSec);
      }
    }
  } else {
    addressCol = document.createElement('div');
  }

  // Compose final columns block
  const headerRow = ['Columns (columns17)'];
  const columnsRow = [addressCol, contactCol];
  const cells = [headerRow, columnsRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
