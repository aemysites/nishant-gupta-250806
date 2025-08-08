/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Cards (cards31)'];
  const rows = [headerRow];

  // Find the main carousel containing the cards
  const carousel = element.querySelector('.owlCommonEffect.mod-roadSafety .owl-carousel');
  if (!carousel) return;

  // Select unique, visible cards (skip .cloned), by using .owl-item.active (these are the main visible ones)
  const cardItems = carousel.querySelectorAll('.owl-item.active');

  cardItems.forEach((card) => {
    // Reference the container block for this card
    const imgTxt = card.querySelector('.roadSafetyImgTxt');
    if (!imgTxt) return;

    // Reference the img element itself, and ensure src is set
    let img = imgTxt.querySelector('img');
    if (img) {
      // Use data-src if src is missing
      if (!img.getAttribute('src') && img.getAttribute('data-src')) {
        img.setAttribute('src', img.getAttribute('data-src'));
      }
    }

    // Prepare text cell content: gather all element text, not just <span>
    // The markup example shows the label as a heading (bold), so treat all text as <strong> at minimum
    const textChunks = [];
    // Prefer span text, but if not, use all text nodes
    const span = imgTxt.querySelector('span');
    if (span && span.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = span.textContent.trim();
      textChunks.push(strong);
    }
    // If there is additional descriptive text (unlikely in this HTML, but for flexibility), include it
    Array.from(imgTxt.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        // If not already included, add it as a <span>
        const txt = node.textContent.trim();
        // Don't duplicate the label
        if (!span || txt !== span.textContent.trim()) {
          textChunks.push(document.createTextNode(txt));
        }
      }
    });
    // Fallback: If no <span>, just use all textContent as <strong>
    if (!span && imgTxt.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = imgTxt.textContent.trim();
      textChunks.push(strong);
    }
    // If nothing found, leave empty string
    const textCell = textChunks.length ? textChunks : '';

    rows.push([
      img || '',
      textCell
    ]);
  });

  // Create the table with block structure
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
