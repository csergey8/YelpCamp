var express = require('express'),
    bodyPareser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    session = require('express-session'),
    LocalStrategy = require('passport-local'),
    Campground = require('./models/campground'),
    seedDB = require('./seeds'),
    Comment = require('./models/comment'),
    User = require('./models/user'),
    app = express();

var commentRoutes = require('./routes/comments');
var campgroundRoutes = require('./routes/campgrounds');
var indexRoutes = require('./routes/index');


app.use(bodyPareser.urlencoded({
    extended: true
}));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));


mongoose.connect('mongodb://127.0.0.1/data');

seedDB();

//PASSPORT CONFIG 

app.use(require('express-session')({
    secret: "Here secret for encrypt",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

//Routes

// COMMENT Routes 
//NEW Comment route

//=====================================
//AUTH ROUTES



//SERVER START LISTENING
app.listen(3000, '127.0.0.1');
