const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('../passport');


router.get('/', (req, res, next) => {
    res.send('home');
});

router.get('/login', (req, res, next) => {
    if (req.user) return res.redirect('/');
    res.send('login');
});

router.post('login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login'
}));



module.exports = router;