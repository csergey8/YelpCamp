var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

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
            req.flash('error', "User " +
                req.body.username + " is already exist");
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, function () {
            res.send('Succes');
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

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

module.exports = router;
