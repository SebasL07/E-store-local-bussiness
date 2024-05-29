let products = [];

function displayProducts(productList) {
    let productsHTML = '';
    productList.forEach(element => {
        productsHTML +=
            `<div class="product-container">
                <h3>${element.name}</h3>
                <img src="${element.image}" />
                <h3>Precio: $${element.price}</h3>
                <h6>${element.description}</h6>
                <h4>Cantidad disponible: ${element.stock}</h4>
                <button class="button-add" onclick="add(${element.id}, ${element.price})">Agregar</button>
            </div>`;
    });
    document.getElementById('page-content').innerHTML = productsHTML;
}

async function add(productId, price) {
    const response = await fetch('/api/shopping_list', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: productId })
    });

    if (response.ok) {
        const product = await response.json();
        total += price;
        document.getElementById("total").innerHTML = `$${total}`;
    }
}

window.onload = async () => {
    const productList = await (await fetch("/api/products")).json();
    console.log(productList);
    displayProducts(productList);
}

document.getElementById('product-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value
    const price = document.getElementById('price').value;
    const image = document.getElementById('image').value;
    const stock = document.getElementById('stock').value;

    const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            description: description,
            price: price,
            image: image,
            stock: stock
        })
    });

    // Limpiar los campos del formulario
    document.getElementById('name').value = '';
    document.getElementById('description').value = '';
    document.getElementById('price').value = '';
    document.getElementById('image').value = '';
    document.getElementById('stock').value = '';

    window.location.href = '/products';
});


