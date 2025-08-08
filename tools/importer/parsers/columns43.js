/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches example: Columns (columns43)
  const headerRow = ['Columns (columns43)'];

  // Source structure: left column contains heading, intro, list, actions; right column contains image.
  // Get container (should cover all content)
  const container = element.querySelector('.container') || element;

  // LEFT COLUMN (all text, lists, buttons)
  const leftColumn = document.createElement('div');
  leftColumn.style.display = 'flex';
  leftColumn.style.flexDirection = 'column';

  // Course Heading (keep heading level)
  const heading = container.querySelector('.courseHeading h2');
  if (heading) leftColumn.appendChild(heading);

  // Description paragraph
  const desc = container.querySelector('p');
  if (desc) leftColumn.appendChild(desc);

  // Features list (ul)
  const list = container.querySelector('.noSliderCourse ul');
  if (list) leftColumn.appendChild(list);

  // Course buttons (Explore Now, I AM INTERESTED)
  const buttons = container.querySelector('.courseSlideButton');
  if (buttons) leftColumn.appendChild(buttons);

  // RIGHT COLUMN (image)
  const rightColumn = document.createElement('div');
  const courseImgDiv = container.querySelector('.courseSecImg');
  if (courseImgDiv) {
    const img = courseImgDiv.querySelector('img');
    if (img) {
      rightColumn.appendChild(img);
    }
  }

  // If no image, don't push right column
  const contentRow = [leftColumn];
  if (rightColumn.childNodes.length > 0) {
    contentRow.push(rightColumn);
  }

  // Only create a Section Metadata table if example shows it (it does not in this case)
  // Compose final table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
