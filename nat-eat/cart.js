let cart_list = document.querySelector('.itemscard');
let orderBtn = document.querySelector("#orderBtn");
let cart_total = document.querySelector("#cart_total");

if (typeof cart === 'undefined') {
    console.error('Cart is not defined. Ensure mon-eat.js is loaded before cart.js.');
    let cart = new ShoppingCart();
}

function get_item(item) {
    return `
    <div class="product">
        <img src="/img/${item.image}" alt="${item.title}">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <p class="price">${item.price} грн</p>
        <input type="number" data-item="${item.title}" value="${item.quantity}" min="0" style="width: 60px; border-radius: 5px; border: 2px solid #6B9794; padding: 5px;">
    </div>
    `;
}

function showCartList() {
    cart_list.innerHTML = '';
    for (let key in cart.items) {
        cart_list.innerHTML += get_item(cart.items[key]);
    }
    if (cart_total) {
        cart_total.innerHTML = cart.calculateTotal().toFixed(2) + ' грн';
    }
}

showCartList();

cart_list.addEventListener('change', (event) => {
    let target = event.target;
    if (target.tagName === 'INPUT' && target.type === 'number') {
        const itemTitle = target.getAttribute('data-item');
        const newQuantity = parseInt(target.value);
        if (!isNaN(newQuantity)) {
            cart.updateQuantity(itemTitle, newQuantity);
            showCartList();
        }
    }
});