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

router.get('/new', isLoggedIn, function (req, res) {
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

router.post('/', isLoggedIn, function (req, res) {
    var name = req.body.name;
    var imgUrl = req.body.url;
    var desc = req.body.description;
    var author = {
        id: req.user.id,
        username: req.user.username
    }

    Campground.create({
        name: name,
        image: imgUrl,
        description: desc,
        author: author
    }, function (err, newlyAdded) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    });

});

// EDIT CAMPGROUD ROUTE
router.get('/:id/edit', checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render('campgrounds/edit', {
            campground: foundCampground
        });


    });
});

// UPDATE CAMPGROUND ROUTE

router.put('/:id', checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground,
        function (err, updatedCampground) {
            if (err) {
                res.redirect('/campgrounds');
            } else {
                res.redirect('/campgrounds/' + req.params.id);
            }
        })
});

// DELETE CAMPGROUD ROUTE

router.delete('/:id', checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect('/capgrounds/' + req.params.id);
        } else {
            res.redirect('/campgrounds');
        }
    });
});

function checkCampgroundOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                res.redirect('back');
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect('back');
                }

            }

        });

    } else {
        res.redirect('/login');
    }

};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

module.exports = router;
