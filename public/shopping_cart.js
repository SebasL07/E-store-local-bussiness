let total = 0;

async function pay() {
    const response = await fetch('/api/shopping_list');
    const products = await response.json();
    const productNames = products.map(p => p.name).join(", \n");
    window.alert(productNames);
}

window.onload = async () => {
    const shopping_list = await (await fetch("/api/shopping_list")).json();
    console.log(shopping_list);
    display_shopping_cart(shopping_list);
    calculateTotal(shopping_list);
}

function display_shopping_cart(productList) {
    let productsHTML = '';
    productList.forEach(element => {
        productsHTML +=
            `<tr>
                <td>1</td>
                <td>${element.name}</td>
                <td>$${element.price}</td>
            </tr>`;
    });
    document.getElementById('shopping-cart-table-content').innerHTML = productsHTML;
}

function calculateTotal(productList) {
    total = productList.reduce((sum, product) => sum + product.price, 0);
    document.getElementById('total').innerHTML = `Total: $${total}`;
}
