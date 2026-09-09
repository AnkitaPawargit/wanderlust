const express=require("express");
const router=express.Router();
const { isLoggedin } = require("../middleware.js");
const Listing=require("../models/listing.js");
const Expresserror=require("../utils/Expresserror.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {checkvalidation}=require("../middleware.js");
const {validateReview}=require("../middleware.js");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const { saveredirectUrl } = require("../middleware.js");
const { isOwner } = require("../middleware.js");
const { storage }=require("../cloudConfig.js");
const multer  = require('multer');
const upload = multer({storage });
const geocodeLocation = require("../utils/geocoding.js");


//this is to view all the details
router.get("/",wrapAsync (async (req,res,next)=>{
    let datas=await Listing.find();
    res.render("listing/show.ejs",{ datas });
}));

//add a listing
router.get("/edit",isLoggedin,(req,res)=>{
    //here we want only authenticated users to add a listing
    // if(!req.isAuthenticated()){
    //     req.flash("error","Please login to continue");
    //     return res.redirect("/login");
    // } to perform this we will use a middleware
    res.render("listing/addform.ejs");
});

router.post("/", isLoggedin, upload.single('listing[image]'), checkvalidation, wrapAsync(async (req, res, next) => {
    const listingData = req.body.listing;
    
    let coords = null;
    if (listingData.location) {
        coords = await geocodeLocation(listingData.location); // returns {lat,lng} or null
    }

    const url = req.file.path;
    const filename = req.file.filename;
    const newListing = new Listing(listingData); //here we can write new Listing(req.body.listing); but we have stored req.body.listing in lsitingdata so we have used it directly
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    
    if (coords) {
        newListing.coordinates = coords; // save coordinates
    }

    await newListing.save();
    req.flash("success", "New listing added");
    res.redirect("/listing");
}));


//this is to get an individual information
router.get("/:id",wrapAsync (async (req,res,next)=>{
    let {id}=req.params;
    let data=await Listing.findById(id).populate({
        path:"reviews",populate: {
            path:"author",
        }
    }).populate("owner");
    console.log(data);
    if(!data){
        req.flash("error","The listing does not exist!");
        return res.redirect("/listing");
    }
    res.render("listing/individual.ejs",{ data });
}));

router.get("/:id/edit",isLoggedin,isOwner,wrapAsync (async (req,res,next)=>{
    let {id}=req.params;
    let data=await Listing.findById(id);
    if(!data){
        req.flash("error","The listing does not exist!");
        return res.redirect("/listing");
    };
    // let originalUrl=data.image.url;
    // originalUrl=originalUrl.replace("/upload","/upload/w_300,h_250");
    res.render("listing/editform.ejs",{ data});
}));

//here it is the patch request
router.patch(
  "/:id",
  isLoggedin,
  isOwner,
  upload.single("listing[image]"),
  checkvalidation,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let newListing = req.body.listing;

    // 🔹 STEP 1: If location is updated → geocode again
    if (newListing.location) {
      const coords = await geocodeLocation(newListing.location);
      if (coords) {
        newListing.coordinates = coords;
      }
    }

    // 🔹 STEP 2: Update listing
    let listing = await Listing.findByIdAndUpdate(
      id,
      { ...newListing },
      { runValidators: true, new: true }
    );

    // 🔹 STEP 3: If new image uploaded
    if (req.file) {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
      await listing.save();
    }

    req.flash("success", "Listing updated successfully");
    res.redirect(`/listing/${id}`);
  })
);

//delete
router.delete("/:id",isLoggedin,isOwner,wrapAsync (async (req,res,next)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id, {new : true});
    req.flash("success","Listing deleted");
    res.redirect("/listing");
}));

// GET /listing/category/:category
router.get("/category/:category", wrapAsync(async (req, res) => {
    const { category } = req.params;

    // Validate category using enum
    const validCategories = [
      "trending", "bedrooms","mountains","castle","forest","artic",
      "amazingpool","musicnight", "dome","boating"
    ];
    if (!validCategories.includes(category)) {
        req.flash("error", "Invalid category");
        return res.redirect("/listing");
    }

    const listings = await Listing.find({ category });
    res.render("listing/show.ejs", { datas: listings });
}));


module.exports=router;
