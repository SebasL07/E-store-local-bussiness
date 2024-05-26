const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

let products = [
    {
        id: 1,
        description: "Guayos adidas edición CR7",
        name: "Guayos adidas",
        price: 50,
        image: "resources/product-1.jpg",
        stock: 50
    }
];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname) + '/public/login.html');
});

app.get('/api/products', (req, res) => {
    res.send(products);
});

app.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname) + '/public/products.html');
});

app.get('/add-product', (req, res) => {
    res.sendFile(path.join(__dirname) + '/public/add_product.html');
});

app.post('/api/products', (req, res) => {
    const newProduct = {
        id: products.length + 1,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: req.body.image,
        stock: req.body.stock
    };
    products.push(newProduct);
    res.send(newProduct);
});

app.listen(3000, () => {
    console.log('Running');
});
