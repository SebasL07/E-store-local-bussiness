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
        description: "Guayos adidas edición CR7",
        name: "Guayos adidas",
        price: 50,
        image: "resources/product-1.jpg",
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
    if (req.isAuthenticated()) {
        return res.redirect('/products');
    }
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
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
