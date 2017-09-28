var express = require('express'),
    bodyPareser = require('body-parser'),
    mongoose = require('mongoose'),
    app = express();

app.use(bodyPareser.urlencoded({
    extended: true
}));

app.set('view engine', 'ejs');

mongoose.connect('mongodb://127.0.0.1/data');

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model('Campground', campgroundSchema);

//Routes

app.get('/', function (req, res) {
    res.render('landing');
});

app.get('/campgrounds', function (req, res) {
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log('Some db error' + err)
        } else {
            res.render('index', {
                campgrounds: allCampgrounds
            });
        }
    });

});

app.get('/campgrounds/new', function (req, res) {
    res.render('new');
});

app.get('/campgrounds/:id', function (req, res) {
    Campground.findById(req.params.id, function (err, found) {
        if (err) {
            //console.log("!!!!!ERRROR" + err);
        } else {
            console.log(found);
            res.render('show', {
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


app.listen(3000, '127.0.0.1');
