//-------------------------------------------------------------------------------IMPORTS AND CONFIG------------------------------------------------------------------------------------------------------------------
const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
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
const users = [
    { id: 1, username: 'admin', password: 'adminpass', role: 'admin' },
    { id: 2, username: 'client', password: 'clientpass', role: 'client' }
];

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
passport.use(new LocalStrategy((username, password, done) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        return done(null, user);
    } else {
        return done(null, false, { message: 'Incorrect username or password.' });
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    done(null, user);
});

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

// Middleware to check admin role
function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    res.status(403).send('NO TIENES LOS PERMISOS SUFICIENTES PARA ACCEDER A ESTE SITIO');
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------/

//-------------------------------------------------------------------------------LOGIN-LOGOUT-REGISTER------------------------------------------------------------------------------------------------------------------

app.post('/login', passport.authenticate('local', {
    successRedirect: '/products',
    failureRedirect: '/'
}));

app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname) + '/public/login.html');
});

app.get('/api/users', (req, res) => {
    res.send(users);
});

app.get('/registerUser', (req, res) => {
    res.sendFile(path.join(__dirname) + '/public/register_user.html');
});


app.post('/api/users', (req, res) => {
    const newUser = {
        id: users.length + 1,
        username: req.body.username,
        password: req.body.password,
        role: 'client'
    };
    users.push(newUser);
    res.send(newUser);
});

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


//-------------------------------------------------------------------------------PRODUCTS------------------------------------------------------------------------------------------------------------------

app.get('/api/products', isAuthenticated, (req, res) => {
    res.send(products);
});

app.get('/products', isAuthenticated, (req, res) => {
    res.render('products', { user: req.user });
});

app.get('/add-product', isAdmin, (req, res) => {
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
    res.status(201).json(newUser);
});

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

console.log(users)

app.listen(3000, () => {
    console.log('Running');
});
