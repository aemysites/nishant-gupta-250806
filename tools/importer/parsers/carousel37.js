/* global WebImporter */
export default function parse(element, { document }) {
  // Find the owl-carousel container
  const carousel = element.querySelector('.owl-carousel');
  if (!carousel) return;

  // Get all "owl-item" elements that are NOT .cloned
  const allItems = carousel.querySelectorAll('.owl-item');
  const slides = [];
  allItems.forEach(item => {
    if (!item.classList.contains('cloned')) {
      const itemInner = item.querySelector('.item');
      if (itemInner) slides.push(itemInner);
    }
  });
  if (!slides.length) return;

  // Table header row (exact match to example)
  const rows = [['Carousel (carousel37)']];

  // Create one row for each slide
  slides.forEach(slide => {
    // First cell: the image (mandatory)
    let imgEl = null;
    const imgContainer = slide.querySelector('.blogHomeImg');
    if (imgContainer) {
      const img = imgContainer.querySelector('img');
      if (img) {
        // Make sure the 'src' is set (prefer 'src', fallback to 'data-src')
        if (!img.getAttribute('src')) {
          const dataSrc = img.getAttribute('data-src');
          if (dataSrc) {
            img.setAttribute('src', dataSrc.startsWith('//') ? 'https:' + dataSrc : dataSrc);
          }
        }
        imgEl = img;
      }
    }
    // Second cell: all content from .blogContent (heading, description, link, etc), preserving order and referencing nodes
    let textCellContent = '';
    const blogContent = slide.querySelector('.blogContent');
    if (blogContent) {
      // Collect all meaningful (not whitespace) child nodes
      const children = Array.from(blogContent.childNodes).filter(n => {
        if (n.nodeType === Node.TEXT_NODE) {
          return n.textContent.trim();
        }
        return true;
      });
      // Reference nodes directly so all text, links, and markup are included
      if (children.length > 0) {
        textCellContent = children;
      }
    }
    // Only add if image exists (mandatory)
    if (imgEl) {
      rows.push([
        imgEl,
        textCellContent && textCellContent.length ? textCellContent : ''
      ]);
    }
  });

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
