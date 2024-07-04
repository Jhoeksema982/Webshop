document.addEventListener('DOMContentLoaded', () => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartBadge = document.getElementById('cart-badge');
    const cartItemCountElement = document.getElementById('cart-item-count');

    function updateCartBadge() {
        const cartItemCount = cartItems.length;
        cartItemCountElement.textContent = cartItemCount.toString();
        if (cartItemCount > 0) {
            cartBadge.classList.remove('hidden');
        } else {
            cartBadge.classList.add('hidden');
        }
    }

    updateCartBadge();

}); 