document.addEventListener('DOMContentLoaded', function () {
    const ordersLink = document.querySelector('a[data-page="orders"]');
    const productsLink = document.querySelector('a[data-page="products"]');
    const viewLink = document.querySelector('a[data-page="view-products"]');
    const resetProductsButton = document.getElementById('reset-products');

    const ordersPage = document.getElementById('orders');
    const productsPage = document.getElementById('products');
    const viewPage = document.getElementById('view-products');

    showPage('orders');

    ordersLink.addEventListener('click', function () {
        showPage('orders');
        fetchOrdersFromLocalStorage();
    });

    productsLink.addEventListener('click', function () {
        showPage('products');
        fetchProductsFromLocalStorage();
    });

    viewLink.addEventListener('click', function () {
        showPage('view-products');
        fetchProductsFromLocalStorage();
    });

    resetProductsButton.addEventListener('click', function () {
        fetchInitialInventoryFromJSON();
    });

    const addProductForm = document.getElementById('add-product-form');

    addProductForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const productName = document.getElementById('product-name').value;
        const productPrice = parseFloat(document.getElementById('product-price').value);
        const productImage = document.getElementById('product-image').value;
        const productDescription = document.getElementById('product-description').value;

        const newProduct = {
            id: generateUniqueProductId(),
            name: productName,
            price: productPrice,
            image: productImage,
            description: productDescription
        };

        let products = JSON.parse(localStorage.getItem('inventory')) || [];

        products.push(newProduct);

        localStorage.setItem('inventory', JSON.stringify(products));

        addProductForm.reset();

        fetchProductsFromLocalStorage();
    });

    function generateUniqueProductId() {
        let products = JSON.parse(localStorage.getItem('inventory')) || [];
        let id;
        let idExists = true;
    
        while (idExists) {
            id = Math.floor(Math.random() * 100); // Generate a random ID between 0 and 99
            idExists = products.some(product => product.id === id); // Check if ID already exists
        }
    
        return id;
    }

    function showPage(page) {
        ordersPage.classList.add('hidden');
        productsPage.classList.add('hidden');
        viewPage.classList.add('hidden');

        switch (page) {
            case 'orders':
                ordersPage.classList.remove('hidden');
                break;
            case 'products':
                productsPage.classList.remove('hidden');
                break;
            case 'view-products':
                viewPage.classList.remove('hidden');
                break;
        }
    }

    function fetchOrdersFromLocalStorage() {
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        displayOrders(orders);
    }

    function displayOrders(orders) {
        const ordersContainer = document.getElementById('orders-container');
        ordersContainer.innerHTML = '';

        orders.forEach(order => {
            const orderElement = document.createElement('div');
            orderElement.classList.add('border', 'rounded', 'p-3', 'mb-3');

            const formattedDate = order.date;

            const itemsList = order.items.map(item => `
                <li>${item.quantity} x ${item.name} - $${item.price.toFixed(2)}</li>
            `).join('');

            orderElement.innerHTML = `
                <p><strong>Order ID:</strong> ${order.id}</p>
                <p><strong>Date:</strong> ${formattedDate}</p>
                <ul><strong>Items:</strong> ${itemsList}</ul>
                <p><strong>Total Amount:</strong> $${order.totalAmount.toFixed(2)}</p>
            `;

            ordersContainer.appendChild(orderElement);
        });
    }

    function fetchProductsFromLocalStorage() {
        let products = JSON.parse(localStorage.getItem('inventory')) || [];
        displayProducts(products);
    }

    function displayProducts(products) {
        const productsContainer = document.getElementById('view-products-container');
        productsContainer.innerHTML = '';

        if (products.length === 0) {
            productsContainer.textContent = "No products available.";
        } else {
            products.forEach((product, index) => {
                const productCardContainer = document.createElement('div');
                productCardContainer.classList.add('product-card');

                const productCard = `
                    <div class="border-b border-gray-200 py-2 flex justify-center items-center">
                        <div class="w-full">
                            <p>ID: ${product.id}</p>
                            <p><strong>${product.name}</strong></p>
                            <p>${product.description}</p>
                            <p>€${parseFloat(product.price).toFixed(2)}</p>
                        </div>
                        <div>
                            <button class="px-3 py-1 bg-yellow-500 text-white rounded edit-button" data-id="${product.id}">Edit</button>
                            <button class="px-3 py-1 bg-red-600 text-white rounded delete-button" data-id="${product.id}">Delete</button>
                        </div>
                    </div>
                `;

                productCardContainer.innerHTML = productCard;
                productsContainer.appendChild(productCardContainer);

                const deleteButton = productCardContainer.querySelector(`button.delete-button[data-id="${product.id}"]`);
                deleteButton.addEventListener('click', function () {
                    let products = JSON.parse(localStorage.getItem('inventory')) || [];
                    products = products.filter(item => item.id !== product.id);
                    localStorage.setItem('inventory', JSON.stringify(products));

                    fetchProductsFromLocalStorage();
                });

                const editButton = productCardContainer.querySelector(`button.edit-button[data-id="${product.id}"]`);
                editButton.addEventListener('click', function () {
                    document.getElementById('edit-product-id').value = product.id;
                    document.getElementById('edit-product-name').value = product.name;
                    document.getElementById('edit-product-price').value = product.price;
                    document.getElementById('edit-product-image').value = product.image;
                    document.getElementById('edit-product-description').value = product.description;

                    document.getElementById('edit-product-form').classList.remove('hidden');
                });
            });
        }
    }

    function fetchInitialInventoryFromJSON() {
        fetch('data/producten.json')
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('inventory', JSON.stringify(data));
                fetchProductsFromLocalStorage();
            })
            .catch(error => {
                console.error('Error fetching initial inventory:', error);
            });
    }

    const editProductForm = document.getElementById('edit-product-form');

    editProductForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const productId = document.getElementById('edit-product-id').value;
        const productName = document.getElementById('edit-product-name').value;
        const productPrice = parseFloat(document.getElementById('edit-product-price').value);
        const productImage = document.getElementById('edit-product-image').value;
        const productDescription = document.getElementById('edit-product-description').value;

        let products = JSON.parse(localStorage.getItem('inventory')) || [];

        const productIndex = products.findIndex(product => product.id === parseInt(productId, 10));


        if (productIndex !== -1) {
            products[productIndex].name = productName;
            products[productIndex].price = productPrice;
            products[productIndex].image = productImage;
            products[productIndex].description = productDescription;

            localStorage.setItem('inventory', JSON.stringify(products));


        } else {
            console.error('Product not found for editing.');
        }
    });

});
