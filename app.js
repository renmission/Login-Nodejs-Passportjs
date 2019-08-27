const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const morgan = require('morgan');
const ejs = require('ejs');
const engine = require('ejs-mate');
const User = require('./models/User');


const MongoStore = require('connect-mongo')(session);
const passport = require('passport');

require('./passport');

const app = express();

const { dbUrl } = require('./config/database');
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true
}, err => {
    if (err) return err;
    console.log('Db Connected');
});

// middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, '/public')));

app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(session({
    secret: 'HelloLogin',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
    store: new MongoStore({ url: dbUrl, autoReconnect: true })
}));

// init Routes
// app.use('/', require('./routes/index'));

app.get('/', (req, res, next) => {
    res.render('home');
});

app.get('/login', (req, res, next) => {
    if (req.user) return res.redirect('/');
    res.render('login');
});

app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login'
}));

app.get('/profile', (req, res) => {
    res.render('profile');
});

// app.post('/create-user', (req, res) => {
//     const user = new User();
//     user.email = req.body.email;
//     user.password = req.body.password;
//     user.save(err => {
//         if (err) return err;
//         res.json(user);
//     })
// });


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Server started on port ${PORT}`) });