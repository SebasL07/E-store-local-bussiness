const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

const users = [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'cliente1', password: 'cliente1', role: 'cliente' },
    { username: 'cliente2', password: 'cliente2', role: 'cliente' }
];

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
// Middleware de autenticación
const authMiddleware = (req, res, next) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        req.user = user; // Guardar el usuario en la solicitud
        next(); // Continuar con la siguiente ruta
    } else {
        res.status(401).send('Credenciales inválidas');
    }
};

// Middleware de autorización
const authorizationMiddleware = (req, res, next) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (req.user.role === 'admin') {
        next(); // Continuar si el usuario es administrador
    } else {
        res.status(403).send('Acceso denegado');
    }
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname) + '/public/login.html');
});

app.get('/api/products', (req, res) => {
    res.send(products);
});

app.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname) + '/public/products.html');
});


app.get('/add-product', authMiddleware, authorizationMiddleware, (req, res) => {
    // Renderizar la vista de administrador
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


app.post('/', authMiddleware, (req, res) => {
    // Lógica después del inicio de sesión exitoso
    if (req.user.role === 'admin') {
        res.redirect('/add-product');
    } else {
        res.redirect('/products');
    }
});



app.listen(3000, () => {
    console.log('Running');
});
