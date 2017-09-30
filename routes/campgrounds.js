var express = require('express');
var router = express.Router();
var Campground = require('../models/campground')
var Comment = require('../models/comment')


router.get('/', function (req, res) {
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log('Some db error' + err)
        } else {
            res.render('campgrounds/index', {
                campgrounds: allCampgrounds,
                currentUser: req.user
            });
        }
    });

});

router.get('/new', function (req, res) {
    res.render('campgrounds/new');
});

router.get('/:id', function (req, res) {
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

router.post('/', function (req, res) {
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

module.exports = router;
