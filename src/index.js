////instalar modulo para desarrollo en node
/// npm i express express-handlebars express-session mysql express-mysql-session morgan bcryptjs passport passport-local timeago.js connect-flash express-validator
////Luego instalar nodemon
///npm i nodemon
////Luego crear carpetas
/// mkdir lib, public, routes, views
const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MysqlStore = require('express-mysql-session');
const passport = require('passport');

const { database } = require('./keys');

//inicializacion
const app = express();
require('./lib/passport');

//setting
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));//devuelve la direccion del archivo que se esta ejecutando
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');


//middlewares = se ejecutar cada que el usuario envia una peticion al servidor
app.use(session({
    secret: 'ricardoappmysqlnodesession',
    resave: false,
    saveUninitialized: false,
    store: new MysqlStore(database)
}))
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));// para poder aceptar los datos que envia el usuario
app.use(express.json());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//Global variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    console.log('xd');
    console.log(req.user);
    //console.log("usuario fullname " + req.user.fullname);
    app.locals.user = req.user;
    next();
});

//Routes
app.use(require('./routes/') );
app.use(require('./routes/autentication'));
app.use('/links',require('./routes/links'));

//Public 
app.use(express.static(path.join(__dirname, 'public')));


// const prices = [19.99, 4.95, 25, 3.50];
// let new_prices = [];

// for(let i=0; i < prices.length; i++) {
//    new_prices.push(prices[i] * 1.06);
// }
// console.log(new_prices);

// const prices = [19.99, 4.95, 25, 3.50];
// let new_prices = prices.map(price => price * 1.06);
// console.log(new_prices);

// const prices = [19.99, 4.95, 25, 3.50];
// let new_prices = prices.map((price) => {
//    return price * 1.06
// });
// console.log(new_prices);

///Inicializar el servidor
app.listen(app.get('port'), () => {
    console.log('Server on port ', app.get('port'));
});
