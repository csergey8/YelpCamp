var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var middleware = require('../middleware');

//ROOT route
router.get('/', function (req, res) {
    res.render('landing');
});

//SHOW REGISTER FORM
router.get('/register', function (req, res) {
    res.render('register');
});

// SIGN UP LOGIC
router.post('/register', function (req, res) {
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, function () {
            req.flash('success', 'Success! Welcome to YelpCamp');
            res.redirect('/');
        });
    });
});

//SHOW LOGIN FORM
router.get('/login', function (req, res) {
    res.render('login');
});

// LOGIN ROUTE
router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), function (req, res) {

});

// LOG-OUT ROUTE
router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success', 'Logged Out');
    res.redirect('/campgrounds');
});



module.exports = router;
