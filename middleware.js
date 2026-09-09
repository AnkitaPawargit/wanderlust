const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const { listingSchema }=require("./schema.js"); //this is for server validation
const { reviewSchema } = require("./schema.js");
const Expresserror=require("./utils/Expresserror.js");

//thsi is the middleware used for serverside validation to make sure that the users from other side will enter the vaild input data for the listing
module.exports.checkvalidation = (req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(", ");
        throw new Expresserror(400, msg);
    }
    else{
        next();
    }
};

//this is the middleware used for serverside validation to make sure that the users from other side will enter the vaild input data for the review
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(error.details[0].message, 400);
    }
    else{
        next();
    }
};


module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","Please login to continue");
        return res.redirect("/login");
    }
    next();//important to call the next
};

module.exports.saveredirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirecturl=req.session.redirectUrl;
    }
    next();
}


//this middleware is defined to make sure that no user from other browsers like hopscotch can have an access to the edit and delete options of the listing when they are not the owner of the listing ypu can say it is the authorization
module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let data=await Listing.findById(id);
    if(!data.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the owner of this Listing");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

//this is the middle ware designed for the same reason as above but for reviews
module.exports.isReviewOwner=async(req,res,next)=>{
    let {id,reviewid}=req.params;
    let review=await Review.findById(reviewid);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the owner of this Listing");
        return res.redirect(`/listing/${id}`);
    }
    next();
}


