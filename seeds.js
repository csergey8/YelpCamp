var mongoose = require('mongoose');
var Campground = require('./models/campground');

var data = [
    {
        name: "Cloud's rest",
        image: "https://www.campsitephotos.com/photo/camp/63420/Palisades_Bridge.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec diam lectus, commodo et pulvinar varius, aliquet at felis. Integer consectetur posuere placerat. Sed sodales eget magna sed bibendum. Donec ut dictum magna. Duis eleifend facilisis nibh, at suscipit orci semper eu. Etiam suscipit commodo ex, eget facilisis est gravida eu. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean eget turpis lacinia, ultrices sapien quis, facilisis justo. Vestibulum massa ipsum, cursus nec sagittis id, pellentesque pellentesque mi. Pellentesque malesuada pellentesque porta."
},
    {
        name: "Palisades Bridge",
        image: "https://www.campsitephotos.com/photo/camp/63420/Palisades_Bathroom.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec diam lectus, commodo et pulvinar varius, aliquet at felis. Integer consectetur posuere placerat. Sed sodales eget magna sed bibendum. Donec ut dictum magna. Duis eleifend facilisis nibh, at suscipit orci semper eu. Etiam suscipit commodo ex, eget facilisis est gravida eu. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean eget turpis lacinia, ultrices sapien quis, facilisis justo. Vestibulum massa ipsum, cursus nec sagittis id, pellentesque pellentesque mi. Pellentesque malesuada pellentesque porta."
    },
    {
        name: "Itasca State Park",
        image: "https://www.campsitephotos.com/photo/camp/64902/Itasca_State_Park_014.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec diam lectus, commodo et pulvinar varius, aliquet at felis. Integer consectetur posuere placerat. Sed sodales eget magna sed bibendum. Donec ut dictum magna. Duis eleifend facilisis nibh, at suscipit orci semper eu. Etiam suscipit commodo ex, eget facilisis est gravida eu. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean eget turpis lacinia, ultrices sapien quis, facilisis justo. Vestibulum massa ipsum, cursus nec sagittis id, pellentesque pellentesque mi. Pellentesque malesuada pellentesque porta."
    }
]

function seedDB() {
    //Remove all campgrounds
    Campground.remove({}, function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log('all campground removed');
            //add a few campgrounds
            data.forEach(function (seed) {
                Campground.create(seed, function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(data);
                        //create a comment
                    }
                });
            });
        }

    });



    //add a few comments

};

module.exports = seedDB;
