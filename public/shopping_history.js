window.onload = async () => {
    const shopping_history = await (await fetch("/api/shopping_history")).json();
    console.log(shopping_history);
    displayShoppingHistory(shopping_history);
    calculateTotal(shopping_history);
}

function displayShoppingHistory(history){
    let list = '';

    history.array.forEach(element => {
       list+=`
            <li>
                Fecha: ${element.date.toLocaleString()}
            </li>
       ` 
    });

    document.getElementById('shopping-history').innerHTML = list;
}