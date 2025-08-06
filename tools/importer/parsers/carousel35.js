/* global WebImporter */
export default function parse(element, { document }) {
  // Get the carousel container
  const carousel = element.querySelector('.owl-carousel');
  if (!carousel) return;

  // Get all .owl-item children that are NOT .cloned
  const allItems = Array.from(carousel.querySelectorAll('.owl-item'));
  const seen = new Set(); // ensure we don't duplicate slides by image src
  const slides = [];
  for (const item of allItems) {
    if (item.classList.contains('cloned')) continue;
    const box = item.querySelector('.howGetLicenceBox');
    if (!box) continue;
    const img = box.querySelector('.howGetLicenceImg img');
    if (!img) continue;
    let src = img.getAttribute('src') || img.getAttribute('data-src') || '';
    if (src.startsWith('//')) src = 'https:' + src;
    if (seen.has(src)) continue;
    seen.add(src);
    slides.push(item);
  }
  // If no slides found, fallback to first 4 unique by src
  if (slides.length === 0) {
    for (const item of allItems) {
      const box = item.querySelector('.howGetLicenceBox');
      if (!box) continue;
      const img = box.querySelector('.howGetLicenceImg img');
      if (!img) continue;
      let src = img.getAttribute('src') || img.getAttribute('data-src') || '';
      if (src.startsWith('//')) src = 'https:' + src;
      if (seen.has(src)) continue;
      seen.add(src);
      slides.push(item);
      if (slides.length === 4) break;
    }
  }

  // Build table header
  const cells = [
    ['Carousel (carousel35)']
  ];

  slides.forEach(item => {
    const box = item.querySelector('.howGetLicenceBox');
    if (!box) return;

    // IMAGE CELL
    let imgEl = null;
    const imgWrap = box.querySelector('.howGetLicenceImg');
    if (imgWrap) {
      imgEl = imgWrap.querySelector('img');
      if (imgEl) {
        let src = imgEl.getAttribute('src') || imgEl.getAttribute('data-src') || '';
        if (src && src.startsWith('//')) src = 'https:' + src;
        if (src) imgEl.src = src;
      }
    }

    // CONTENT CELL
    // Instead of picking by class, grab ALL content inside howGetLicenceContent as a block, preserving all text
    let textCellContent = [];
    const contentWrap = box.querySelector('.howGetLicenceContent');
    if (contentWrap) {
      // Heading: use h2 for h3 (maintain semantic heading)
      const h3 = contentWrap.querySelector('h3');
      if (h3) {
        const h2 = document.createElement('h2');
        h2.innerHTML = h3.innerHTML;
        textCellContent.push(h2);
      }
      // For all other children except h3, include their content as paragraphs
      Array.from(contentWrap.childNodes).forEach(n => {
        if (n.nodeType === 1 && n.tagName.toLowerCase() === 'h3') return;
        if (n.nodeType === 3 && n.textContent.trim()) {
          // Text node that's not empty
          const p = document.createElement('p');
          p.textContent = n.textContent.trim();
          textCellContent.push(p);
        } else if (n.nodeType === 1 && n.textContent.trim()) {
          // For elements (div, p, etc.), preserve their innerHTML as a <p>
          const p = document.createElement('p');
          p.innerHTML = n.innerHTML;
          textCellContent.push(p);
        }
      });
    }
    // Add CTA
    const cta = box.querySelector('a.readMoreLink');
    if (cta && cta.href) {
      const a = document.createElement('a');
      a.href = cta.href;
      // Prefer span text, otherwise use textContent
      const span = cta.querySelector('span');
      a.textContent = span ? span.textContent.trim() : cta.textContent.trim();
      textCellContent.push(a);
    }
    cells.push([
      imgEl,
      textCellContent.length > 0 ? textCellContent : ''
    ]);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
