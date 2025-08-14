/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to make absolute URLs for images
  function getAbsoluteUrl(url) {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('//')) return 'https:' + url;
    return url;
  }

  // Locate the main carousel
  const carousel = element.querySelector('.owl-carousel');
  if (!carousel) return;

  // Only the non-cloned slides (the example markdown only shows the main logical slides)
  const slides = Array.from(carousel.querySelectorAll('.owl-item'))
    .filter(item => !item.classList.contains('cloned'));

  // Prepare the table rows
  const rows = [['Carousel (carousel37)']];

  slides.forEach(item => {
    // .blogHomeBox contains both the image and text
    const blogBox = item.querySelector('.blogHomeBox');
    if (!blogBox) return;

    // FIRST cell: image
    let img = null;
    const imgContainer = blogBox.querySelector('.blogHomeImg');
    if (imgContainer) {
      img = imgContainer.querySelector('img');
      if (img) {
        // Fix the src so it is always present and absolute
        let src = img.getAttribute('src') || img.getAttribute('data-src');
        src = getAbsoluteUrl(src);
        img.setAttribute('src', src);
        img.removeAttribute('data-src');
      }
    }

    // SECOND cell: The ENTIRE .blogContent block, preserving all text and structure (reference existing element)
    let textCell = '';
    const content = blogBox.querySelector('.blogContent');
    if (content) {
      textCell = content; // reference the actual existing element
    }

    if (img) {
      rows.push([
        img,
        textCell
      ]);
    }
  });

  // Only build the table if we have at least one slide
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
