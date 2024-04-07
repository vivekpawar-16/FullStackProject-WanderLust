// const Listing = require("../models/listing");
// const wrapAsync = require("../utils/wrapAsync");


// module.exports.index =async(req,res)=>{


//     const allListings = await Listing.find({});


//     res.render("listings/index.ejs" , {allListings});
// };

// module.exports.renderNewForm = async(req,res)=>{

//     res.render("listings/new.ejs");


// };


// module.exports.showListing = (async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id).populate("reviews");
//     res.render("listings/show.ejs", { listing });
//   });


// module.exports.createListing = (async (req, res) => {

//     let result=listingSchema.validate(req.body);
//     console.log(result);
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
  
  
//     req.flash("success" , "new listing created");
//     res.redirect("/listings");
//   });




// module.exports.updateListing =  wrapAsync(async (req, res) => {
//     if(!req.body.listing){
  
//       throw new ExpressError(400 , "send valid data for listing");
//     }
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     res.redirect(`/listings/${id}`);
//   });


//   module.exports.destroyLisitng=wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     res.redirect("/listings");
//   });