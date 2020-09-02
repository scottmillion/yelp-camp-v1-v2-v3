// setup express, body-parser
const express = require("express"),
  app = express(),
  bodyParser = require("body-parser");

// mongoose setup
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to DB!'))
  .catch(error => console.log(error.message));

// mongoose create Schema
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String

});

// mongoose give Schema and CRUD methods to Campground
// Campground.create(), Campground.find() Campground.remove(), etc.
const Campground = mongoose.model('Campground', campgroundSchema);

// use and set
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");



// Campground.create({
//   name: "Green Hills",
//   image: "https://images.unsplash.com/photo-1571863533956-01c88e79957e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80",
//   description: "Who needs blue or white or yellow? We got nothin' but green here."
// });

// routes
app.get("/", (req, res) => {
  res.render("landing");
});

// INDEX route **RESTful** - Display a list of all campgrounds
app.get("/campgrounds", (req, res) => {
  // Passing campgrounds array of objects from database to campgrounds.ejs view
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log("Oh no, 'find' error!");
      console.log(err);
    } else {
      res.render("index", { campgrounds: allCampgrounds });
    }
  });
});

// CREATE route **RESTful** - Add new campground to database
app.post("/campgrounds", (req, res) => {
  // get data from form and store it in an object
  // Note: req.body accessible b/c of body-parser
  const name = req.body.name;
  const image = req.body.image;
  const description = req.body.description;
  // good object destructuring example. { name: name, image: image }
  const newCampground = { name, image, description }

  // passing newCampground object to mongodb using mongoose syntax
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      // Redirect to campgrounds page. The default redirect is a GET request.
      res.redirect("/campgrounds");
    }
  });
});

// NEW route **RESTful** - Displays form to make a new campground
// NEW has to come before SHOW b/c order matters & /new triggers /:id condition
app.get("/campgrounds/new", (req, res) => {
  res.render("new");
});

// SHOW route **RESTful** - Shows detailed info about one campground
// SHOW has to come after NEW b/c order matters & /new triggers /:id condition
app.get("/campgrounds/:id", (req, res) => {
  //find the campground with provided ID
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      //render show template with that ID
      res.render("show", { campground: foundCampground });
    }
  });

});

// remember to change this when hosted off your local machine
app.listen(3000, (req, res) => {
  console.log("Server running on 3000, sir!");
});
