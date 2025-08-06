/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Hero (hero12)'];

  // Find the hero image (from .mediaImg > img)
  let imageEl = '';
  const mediaImgDiv = element.querySelector('.mediaImg');
  if (mediaImgDiv) {
    const img = mediaImgDiv.querySelector('img');
    if (img) {
      // Fix protocol-relative URLs
      if (img.src && img.src.startsWith('//')) {
        img.src = 'https:' + img.src;
      } else if (img.getAttribute('src') && img.getAttribute('src').startsWith('//')) {
        img.src = 'https:' + img.getAttribute('src');
      }
      imageEl = img;
    }
  }
  const imageRow = [imageEl];

  // Gather title (h1) and main content (all content from .mediaDetailTxtBox .content-wrapper)
  let contentElements = [];
  const mediaDetailSec = element.querySelector('.mediaDetailSec');
  if (mediaDetailSec) {
    // Title
    const h1 = mediaDetailSec.querySelector('h1');
    if (h1) contentElements.push(h1);
    // Main content
    const contentWrapper = mediaDetailSec.querySelector('.mediaDetailTxtBox .container .content-wrapper');
    if (contentWrapper) {
      // Use all child nodes to preserve text, <br>, <center>, <strong>, <p>, etc.
      contentWrapper.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '') {
          // skip empty text nodes
          return;
        }
        contentElements.push(node);
      });
    }
  }
  const contentRow = [contentElements.length > 0 ? contentElements : ''];

  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
