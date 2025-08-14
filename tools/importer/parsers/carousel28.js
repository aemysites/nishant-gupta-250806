/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main carousel element
  const carousel = element.querySelector('.owl-carousel');
  if (!carousel) return;

  // Get the carousel stage that contains the slides
  let stage = carousel.querySelector('.owl-stage');
  if (!stage) {
    const outer = carousel.querySelector('.owl-stage-outer');
    if (outer) stage = outer.querySelector('.owl-stage');
    if (!stage) return;
  }

  // Get all non-cloned slides (owl-item)
  const slides = Array.from(stage.children).filter(slide => {
    return slide.classList.contains('owl-item') && !slide.classList.contains('cloned');
  });

  // Prepare the header row exactly as in the example
  const rows = [['Carousel (carousel28)']];

  slides.forEach(slide => {
    const item = slide.querySelector('.item');
    if (!item) return;

    // -- IMAGE --
    let imageElem = null;
    const picture = item.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        if (!img.src && img.getAttribute('data-src')) {
          img.src = img.getAttribute('data-src');
        }
        imageElem = img;
      }
    } else {
      const img = item.querySelector('img');
      if (img) {
        if (!img.src && img.getAttribute('data-src')) {
          img.src = img.getAttribute('data-src');
        }
        imageElem = img;
      }
    }

    // -- TEXT CONTENT --
    // Try to get ALL content inside .carousel-caption .container, or .carousel-caption if .container is missing
    let textCell = null;
    const caption = item.querySelector('.carousel-caption');
    if (caption) {
      // Prefer .container, fallback to caption itself
      let container = caption.querySelector('.container') || caption;
      // Gather all nodes (including text nodes and elements)
      // Only include if there is meaningful (non-whitespace) content
      // The goal is to preserve all possible text, including <h3>, <span>, <br>, etc.
      const childNodes = Array.from(container.childNodes);
      const cellNodes = [];
      childNodes.forEach(node => {
        if (node.nodeType === 3 && node.textContent.trim().length > 0) {
          cellNodes.push(document.createTextNode(node.textContent));
        } else if (node.nodeType === 1) {
          cellNodes.push(node);
        }
      });
      if (cellNodes.length > 0) {
        textCell = cellNodes.length === 1 ? cellNodes[0] : cellNodes;
      }
    }

    // Only add the row if an image is present
    if (imageElem) {
      if (textCell) {
        rows.push([imageElem, textCell]);
      } else {
        rows.push([imageElem]);
      }
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
