/* global WebImporter */
export default function parse(element, { document }) {
  // Utility to get absolute image src
  function getAbsoluteSrc(img) {
    let src = img.getAttribute('src') || img.getAttribute('data-src') || '';
    if (src.startsWith('//')) {
      src = 'https:' + src;
    }
    return src;
  }

  if (!element) return;

  const mainRow = element.querySelector('.row');
  if (!mainRow) return;

  const leftCol = mainRow.querySelector('.col-lg-8');
  const rightCol = mainRow.querySelector('.col-lg-4');

  // Compose left (main) column
  let leftContent = document.createElement('div');
  if (leftCol) {
    const h1 = leftCol.querySelector('.mediaDetailSec h1');
    if (h1) leftContent.appendChild(h1);
    const mainImgDiv = leftCol.querySelector('.mediaImg');
    if (mainImgDiv) {
      const img = mainImgDiv.querySelector('img');
      if (img) {
        img.src = getAbsoluteSrc(img);
        leftContent.appendChild(img);
      }
    }
    const mediaTxtBox = leftCol.querySelector('.mediaDetailTxtBox');
    if (mediaTxtBox) {
      Array.from(mediaTxtBox.childNodes).forEach(node => {
        // Avoid empty divs
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'DIV') {
          leftContent.appendChild(node);
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'DIV' && node.textContent.trim() !== '') {
          leftContent.appendChild(node);
        }
      });
    }
  }

  // Compose right (sidebar) column
  let rightContent = document.createElement('div');
  if (rightCol) {
    const mediaDetailList = rightCol.querySelector('.mediaDetailList');
    if (mediaDetailList) {
      Array.from(mediaDetailList.children).forEach(card => {
        rightContent.appendChild(card);
      });
    }
    const mediaRecentArticle = rightCol.querySelector('.mediaRecentArticle');
    if (mediaRecentArticle) {
      rightContent.appendChild(mediaRecentArticle);
    }
  }

  // Compose the cells array, with header as a single column, second row as two columns
  // After table creation, set thead th colspan to number of columns in second row
  const cells = [
    ['Columns (columns12)'],
    [leftContent, rightContent],
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Fix: Set header cell colspan to match the number of columns in the second row
  const thead = block.querySelector('thead');
  if (thead) {
    const th = thead.querySelector('th');
    if (th) {
      th.setAttribute('colspan', cells[1].length);
    }
  } else {
    // If no thead, fallback for table structures without thead
    const firstRow = block.querySelector('tr');
    if (firstRow) {
      const th = firstRow.querySelector('th');
      if (th) {
        th.setAttribute('colspan', cells[1].length);
      }
    }
  }

  element.replaceWith(block);
}
