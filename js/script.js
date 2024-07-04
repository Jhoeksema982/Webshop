document.addEventListener('DOMContentLoaded', function () {
  const productContainer = document.getElementById('product-cards-container');
  productContainer.innerHTML = '';

  function fetchProductsFromJSON() {
      fetch('data/producten.json')
          .then(response => {
              if (!response.ok) {
                  throw new Error('Failed to fetch product data');
              }
              return response.json();
          })
          .then(data => {
              if (!localStorage.getItem('inventory')) {
                  localStorage.setItem('inventory', JSON.stringify(data));
              }
              displayProductsFromLocalStorage();
          })
          .catch(error => {
              console.error('Error fetching product data:', error);
          });
  }

  function displayProductsFromLocalStorage() {
      let products = JSON.parse(localStorage.getItem('inventory')) || [];

      products.forEach(product => {
          const card = document.createElement('div');
          card.classList.add('max-w-sm', 'rounded', 'overflow-hidden', 'shadow-lg', 'm-4');

          card.innerHTML = `
              <a href="product-detail.html?id=${product.id}" class="block">
                  <img class="w-96 h-96" src="${product.image}">
                  <div class="px-6 py-4">
                      <div class="font-bold text-xl mb-2">${product.name}</div>
                      <p class="text-gray-700 text-base">$${product.price}</p>
                  </div>
              </a>
              <div class="px-6 pt-4 pb-2 flex justify-start">
                  <button class="addToCartBtn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none"
                      data-id="${product.id}">
                      Add to Cart
                  </button>
              </div>
          `;

          productContainer.appendChild(card);

          const addToCartButton = card.querySelector('.addToCartBtn');
          addToCartButton.addEventListener('click', () => {
              addToCart(product);
          });
      });
  }

  function addToCart(product) {
      let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

      let existingItem = cartItems.find(item => item.id === product.id);

      if (existingItem) {
          existingItem.quantity++;
      } else {
          cartItems.push({
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: 1,
              image: product.image
          });
      }

      localStorage.setItem('cart', JSON.stringify(cartItems));

      Swal.fire({
          title: 'Added to Cart!',
          text: `${product.name} has been added to your cart.`,
          icon: 'success',
          confirmButtonText: 'Continue Shopping'
      });
  }

  fetchProductsFromJSON();
});
