/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in example
  const headerRow = ['Cards (cards34)'];

  // Find all unique cards (skip .cloned to avoid duplicates)
  let items = [];
  const carousel = element.querySelector('.owl-carousel');
  if (carousel) {
    const stage = carousel.querySelector('.owl-stage');
    if (stage) {
      items = Array.from(stage.querySelectorAll('.owl-item'))
        .filter(it => !it.classList.contains('cloned'))
        .map(it => it.querySelector('.item'))
        .filter(Boolean);
    } else {
      items = Array.from(carousel.querySelectorAll('.item'));
    }
  } else {
    items = Array.from(element.querySelectorAll('.item'));
  }

  // Compose each card row
  const rows = items.map(item => {
    // IMAGE CELL
    let imgCell = '';
    const imgWrap = item.querySelector('.testimonialImg');
    if (imgWrap) {
      const img = imgWrap.querySelector('img');
      if (img) {
        let src = img.getAttribute('data-src') || img.getAttribute('src') || '';
        if (src && !src.startsWith('http')) src = 'https:' + src;
        img.src = src;
        imgCell = img;
      }
    }
    if (!imgCell) imgCell = '';

    // TEXT CELL: gather all content from .testimonialTxtSec
    const txtSec = item.querySelector('.testimonialTxtSec');
    let textCellContents = [];
    if (txtSec) {
      // h3 (course)
      const h3 = txtSec.querySelector('h3');
      if (h3) textCellContents.push(h3);
      // h4 (quote)
      const h4 = txtSec.querySelector('h4');
      if (h4) textCellContents.push(h4);
      // All <p> (description)
      const ps = Array.from(txtSec.querySelectorAll('p'));
      ps.forEach(p => {
        if (p.textContent.trim()) textCellContents.push(p);
      });
      // captionNameLocation (author/location), preserving formatting
      const cap = txtSec.querySelector('.captionNameLocation');
      if (cap) textCellContents.push(cap);
    } else {
      // Fallback: all text inside item
      if (item.textContent.trim()) textCellContents.push(document.createTextNode(item.textContent.trim()));
    }
    // If textCellContents is empty, leave blank, else use array
    const textCell = textCellContents.length > 0 ? textCellContents : '';

    return [imgCell, textCell];
  });

  // Only keep rows with some non-empty cell
  const filteredRows = rows.filter(row => {
    return row.some(cell => {
      if (typeof cell === 'string') {
        return cell.trim().length > 0;
      } else if (cell instanceof Element) {
        return cell.textContent && cell.textContent.trim().length > 0;
      } else if (Array.isArray(cell)) {
        // If any of the array's elements has text
        return cell.some(el => {
          if (typeof el === 'string') return el.trim().length > 0;
          if (el instanceof Element) return el.textContent && el.textContent.trim().length > 0;
          return false;
        });
      }
      return false;
    });
  });

  // Compose final table
  const cells = [headerRow, ...filteredRows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
