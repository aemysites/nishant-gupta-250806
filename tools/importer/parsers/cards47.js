/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel with the blog cards
  const slider = element.querySelector('.blogBannerSec .owl-carousel');
  if (!slider) return;

  // Select all .owl-item > .item (includes active and cloned)
  const owlItems = slider.querySelectorAll('.owl-item > .item');

  // To prevent duplicates (due to carousel clones), track card titles
  const seenTitles = new Set();
  const cells = [['Cards (cards47)']];

  owlItems.forEach(item => {
    const box = item.querySelector('.blogHomeBox');
    if (!box) return;

    // Get primary card image
    let image = null;
    const imgWrapper = box.querySelector('.blogHomeImg');
    if (imgWrapper) {
      const img = imgWrapper.querySelector('img');
      if (img) {
        // Prefer src, fallback to data-src
        if (!img.getAttribute('src') && img.getAttribute('data-src')) {
          img.setAttribute('src', img.getAttribute('data-src'));
        }
        image = img;
      }
    }

    // Get card content block (title, desc, CTA)
    const blogContent = box.querySelector('.blogContent');
    if (!blogContent) return;

    // Deduplicate based on h3 text (card title), or fallback to all content
    const h3 = blogContent.querySelector('h3');
    const cardTitle = h3 ? h3.textContent.trim() : blogContent.textContent.trim();
    if (seenTitles.has(cardTitle)) return;
    seenTitles.add(cardTitle);

    // Ensure all text and structure (title, summary, CTA) are included by referencing the whole content block
    cells.push([
      image,
      blogContent
    ]);
  });

  // Create and replace table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
