// ================================
// SHOPPING CART
// ================================

let cart = JSON.parse(localStorage.getItem("auracart-cart") || "[]");


// Add product to cart
function addToCart(productName, price) {

    const existingProduct = cart.find(
        item => item.name === productName
    );

    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });

    }

    updateCart();

    showToast(productName + " added to your bag");
}


// ================================
// UPDATE CART
// ================================

function updateCart() {

    localStorage.setItem("auracart-cart", JSON.stringify(cart));

    updateCartCount();

    displayCart();

    calculateTotal();
}


// ================================
// CART COUNT
// ================================

function updateCartCount() {

    const cartCount =
        document.getElementById("cart-count");

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartCount.textContent = totalItems;
}


// ================================
// DISPLAY CART
// ================================

function displayCart() {

    const cartItems =
        document.getElementById("cart-items");

    if (cart.length === 0) {

        cartItems.innerHTML =
            '<p class="empty-cart">Your cart is empty.</p>';

        return;
    }


    cartItems.innerHTML = "";


    cart.forEach(function(item, index) {

        const cartItem =
            document.createElement("div");

        cartItem.className = "cart-item";


        cartItem.innerHTML = `

            <div class="cart-item-info">

                <h4>${item.name}</h4>

                <p>₹${item.price}</p>

            </div>


            <div class="quantity-controls">

                <button
                    onclick="decreaseQuantity(${index})">
                    −
                </button>

                <span>
                    ${item.quantity}
                </span>

                <button
                    onclick="increaseQuantity(${index})">
                    +
                </button>

            </div>


            <button
                class="remove-btn"
                onclick="removeFromCart(${index})">
                Remove
            </button>

        `;

        cartItems.appendChild(cartItem);

    });
}


// ================================
// INCREASE QUANTITY
// ================================

function increaseQuantity(index) {

    cart[index].quantity++;

    updateCart();
}


// ================================
// DECREASE QUANTITY
// ================================

function decreaseQuantity(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);

    }

    updateCart();
}


// ================================
// REMOVE PRODUCT
// ================================

function removeFromCart(index) {

    cart.splice(index, 1);

    updateCart();
}


// ================================
// CALCULATE TOTAL
// ================================

function calculateTotal() {

    const total =
        cart.reduce(
            (sum, item) =>
                sum + item.price * item.quantity,
            0
        );

    document.getElementById("cart-total")
        .textContent = total;
}


// ================================
// OPEN / CLOSE CART
// ================================

function toggleCart() {

    const cartPanel =
        document.getElementById("cart-panel");

    const isOpen = cartPanel.classList.toggle("active");
    cartPanel.setAttribute("aria-hidden", String(!isOpen));
    document.body.classList.toggle("cart-open", isOpen);
}


// ================================
// CHECKOUT
// ================================

function checkout() {

    if (cart.length === 0) {

        showToast("Your bag is empty");

        return;
    }

    showToast("Your bag is ready. Online checkout is coming soon.");
}


function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("visible");
    clearTimeout(showToast.timeout);
    showToast.timeout = setTimeout(() => toast.classList.remove("visible"), 2600);
}

const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const sortSelect = document.getElementById("sort");
const productGrid = document.querySelector(".product-grid");
const productCards = Array.from(document.querySelectorAll(".product-card"));

function filterProducts() {
    const query = searchInput.value.trim().toLowerCase();
    const category = categorySelect.value;
    const sort = sortSelect.value;
    const visibleProducts = productCards.filter((product) => {
        const matchesQuery = product.dataset.name.toLowerCase().includes(query);
        const matchesCategory = category === "all" || product.dataset.category === category;
        return matchesQuery && matchesCategory;
    });

    visibleProducts.sort((first, second) => {
        if (sort === "price-low" || sort === "price-high") {
            const difference = Number(first.dataset.price) - Number(second.dataset.price);
            return sort === "price-low" ? difference : -difference;
        }
        if (sort === "name") {
            return first.dataset.name.localeCompare(second.dataset.name);
        }
        return productCards.indexOf(first) - productCards.indexOf(second);
    });

    productCards.forEach((product) => {
        product.hidden = !visibleProducts.includes(product);
    });
    visibleProducts.forEach((product) => productGrid.appendChild(product));
    document.getElementById("results-count").textContent = `${visibleProducts.length} ${visibleProducts.length === 1 ? "piece" : "pieces"}`;
    document.getElementById("no-results").hidden = visibleProducts.length !== 0;
}

searchInput.addEventListener("input", filterProducts);
categorySelect.addEventListener("change", filterProducts);
sortSelect.addEventListener("change", filterProducts);
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.getElementById("cart-panel").classList.contains("active")) {
        toggleCart();
    }
});

filterProducts();
updateCart();