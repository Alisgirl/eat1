function searchProducts(event) {
    event.preventDefault();
    let query = document.querySelector('.inp').value.toLowerCase();
    let productsList = document.querySelector('.items');
    productsList.innerHTML = '';

    getProducts().then(function (products) {
        products.forEach(function (product) {
            if (product.title.toLowerCase().includes(query)) {
                productsList.innerHTML += getCardHTML(product);
            }
        });

        let buyButtons = document.querySelectorAll('.product button');
        if (buyButtons) {
            buyButtons.forEach(function (button) {
                button.addEventListener('click', addToCart);
            });
        }
    });
}

let search = document.querySelector('.search');
if (search) {
    search.addEventListener('click', searchProducts);
}

function getCookieValue(cookieName) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(cookieName + '=')) {
            return cookie.substring(cookieName.length + 1);
        }
    }
    return '';
}

async function getProducts() {
    try {
        let response = await fetch("items.json");
        let products = await response.json();
        return products;
    } catch (error) {
        console.error('Error fetching items.json:', error);
        return [
            {title: "Cereal and fruit envelope", description: "Злакофруктовий конвертик", price: 150, image: "нат.jpg"},
            {title: "Baked crab in cheese sauce", description: "Запечений краб у сирному соусі", price: 100, image: "нат1.jpg"},
            {title: "Zavrian cookies", description: "Завріанське печиво", price: 200, image: "нат2.jpg"},
            {title: "Fried fish in mint sauce", description: "Смажена риба у м'ятному соусі", price: 80, image: "нат3.jpg"},
            {title: "Mushroom kebabs with cheese", description: "Грибні шашлички з сиром", price: 50, image: "нат4.jpg"}
        ];
    }
}

function getCardHTML(product) {
    let productData = JSON.stringify(product);
    return `
    <div class="product">
        <img src="/img/${product.image}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <p class="price">${product.price} грн</p>
        <button class="cart-btn" data-product='${productData}'>Купити</button>
    </div>
    `;
}

getProducts().then(function (products) {
    let productsList = document.querySelector('.items');
    if (productsList) {
        productsList.innerHTML = '';
        products.forEach(function (product) {
            productsList.innerHTML += getCardHTML(product);
        });
    }

    let buyButtons = document.querySelectorAll('.product button');
    if (buyButtons) {
        buyButtons.forEach(function (button) {
            button.addEventListener('click', addToCart);
        });
    }
});

const cartBtn = document.querySelector('.cart-btn-header');
if (cartBtn) {
    cartBtn.addEventListener("click", function () {
        window.location.assign('cart.html');
    });
}

class ShoppingCart {
    constructor() {
        this.items = {};
        this.cartElement = document.querySelector('#cart-items');
        this.cartCounter = document.querySelector('.cart-counter');
        this.loadCartFromCookies();
    }

    addItem(item) {
        if (this.items[item.title]) {
            this.items[item.title].quantity += 1;
        } else {
            this.items[item.title] = item;
            this.items[item.title].quantity = 1;
        }
        this.updateCounter();
        this.saveCartToCookies();
    }

    updateQuantity(itemTitle, newQuantity) {
        if (this.items[itemTitle]) {
            this.items[itemTitle].quantity = newQuantity;
            if (this.items[itemTitle].quantity <= 0) {
                delete this.items[itemTitle];
            }
            this.updateCounter();
            this.saveCartToCookies();
        }
    }

    updateCounter() {
        let count = 0;
        for (let key in this.items) {
            count += this.items[key].quantity;
        }
        if (this.cartCounter) {
            this.cartCounter.innerHTML = count;
        }
    }

    saveCartToCookies() {
        let cartJSON = JSON.stringify(this.items);
        document.cookie = `cart=${cartJSON}; max-age=${60 * 60 * 24 * 7}; path=/`;
    }

    loadCartFromCookies() {
        let cartCookie = getCookieValue('cart');
        if (cartCookie && cartCookie !== '') {
            this.items = JSON.parse(cartCookie);
            this.updateCounter();
        }
    }

    calculateTotal() {
        let total = 0;
        for (let key in this.items) {
            total += this.items[key].price * this.items[key].quantity;
        }
        return total;
    }
}

let cart = new ShoppingCart();

function addToCart(event) {
    const productData = event.target.getAttribute('data-product');
    const product = JSON.parse(productData);
    cart.addItem(product);
}