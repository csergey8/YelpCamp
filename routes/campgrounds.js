var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');

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

router.get('/new', middleware.isLoggedIn, function (req, res) {
    req.flash('error', 'Please Login First');
    res.render('campgrounds/new');
});

router.get('/:id', function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, found) {
        if (err) {
            req.flash('error', 'Campground Not Found');

        } else {
            res.render('campgrounds/show', {
                found: found
            });
        }
    });
});

router.post('/', middleware.isLoggedIn, function (req, res) {
    var name = req.body.name;
    var imgUrl = req.body.url;
    var price = req.body.price;
    var desc = req.body.description;
    var author = {
        id: req.user.id,
        username: req.user.username
    }

    Campground.create({
        name: name,
        image: imgUrl,
        price: price,
        description: desc,
        author: author
    }, function (err, newlyAdded) {
        if (err) {
            req.flash('error', 'Something was wrong');
        } else {
            res.redirect('/campgrounds');
        }
    });

});

// EDIT CAMPGROUD ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            req.flash('error', 'Cant edit');
            res.redirect('campground/' + req.params.id)

        }
        res.render('campgrounds/edit', {
            campground: foundCampground
        });


    });
});

// UPDATE CAMPGROUND ROUTE

router.put('/:id', middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground,
        function (err, updatedCampground) {
            if (err) {
                req.flash('error', 'Something was wrong');
                res.redirect('/campgrounds');
            } else {
                res.redirect('/campgrounds/' + req.params.id);
            }
        })
});

// DELETE CAMPGROUD ROUTE

router.delete('/:id', middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            req.flash('error', 'Something was wrong');
            res.redirect('/capgrounds/' + req.params.id);
        } else {
            res.redirect('/campgrounds');
        }
    });
});





module.exports = router;
