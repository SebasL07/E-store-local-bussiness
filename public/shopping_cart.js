let shopping_cart = {
    items: []
}

async function pay() {
    const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'factura.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        alert('Compra realizada con éxito. Tu factura se está descargando.');

        // Clear the cart in the frontend
        shopping_cart.items = [];
        display_shopping_cart([]);
        document.getElementById('total').innerHTML = 'Total: $0';
    } else {
        alert('Error al procesar el pago.');
    }
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
