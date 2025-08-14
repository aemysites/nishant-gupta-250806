/* global WebImporter */
export default function parse(element, { document }) {
  // Get the inner form container
  const container = element.querySelector('.container.notranslate');
  if (!container) return;
  const form = container.querySelector('form');
  if (!form) return;

  // Gather the main input fields (Name, Mobile, Email, City, Dealer)
  const inputFields = Array.from(form.querySelectorAll('.inputFieldMain'));
  // 1: Name
  const nameField = inputFields[0] || '';
  // 2: Mobile
  const mobileField = inputFields[1] || '';
  // 3: Email
  const emailField = inputFields[2] || '';
  // 4: City select
  let cityField = '';
  if (inputFields[3]) {
    const formItem = inputFields[3].querySelector('.form__item');
    cityField = formItem || inputFields[3];
  }
  // 5: Dealer select
  let dealerField = '';
  if (inputFields[4]) {
    const formItem = inputFields[4].querySelector('.form__item');
    dealerField = formItem || inputFields[4];
  }
  // 6: Enquire Now button (pick the first present for desktop)
  let enquireBtn = '';
  const btns = Array.from(form.querySelectorAll('input.btnEnquireNow[type="button"]'));
  if (btns.length) enquireBtn = btns[0];

  // Create the columns row
  const columnsRow = [nameField, mobileField, emailField, cityField, dealerField, enquireBtn];

  // Second row: agreebox left, close right, fill empty for columns
  const agreebox = form.querySelector('.agreebox') || '';
  const closeDiv = element.querySelector('.enquireClose') || '';
  const secondRow = [agreebox, '', '', '', '', closeDiv];

  // Only the header row should have a single cell
  const tableCells = [
    ['Columns (columns14)'],
    columnsRow,
    secondRow
  ];

  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(block);
}
