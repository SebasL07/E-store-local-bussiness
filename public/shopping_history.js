window.onload = async() =>{
    const shopping_history = await (await fetch('/api/purchase_history')).json;
    displayShoppingHistory(shopping_history);
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

    document.getElementById('shopping-history').innerHTML() = list;
}