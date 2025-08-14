/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract a card row from a .blogRptSec block
  function extractCard(blogRptSec) {
    // 1. Image
    const img = blogRptSec.querySelector('.blogBanner img');

    // 2. Title (h3/h2), Description, and CTA in order
    const textSection = blogRptSec.querySelector('.blogTxtSec');
    const textContent = [];
    if (textSection) {
      // Title
      const title = textSection.querySelector('h3, h2');
      if (title) textContent.push(title);
      // Description
      const desc = textSection.querySelector('.blogcontentSummary, p');
      if (desc) textContent.push(desc);
      // CTA (link)
      // Prefer the direct .readMoreLink, but allow fallback to any <a> in .readNdateSec
      let cta = textSection.querySelector('.readNdateSec .readMoreLink');
      if (!cta) cta = textSection.querySelector('.readNdateSec a');
      if (cta) textContent.push(cta);
    }
    return [img, textContent];
  }

  // Find all .blogRptSec blocks under this element
  const blogRptSecs = element.querySelectorAll('.blogRptSec');
  // If there's nothing found, treat element as a single card section
  const cardRows = [];
  if (blogRptSecs.length > 0) {
    blogRptSecs.forEach((blogRptSec) => {
      cardRows.push(extractCard(blogRptSec));
    });
  } else {
    cardRows.push(extractCard(element));
  }

  // Compose the final table: header + card rows
  const cells = [
    ['Cards (cards39)'],
    ...cardRows
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
