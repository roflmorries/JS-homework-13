let selectedProduct;

document.addEventListener("DOMContentLoaded", () => {
  showCategories(); 
});

document.querySelector(".categories").addEventListener("click", (event) => {
  if (
    event.target.tagName === "DIV" &&
    event.target.classList.contains("category")
  ) {
    const categoryId = event.target.getAttribute("data-id");

    document.querySelector(".products").setAttribute('data-category-id', categoryId);

    showProductsByCategory(categoryId);
  }
});

document.querySelector(".products").addEventListener("click", (event) => {
  if (
    event.target.tagName === "DIV" &&
    event.target.classList.contains("product")
  ) {
    const selectedCategoryId = event.target.parentNode.getAttribute('data-category-id');
    const productId = event.target.getAttribute('data-id');

    const selectedCategory = categories.find(category => category.id === selectedCategoryId);

    selectedProduct = selectedCategory.items.find(item => item.id === productId);
    showProductInfo(selectedProduct);
  }
});

function showCategories() {
  showEntities(".categories", "category", categories);
}

function showProductsByCategory(categoryId) {
  const myCategory = categories.find((category) => category.id === categoryId);
  const products = myCategory.items;
  showEntities(".products", "product", products);
}

function showEntities(
  parentSelector,
  elementClassName,
  entities
) {
  const parentElement = document.querySelector(parentSelector);
  parentElement.innerHTML = "";

  for (let entity of entities) {
    const element = document.createElement("div");
    element.textContent = entity.name;
    element.classList.add(elementClassName);
    element.setAttribute("data-id", entity.id);

    parentElement.appendChild(element);
  }
}


function showProductInfo(product) {
  if(!product) {
    return;
  }

  const parent = document.querySelector('.product_info');

  parent.innerHTML = `
    <h2>${product.name}</h2>
    <p>$${product.price}</p>
    <p>${product.description}</p>
  `;

  parent.innerHTML += generateLayout();
  slider(product.images);

  const buyBtn = document.createElement('button');
  buyBtn.type = 'button';
  buyBtn.textContent = 'Buy now!';
  buyBtn.classList.add('buy-btn');
  buyBtn.addEventListener('click', showOrderForm);

  parent.appendChild(buyBtn);
  

}

function showOrderForm() {
  document.querySelector('.order_form').classList.remove('hidden');
}

document.querySelector('#order-btn').addEventListener('click', () => {
  const client = {
    name: document.forms.order.name.value,
    phone: document.forms.order.phone.value,
    city: cities[document.forms.order.city.value],
  }

  const validationName = /^[A-ZА-Я][a-zа-я]{1,}$/;
  const validationPhoneNumber = /^(\+380|380|0)\d{9}$/;
  const orderForm = document.getElementById('order_form');

  if (!validationName.test(client.name) || !validationPhoneNumber.test(client.phone)) {
    const notification = document.getElementById('notification_form');

    orderForm.classList.add('invalid');
    notification.innerHTML = `
    <p>Ошибка! Форма заполнена неверно!</p>
    `;

    setTimeout(() => notification.innerHTML = '', 2000);
    setTimeout(() => orderForm.classList.remove('invalid'), 1000);

    console.log(client)
    return;
  }

  console.log(client)
  showNotification()
})

function showNotification() {
  const notification = document.querySelector('.notification');

    notification.textContent = `Congrats! You bought ${selectedProduct.name}`;
    notification.classList.remove('hidden');

    setTimeout(() => {
      notification.classList.add('hidden');
      document.querySelector('.order_form').classList.add('hidden');
    }, 3000);
}

document.querySelector('input[name="amount"]').addEventListener('change', event => {
  const newAmount = event.target.value;
  if (newAmount < 1) {
    event.target.value = 1;
    return;
  }
  const price = selectedProduct.price;
  document.getElementById('calculation').textContent = `$${newAmount * price}`
  console.log(newAmount * price)

})