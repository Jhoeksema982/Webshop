document.addEventListener('DOMContentLoaded', () => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');

    const gridContainer = document.createElement('div');
    gridContainer.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';

    const leftColumn = document.createElement('div');
    leftColumn.className = 'col-span-1';

    const rightColumn = document.createElement('div');
    rightColumn.className = 'col-span-1';

    function renderCartItems() {
        leftColumn.innerHTML = '';
        let subtotal = 0;
        let shippingCost = 0;

        if (cartItems.length === 0) {
            leftColumn.innerHTML = '<p>No items in cart</p>';
        } else {
            cartItems.forEach((item, index) => {
                const cartItemHtml = `
                    <div class="flex items-center justify-between border-b border-gray-300 py-2">
                        <div class="flex items-center">
                            <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg mr-4">
                            <div>
                                <h2 class="text-lg font-semibold">${item.name}</h2>
                                <p class="text-gray-600">Price: $${item.price}</p>
                                <p class="text-gray-600">Quantity: ${item.quantity}</p>
                            </div>
                        </div>
                        <div class="ml-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 cursor-pointer remove-item" data-index="${index}">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    </div>
                `;
                leftColumn.innerHTML += cartItemHtml;

                subtotal += item.price * item.quantity;
            });

            if (subtotal > 100) {
                shippingCost = 0;
            } else {
                shippingCost = 5;
            }
        }

        const totalPrice = subtotal + shippingCost;

        rightColumn.innerHTML = `
            <div class="bg-gray-200 p-4">
                <h2 class="text-xl font-semibold mb-2">Order Summary</h2>
                <p class="text-gray-700">Subtotal: $${subtotal.toFixed(2)}</p>
                <p class="text-gray-700">Shipping: $${shippingCost.toFixed(2)}</p>
                <hr class="my-2">
                <p class="text-gray-800 font-semibold">Total: $${totalPrice.toFixed(2)}</p>
                <button id="order-button" class="mt-4 w-64 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">Order</button>
            </div>
        `;

        leftColumn.querySelectorAll('.remove-item').forEach(svg => {
            svg.addEventListener('click', function () {
                const index = this.getAttribute('data-index');
                removeCartItem(index);
            });
        });
    }

    function removeCartItem(index) {
        cartItems.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cartItems));
        renderCartItems();
    }

    function placeOrder() {
        const orderId = new Date().getTime();

        const order = {
            id: orderId,
            items: cartItems,
            date: new Date().toLocaleDateString(),
            totalAmount: calculateTotalAmount()
        };

        let orderHistory = JSON.parse(localStorage.getItem('orders')) || [];

        orderHistory.push(order);

        localStorage.setItem('orders', JSON.stringify(orderHistory));

        cartItems.length = 0;
        localStorage.setItem('cart', JSON.stringify(cartItems));

        renderCartItems();

        Swal.fire({
            title: "Thank you for your purchase :)",
            width: 600,
            padding: "3em",
            icon: "success",
            backdrop: `
                rgba(0,0,123,0.4)
                url("https://media1.giphy.com/media/Hzdph9ISDR3e5q0UBy/giphy.gif?cid=6c09b952sngnr3h5tozmvouajinspfrike1k9t1o3noncr1w&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=s")
                left top
                no-repeat
            `,
            confirmButtonText: 'Go Back'
        }).then(() => {
            window.location.href = 'index.html';
        });
        
    }

    function calculateTotalAmount() {
        let subtotal = 0;

        cartItems.forEach(item => {
            subtotal += item.price * item.quantity;
        });

        let shippingCost = subtotal > 100 ? 0 : 5;
        return subtotal + shippingCost;
    }

    renderCartItems();

    gridContainer.appendChild(leftColumn);
    gridContainer.appendChild(rightColumn);
    cartItemsContainer.appendChild(gridContainer);

    const orderButton = document.getElementById('order-button');
    if (orderButton) {
        orderButton.addEventListener('click', placeOrder);
    }
});
