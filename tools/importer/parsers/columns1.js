/* global WebImporter */
export default function parse(element, { document }) {
  // Get the left (main article) content: we want only the main article section, not the full column container
  const leftCol = element.querySelector('.col-lg-8.col-md-12');
  let mainContent = null;
  if (leftCol) {
    mainContent = leftCol.querySelector('.mediaDetailSec');
  }

  // Get the right (sidebar) content: only the main sidebar content area excluding unrelated content if any
  const rightCol = element.querySelector('.col-lg-4.col-md-12');
  let sidebarContent = null;
  if (rightCol) {
    // Only grab inside the sidebar the direct content blocks that are intended for the columns block
    // These are: mediaDetailList (related articles) and mediaRecentArticle (recent article)
    const sidebarParts = [];
    const mediaDetailList = rightCol.querySelector('.mediaDetailList');
    if (mediaDetailList) sidebarParts.push(mediaDetailList);
    const mediaRecentArticle = rightCol.querySelector('.mediaRecentArticle');
    if (mediaRecentArticle) sidebarParts.push(mediaRecentArticle);
    // If found, put both; otherwise, fallback to whole rightCol
    sidebarContent = sidebarParts.length ? sidebarParts : [rightCol];
  }

  // Prepare table cells as per example: header one cell, second row two cells (main and sidebar)
  const cells = [
    ['Columns (columns1)'],
    [mainContent, sidebarContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}