const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema , reviewSchema} = require("./schema.js");
const session = require("express-session");
const Review= require("./models/review.js");
const review = require("./models/review.js");
const listings = require("./routes/listing.js");
const { Session } = require("inspector");
// const reviews = require("./routes/review.js");



//new passport
// const passport = require("passport");
// const localStrategy = require("passport-local")
// const User = require("./models/user.js");



main().then(() => {
    console.log("Connected to DB");
}).catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
  }




app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname ,"/public")));



app.get("/", (req, res) => {
    res.send("Hi, I am root");
  });




  app.use("/listings" , listings);

  const validateListing = (req,res,next)=>{

    let {error} = listingSchema.validate(req.body);


    if(error){

      let errMsg = error.details.map((el) => el.message).join(",");


      throw new ExpressError(400 , errMsg);



    }


    else{

      next();
      }
  };


  const validateReview= (req,res,next)=>{

    let {error} = reviewSchema.validate(req.body);


    if(error){

      let errMsg = error.details.map((el) => el.message).join(",");


      throw new ExpressError(400 , errMsg);



    }


    else{

      next();
      }
  };



//Index Route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }));

  ///New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
  });




//Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  }));


  //Create Route
app.post("/listings",wrapAsync(async (req, res) => {

  let result=listingSchema.validate(req.body);
  console.log(result);
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
})
);
  

//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

//Update Route
app.put("/listings/:id", wrapAsync(async (req, res) => {
  if(!req.body.listing){

    throw new ExpressError(400 , "send valid data for listing");
  }
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));



//Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
}));



// reviewspost  route


app.post("/listings/:id/reviews" ,validateReview, wrapAsync(async(req,res)=>{


  let listing = await Listing.findById(req.params.id);

  let newReview = new Review(req.body.review);


  listing.reviews.push(newReview);


  await newReview.save();


  await listing.save();

  console.log("new review saved");

  res.redirect(`/listings/${listing._id}`);


}));


//delete review  route

app.delete("/listings/:id/reviews/:reviewId" ,wrapAsync(async(req,res)=>{

  let {id , reviewId} = req.params;


  await Listing.findByIdAndUpdate(id , {$pull:{reviews : reviewId}});



  await Review.findOneAndDelete(reviewId);


  await Review.findById(reviewId);

  res.redirect(`/listings/${id}`);



}))



app.all("*" ,(req,res ,next)=>{

  next(new ExpressError(404 , "Page not found"));
})



app.use((err,req ,res,next)=>{

  let {statusCode=500 ,message="Something went wrong"} =err;
  res.render("error.ejs");
});


app.listen(8081, () => {
    console.log("Server is listening on port 8081");
});

// app.get("/listings", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });
