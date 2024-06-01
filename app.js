//-------------------------------------------------------------------------------IMPORTS AND CONFIG------------------------------------------------------------------------------------------------------------------
const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const LocalStrategy = require('passport-local').Strategy;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(session({ secret: 'alksdnqwoikdnaljlsnnkacs', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


//-------------------------------------------------------------------------------CREATED ELEMENTS------------------------------------------------------------------------------------------------------------------
// Array de usuarios
const users = [
    { id: 1, username: 'admin', password: 'adminpass', role: 'admin', purchaseHistory: [] },
    { id: 2, username: 'client', password: 'clientpass', role: 'client', purchaseHistory: [] }
];
// Array de productos
let products = [
    {
        id: 1,
        description: "Sombrero rojo redondeado",
        name: "Sombrero",
        price: 50,
        image: "https://dcdn.mitiendanube.com/stores/003/156/683/products/1f416b9764a0084c8b9156b4d89a3b9d-faface75292c698d1217150348644797-1024-1024.webp",
        stock: 50
    },
    {
        id: 2,
        description: "Gran abrigo de buena calidad",
        name: "Abrigo de manga larga",
        price: 20,
        image: "https://static.zara.net/assets/public/f314/cdc5/9dbb414e9f26/b7365d9dfd40/02531118800-016-p/02531118800-016-p.jpg?ts=1709199206424&w=563",
        stock: 10
    },
    {
        id: 3,
        description: "Color rojo",
        name: "Vestido",
        price: 11,
        image: "https://static.zara.net/assets/public/a4f2/ecfe/1553465d8324/a8c11aea3760/05919811600-1-p/05919811600-1-p.jpg?ts=1716553907414&w=563",
        stock: 5
    },
    {
        id: 4,
        description: "Blusa de escote pico con volantes y manga larga",
        name: "Blusa volantes",
        price: 25,
        image: "https://static.zara.net/assets/public/285a/02f7/d98f499580a0/54503ac8649a/03666077403-p/03666077403-p.jpg?ts=1716372279679&w=563",
        stock: 15
    },
    {
        id: 5,
        description: "Falda midi confeccionada en tejido satinado.",
        name: "Falda midi",
        price: 30,
        image: "https://static.zara.net/assets/public/6c24/a618/def3433686fa/d0237ecc7d96/08338501051-p/08338501051-p.jpg?ts=1716478199837&w=563",
        stock: 10
    },
    {
        id: 6,
        description: "Top corto de escote pico y tirantes finos con lazos.",
        name: "Top crop",
        price: 20,
        image: "https://static.zara.net/assets/public/82b6/8002/2e7c45419a9f/406f8d2aa76e/04331025712-p/04331025712-p.jpg?ts=1716378964082&w=563",
        stock: 50
    }
];
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


//-------------------------------------------------------------------------------PERMISSIONS------------------------------------------------------------------------------------------------------------------
// Estrategia de autenticación local con Passport.js
passport.use(new LocalStrategy((username, password, done) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        return done(null, user);
    } else {
        return done(null, false, { message: 'Incorrect username or password.' });
    }
}));

// Serialización y deserialización de usuario
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    done(null, user);
});

// Middleware para verificar si el usuario está autenticado
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

// Middleware para verificar si el usuario tiene rol de administrador
function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    res.status(403).send('NO TIENES LOS PERMISOS SUFICIENTES PARA ACCEDER A ESTE SITIO');
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------/

//-------------------------------------------------------------------------------LOGIN-LOGOUT-REGISTER------------------------------------------------------------------------------------------------------------------

// Ruta de inicio de sesión
app.post('/login', passport.authenticate('local', {
    successRedirect: '/products',
    failureRedirect: '/'
}));

// Ruta de cierre de sesión
app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

// Ruta de página de inicio
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/products');
    }
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Ruta para obtener los usuarios
app.get('/api/users', (req, res) => {
    res.send(users);
});

// Ruta de página de registro de usuario
app.get('/registerUser', (req, res) => {
    res.sendFile(path.join(__dirname) + '/public/register_user.html');
});

// Ruta para registrar un nuevo usuario
app.post('/api/users', (req, res) => {
    const newUser = {
        id: users.length + 1,
        username: req.body.username,
        password: req.body.password,
        role: 'client',
        purchaseHistory: []
    };
    users.push(newUser);
    res.send(newUser);
});

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


//-------------------------------------------------------------------------------PRODUCTS------------------------------------------------------------------------------------------------------------------

// Ruta para obtener los productos
app.get('/api/products', isAuthenticated, (req, res) => {
    res.send(products);
});

// Ruta de página de productos
app.get('/products', isAuthenticated, (req, res) => {
    res.render('products', { user: req.user });
});

// Ruta de página para agregar un producto
app.get('/add-product', isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname) + '/public/add_product.html');
});

// Ruta para agregar un nuevo producto
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
    res.status(201).json(newProduct);
});

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------SHOPPING-CART AND PURCHASE HISTORY------------------------------------------------------------------------------------------------------------------

// Ruta para renderizar la página del carrito de compras
app.get('/shopping-cart', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'shopping_cart.html'));
});

// Ruta para obtener los productos en el carrito de compras de la sesión actual
app.get('/api/shopping_list', isAuthenticated, (req, res) => {
    if (!req.session.shopping_list) {
        req.session.shopping_list = [];
    }
    res.send(req.session.shopping_list);
});

// Ruta para agregar un producto al carrito de compras en la sesión actual
app.post('/api/shopping_list', isAuthenticated, (req, res) => {
    if (!req.session.shopping_list) {
        req.session.shopping_list = [];
    }
    const product = products.find(p => p.id === req.body.id);
    if (product) {
        req.session.shopping_list.push(product);
        res.status(201).json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }


});

// Ruta para procesar el pago y generar una factura en formato PDF
app.post('/api/checkout', isAuthenticated, (req, res) => {
    const shoppingList = req.session.shopping_list || [];
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();
    let filename = `factura-${Date.now()}.pdf`;

    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');

    doc.text('Factura de compra', { align: 'center' });
    doc.moveDown();
    let total = 0;
    shoppingList.forEach((item, index) => {
        doc.text(`${index + 1}. ${item.name} - $${item.price}`);
        total += item.price;
    });

    doc.moveDown();
    doc.text(`Total: $${total}`, { align: 'right' });

    doc.pipe(res);
    doc.end();

    const user = users.find(u => u.id === req.user.id);
    if (user) {
        user.purchaseHistory.push({
            date: new Date(),
            items: shoppingList,
            total: total
        });
    }

    // Limpiar el carrito de compras
    req.session.shopping_list = [];
});

// Ruta para renderizar la página del historial de compras
app.get('/shopping-history', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'shopping_history.html'));
})

// Ruta para obtener el historial de compras del usuario autenticado
app.get('/api/shopping_history', isAuthenticated, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (user) {
        res.send(req.user.purchaseHistory);
    } else {
        res.status(404).send({ message: 'Usuario no encontrado' });
    }
});



//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


console.log(users)

app.listen(3000, () => {
    console.log('Running');
});
