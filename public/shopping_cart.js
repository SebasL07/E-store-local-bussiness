let shopping_cart = {
    items: []
}

// Esta función realiza una solicitud POST a '/api/checkout' para procesar el pago
async function pay() {
    const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    // Si la respuesta es exitosa, se descarga la factura en formato PDF
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

        // Se limpia el carrito de compras en el frontend
        shopping_cart.items = [];
        display_shopping_cart([]);
        document.getElementById('total').innerHTML = 'Total: $0';
    } else {
        alert('Error al procesar el pago.');
    }
}

window.onload = async () => {

    // Cuando la página carga, se realiza una solicitud fetch a '/api/shopping_list'
    // para obtener los productos en el carrito de compras
    const shopping_list = await (await fetch("/api/shopping_list")).json();
    console.log(shopping_list);

    // Se muestra el carrito de compras en la página
    display_shopping_cart(shopping_list);

    // Se calcula el total del carrito de compras
    calculateTotal(shopping_list);
}

function display_shopping_cart(productList) {
    // Esta función recibe una lista de productos y los muestra en el carrito de compras

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
    // Esta función calcula el total del carrito de compras

    total = productList.reduce((sum, product) => sum + product.price, 0);
    document.getElementById('total').innerHTML = `Total: $${total}`;
}
