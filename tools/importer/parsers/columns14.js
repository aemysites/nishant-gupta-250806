/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Columns (columns14)'];

  // Find container and form
  const container = element.querySelector('.container.notranslate');
  if (!container) return;
  const form = container.querySelector('form');
  if (!form) return;

  // Find content images, excluding UI icons (like close buttons)
  const images = Array.from(element.querySelectorAll('img')).filter(img => {
    const src = img.getAttribute('src') || '';
    return src && !src.match(/close\.png$/i);
  });

  // --- Compose row 1: text/button | image ---
  const left1 = document.createElement('div');
  // Heading
  const heading = container.querySelector('h4');
  if (heading) left1.appendChild(heading);
  // All fields
  form.querySelectorAll('.inputFieldMain').forEach(div => left1.appendChild(div));
  // Desktop ENQUIRE NOW button
  const btnDesktop = form.querySelector('input.btnEnquireNow');
  if (btnDesktop) left1.appendChild(btnDesktop);

  // Right 1: content image or placeholder
  let right1;
  if (images[0]) {
    right1 = document.createElement('div');
    right1.appendChild(images[0]);
  } else {
    right1 = document.createElement('div'); // empty div as placeholder
  }

  // --- Compose row 2: image | agreement/checkbox/button ---
  let left2;
  if (images[1]) {
    left2 = document.createElement('div');
    left2.appendChild(images[1]);
  } else {
    left2 = document.createElement('div'); // empty div as placeholder
  }

  const right2 = document.createElement('div');
  const agreebox = form.querySelector('.agreebox');
  if (agreebox) right2.appendChild(agreebox);
  // Mobile ENQUIRE NOW button if present and not already used
  const btnMobile = Array.from(form.querySelectorAll('input.btnEnquireNow')).find(btn =>
    btn.classList.contains('d-block') && btn !== btnDesktop
  );
  if (btnMobile) right2.appendChild(btnMobile);

  // Compose the table structure as required (even if images are missing, keep cell structure)
  const cells = [
    headerRow,
    [left1, right1],
    [left2, right2]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
