/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Block header matches example (exact text, single column)
  const rows = [['Cards (cards47)']];

  // 2. Find the relevant carousel with cards
  const carousel = element.querySelector('.blogBannerSec .owl-carousel');
  if (!carousel) return;

  // 3. Find all visible cards (.owl-item.active .item)
  const items = Array.from(carousel.querySelectorAll('.owl-item.active .item'));
  if (!items.length) return;

  items.forEach(item => {
    // Find the main card container
    const box = item.querySelector('.blogHomeBox');
    if (!box) return;

    // --- IMAGE CELL ---
    let imgCell = '';
    const mainImg = box.querySelector('.blogHomeImg img');
    if (mainImg) {
      // Ensure src is set
      if (!mainImg.src && mainImg.dataset.src) {
        mainImg.src = mainImg.dataset.src;
      }
      imgCell = mainImg;
    } else {
      // Fallback to icon img
      const iconImg = box.querySelector('.blogIconTxt img');
      if (iconImg) {
        if (!iconImg.src && iconImg.dataset.src) {
          iconImg.src = iconImg.dataset.src;
        }
        imgCell = iconImg;
      }
    }

    // --- TEXT CELL ---
    // Compose a fragment so all related text is included
    const frag = document.createDocumentFragment();

    // 1. Title (blogTitleTxt)
    const titleBlock = box.querySelector('.blogTitleTxt');
    if (titleBlock) {
      // Use <strong> and preserve <br>
      const strong = document.createElement('strong');
      strong.innerHTML = titleBlock.innerHTML;
      frag.appendChild(strong);
      frag.appendChild(document.createElement('br'));
    }

    // 2. Heading (h3)
    const heading = box.querySelector('.blogContent h3');
    if (heading) {
      // Use <span style="font-weight:bold">
      const boldSpan = document.createElement('span');
      boldSpan.style.fontWeight = 'bold';
      boldSpan.textContent = heading.textContent.trim();
      frag.appendChild(boldSpan);
      frag.appendChild(document.createElement('br'));
    }

    // 3. Description (blogcontentSummary)
    const desc = box.querySelector('.blogcontentSummary');
    if (desc) {
      const descSpan = document.createElement('span');
      descSpan.textContent = desc.textContent.trim();
      frag.appendChild(descSpan);
      frag.appendChild(document.createElement('br'));
    }

    // 4. Call-to-action (blueButton > a)
    const cta = box.querySelector('.blueButton a');
    if (cta) {
      // Remove tracking attributes but keep live element
      cta.removeAttribute('onclick');
      frag.appendChild(cta);
    }

    // Edge case: If fragment is empty, fallback to all box text
    if (!frag.childNodes.length) {
      frag.appendChild(document.createTextNode(box.textContent.trim()));
    }

    // Remove trailing <br> if present
    while (frag.lastChild && frag.lastChild.nodeName === 'BR') {
      frag.removeChild(frag.lastChild);
    }

    // Add this card as a row: [imgCell, frag]
    rows.push([imgCell, frag]);
  });

  // 4. Create table and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
