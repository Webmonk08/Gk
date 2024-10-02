import { menuData } from "./Products.js";
// const stripLines = require('strip-lines');

var ids = 0
export function renderMenu() {
  const menuGrid = document.querySelector('.menu-grid');

  for (const [category, items] of Object.entries(menuData)) {
    const varietyDiv = document.createElement('div');
    varietyDiv.className = 'variety';
    varietyDiv.textContent = category.charAt(0).toUpperCase() + category.slice(1);

    const dishesDiv = document.createElement('div');
    dishesDiv.className = 'dishes';
    dishesDiv.id = category;
    dishesDiv.onclick = add;

    for (const [item, price] of Object.entries(items)) {
      const dishDiv = document.createElement('div');
      dishDiv.className = 'dish';
      dishDiv.innerHTML = `<span>${item}</span><span>${price} rs</span>`;
      dishDiv.addEventListener('click', () => add(e));
      dishesDiv.appendChild(dishDiv);
    }

    const itemsDiv = document.createElement('div');
    itemsDiv.className = `items${Object.keys(menuData).indexOf(category)}`;

    menuGrid.appendChild(varietyDiv);
    menuGrid.appendChild(dishesDiv);
    menuGrid.appendChild(itemsDiv);
  }
}


export function add(event) {
  event.stopPropagation();
  const dishElement = event.target.closest('.dish');
  if (!dishElement) return;

  const spans = dishElement.querySelectorAll('span');
  const dishName = spans[0].textContent;
  const dishPrice = spans[1].textContent;
  console.log(`Selected dish: ${dishName} - ${dishPrice}`);

  const parentElement = dishElement.closest('.dishes');
  const quantity = 1;
  // const itemid= document.getElementsByClassName('items')


  const itemElement = document.querySelector('.items');
  if (!itemElement.innerHTML.includes(dishName)) {
    const itemId = `item-${Date.now()}`;
    itemElement.style.height = "max-content";
    itemElement.innerHTML += `
                <div class="outer-container" id="${itemId}">
                    <span>${dishName}</span>
                    <span class="price">${parseFloat(dishPrice.replace('rs', '')).toFixed(2)}</span>
                    <span class="quantity">${quantity}</span>
                    <div class="item-actions">
                        <button onclick="changeQuantity('${itemId}')">Change</button>
                        <button onclick="removeItem('${itemId}')">Remove</button>
                    </div>
                </div>`;

    updateTotal(dishPrice);

  }
  else {
    ids += 1
  }
}

function updateTotal(price) {
  const priceValue = parseFloat(price.replace(' rs', ''));
  const totalElement = document.querySelector('.Total h1');
  let currentTotal = parseFloat(totalElement.textContent.replace('Total: ', '')) || 0;
  currentTotal += priceValue;
  totalElement.textContent = `Total: ${currentTotal.toFixed(2)} rs`;
}

export function changeQuantity(itemId) {
  const itemElement = document.getElementById(itemId);
  const quantityElement = itemElement.querySelector('.quantity');
  const priceElement = itemElement.querySelector('.price');
  const currentQuantity = parseInt(quantityElement.textContent);
  const unitPrice = parseFloat(priceElement.textContent) / currentQuantity;
  const newQuantity = prompt('Enter new quantity:', currentQuantity);

  if (newQuantity !== null && !isNaN(newQuantity) && newQuantity > 0) {
    const oldTotal = currentQuantity * unitPrice;
    const newTotal = parseInt(newQuantity) * unitPrice;

    quantityElement.textContent = newQuantity;

    const newPrice = (unitPrice * newQuantity).toFixed(2);
    priceElement.textContent = newPrice;

    updateTotalAfterChange(newTotal - oldTotal);

    console.log(`New price: ${newPrice} rs`);
  } else if (newQuantity !== null) {
    alert('Please enter a valid positive number for the quantity.');
  }
}

export function removeItem(itemId) {
  const itemElement = document.getElementById(itemId);
  const quantityElement = itemElement.querySelector('.quantity');
  const priceElement = itemElement.querySelector('.price');
  const quantity = parseInt(quantityElement.textContent);
  const price = parseFloat(priceElement.textContent);
  const totalToRemove = price; // price is already total for this item

  itemElement.remove();
  updateTotalAfterChange(-totalToRemove);
}

function updateTotalAfterChange(change) {
  const totalElement = document.querySelector('.Total h1');
  let currentTotal = parseFloat(totalElement.textContent.replace('Total: ', '')) || 0;
  currentTotal += change;
  totalElement.textContent = `Total: ${currentTotal.toFixed(2)} rs`;
}

export function printOrder() {
  const itemsContainers = document.querySelectorAll('[class^="items"]');
  let orderSummary = "Order Summary:\n\n";
  let total = 0;

  itemsContainers.forEach(container => {
    const items = container.querySelectorAll('.outer-container');
    items.forEach(item => {
      const name = item.querySelector('span:first-child').textContent;
      const price = parseFloat(item.querySelector('.price').textContent);
      const quantity = parseInt(item.querySelector('.quantity').textContent);
      const itemTotal = price * quantity;
      orderSummary += `${name} x${quantity} - ${itemTotal.toFixed(2)} rs\n`;
      total += itemTotal;
    });
  });

  orderSummary += `\nTotal: ${total.toFixed(2)} rs`;

  const container = document.querySelector('.order-summary');
  container.innerHTML = ''; // Clear previous content
  const lines = orderSummary.split('\n');
  container.innerHTML+=`<h1 id="heading">GK Kitchens</h1>`;
  lines.forEach((line) => {
    if (line.trim() !== '') {
      if (!line.includes('Total')) {
        const h1 = document.createElement('h1');
        h1.textContent = line;
        container.appendChild(h1);
      }
      else {
        const span = document.createElement('span');
        span.textContent = "--------------------------------------------------------------";
        container.appendChild(span);
        const h1 = document.createElement('h1');
        h1.textContent = line;
        container.appendChild(h1);
        const span1 = document.createElement('span');
        span1.textContent = "--------------------------------------------------------------";
        container.appendChild(span1);
      }
      container.innerHTML+=`<h1 id="footer">Powered By InternZo</h1>`

        
    }
  });

  print();
  console.log(orderSummary);
}













