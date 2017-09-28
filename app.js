var express = require('express'),
    bodyPareser = require('body-parser'),
    mongoose = require('mongoose'),
    Campground = require('./models/campground'),
    seedDB = require('./seeds'),
    Comment = require('./models/comment'),
    app = express();

seedDB();
app.use(bodyPareser.urlencoded({
    extended: true
}));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

mongoose.connect('mongodb://127.0.0.1/data');


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
app.get('/campgrounds/:id/comments/new', function (req, res) {
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
app.post('/campgrounds/:id/comments', function (req, res) {
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


app.listen(3000, '127.0.0.1');
