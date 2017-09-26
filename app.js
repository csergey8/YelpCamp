var express = require('express');
var bodyPareser = require('body-parser');
var app = express();

var campgrounds = [
    {
        name: "Salmon Creek",
        image: "https://farm5.staticflickr.com/4423/37232133702_342e447ccb.jpg"
        },
    {
        name: "Granite Hill",
        image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg"
        },
    {
        name: "Mountian Goat's Rest",
        image: "https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg"
        },
    {
        name: "Granite Hill",
        image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg"
        },
    {
        name: "Mountian Goat's Rest",
        image: "https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg"
        },
    {
        name: "Granite Hill",
        image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg"
        },
    {
        name: "Mountian Goat's Rest",
        image: "https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg"
        }
    ];


app.use(bodyPareser.urlencoded({
    extended: true
}));

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('landing');
});

app.get('/campgrounds', function (req, res) {
    res.render('campgrounds', {
        campgrounds: campgrounds
    });
});

app.get('/campgrounds/new', function (req, res) {
    res.render('new');
});

app.post('/campgrounds', function (req, res) {
    var name = req.body.name;
    var imgUrl = req.body.url;
    campgrounds.push({
        name: name,
        image: imgUrl
    });
    res.redirect('/campgrounds');
});


app.listen(3000, '127.0.0.1');
