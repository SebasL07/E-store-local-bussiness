window.onload = async () => {
    // Cuando la página carga, se realiza una solicitud fetch a '/api/shopping_history'
    // para obtener el historial de compras del usuario
    const shopping_history = await (await fetch("/api/shopping_history")).json();
    console.log(shopping_history);
    // Se muestra el historial de compras en la página
    displayShoppingHistory(shopping_history);

    // Se calcula el total de todas las compras
    calculateTotal(shopping_history);
}

function displayShoppingHistory(history) {
    // Esta función recibe el historial de compras y lo muestra en la página

    let list = '';

    history.forEach(element => {
        list += `
            <li>
                Fecha: ${element.date.toLocaleString()}
                <ul>
                    ${element.items.map(item => `<li>${item.name} - $${item.price}</li>`).join('')}
                </ul>
                Total: $${element.total}
            </li>
       `
    });

    document.getElementById('shopping-history').innerHTML = list;
}