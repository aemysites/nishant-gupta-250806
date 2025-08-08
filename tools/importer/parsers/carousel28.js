/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get correct src for <img>
  function getImageElement(picture) {
    if (!picture) return '';
    const img = picture.querySelector('img');
    if (!img) return '';
    let src = img.getAttribute('src') || img.getAttribute('data-src') || '';
    if (src && src.startsWith('//')) src = 'https:' + src;
    if (src) img.setAttribute('src', src);
    return img;
  }

  const carousel = element.querySelector('.owl-carousel');
  if (!carousel) return;
  const owlStage = carousel.querySelector('.owl-stage');
  if (!owlStage) return;
  const slides = Array.from(owlStage.children).filter(
    slide => slide.classList.contains('owl-item') && !slide.classList.contains('cloned')
  );

  const cells = [["Carousel (carousel28)"]];

  slides.forEach((slide) => {
    const item = slide.querySelector(':scope > .item');
    if (!item) return;
    // IMAGE cell
    let imgEl = '';
    const picture = item.querySelector('picture');
    imgEl = getImageElement(picture);

    // TEXT cell: include .carousel-caption .container or, if missing, .carousel-caption, even if empty
    let textCell = '';
    let caption = item.querySelector('.carousel-caption');
    if (caption) {
      let contentRoot = caption.querySelector('.container') || caption;
      // Always include as the cell value, even if empty
      textCell = contentRoot;
    }
    cells.push([imgEl, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
