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


//Routes

app.get('/', function (req, res) {
    res.render('landing');
});

app.get('/campgrounds', function (req, res) {
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log('Some db error' + err)
        } else {
            res.render('campgrounds/index', {
                campgrounds: allCampgrounds
            });
        }
    });

});

app.get('/campgrounds/new', function (req, res) {
    res.render('campgrounds/new');
});

app.get('/campgrounds/:id', function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, found) {
        if (err) {
            //console.log("!!!!!ERRROR" + err);
        } else {
            console.log(found);
            res.render('campgrounds/show', {
                found: found
            });
        }
    });
});

app.post('/campgrounds', function (req, res) {
    var name = req.body.name;
    var imgUrl = req.body.url;
    var desc = req.body.description;

    Campground.create({
        name: name,
        image: imgUrl,
        description: desc
    }, function (err, newlyAdded) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    });

});

// COMMENT Routes 
//NEW Comment route
app.get('/campgrounds/:id/comments/new', isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err)
        } else {
            res.render('comments/new', {
                campground: campground
            });
        }
    });

});

//POST COMMENT Route
app.post('/campgrounds/:id/comments', isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});
//=====================================
//AUTH ROUTES

//SHOW REGISTER FORM
app.get('/register', function (req, res) {
    res.render('register');
});

// SIGN UP LOGIC
app.post('/register', function (req, res) {
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err + "!!!!!!");
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, function () {
            res.send('Succes');
        });
    });
});

//SHOW LOGIN FORM
app.get('/login', function (req, res) {
    res.render('login');
});

// LOGIN ROUTE
app.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), function (req, res) {

});

// LOG-OUT ROUTE
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};



//SERVER START LISTENING
app.listen(3000, '127.0.0.1');
