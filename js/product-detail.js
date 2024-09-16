document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  let products = JSON.parse(localStorage.getItem('inventory'));

  if (products) {
      displayProductDetail(productId, products);
  } else {
      fetchProductsFromJSON(productId);
  }
});

function fetchProductsFromJSON(productId) {
  fetch('data/producten.json')
      .then(response => {
          if (!response.ok) {
              throw new Error('Failed to fetch product data');
          }
          return response.json();
      })
      .then(data => {
          localStorage.setItem('inventory', JSON.stringify(data));

          displayProductDetail(productId, data);
      })
      .catch(error => {
          console.error('Error fetching product data:', error);
      });
}

function displayProductDetail(productId, products) {
  const product = products.find(item => item.id == productId);

  if (product) {
      const productDetailContainer = document.getElementById('product-detail');

      const productDetailHtml = `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex items-center justify-center">
                  <img src="${product.image}" alt="${product.name}" class="md:w-96 w-full max-h-80 md:max-h-96 rounded-lg">
              </div>
              <div class="flex flex-col justify-center md:pl-12">
                  <h2 class="text-2xl font-bold text-gray-800">${product.name}</h2>
                  <p class="text-xl text-red-600 font-bold mt-2">€${product.price.toFixed(2)}</p>
                  <p class="text-gray-600 mt-4">${product.description}</p>
                  <div class="mt-6">
                      <button id="addToCartBtn" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none">
                          Add to Cart
                      </button>
                  </div>
              </div>
          </div>
      `;

      productDetailContainer.innerHTML = productDetailHtml;

      const addToCartButton = document.getElementById('addToCartBtn');
      addToCartButton.addEventListener('click', () => {
          addToCart(product);
      });

  } else {
      console.error('Product not found');
  }
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
