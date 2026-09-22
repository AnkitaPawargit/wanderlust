if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}

const express=require("express");
const app=express();
const port=3000;
const methodOverride=require("method-override");
const path=require("path");
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const ejsmate=require("ejs-mate");
const Expresserror=require("./utils/Expresserror.js");
const wrapAsync=require("./utils/wrapAsync.js");
// const { listingSchema }=require("./schema.js"); 
// const { reviewSchema } = require("./schema.js");
const {checkvalidation}=require("./middleware.js");
const {validateReview}=require("./middleware.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const { isLoggedin } = require("./middleware.js");
const { saveredirectUrl } = require("./middleware.js");
const { isOwner } = require("./middleware.js");
const { isReviewOwner } = require("./middleware.js");
const multer  = require('multer');
const { storage }=require("./cloudConfig.js");
const upload = multer({storage });
const listing=require("./routes/listing.js");


main().then(res=>{
    console.log("connection established");
}).
catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
};

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsmate);
app.use(session({
    secret:"thisisasecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000, //the cookie will expire in 7 days
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate())); 

//middleware for local variables which can also: flash messages
app.use((req,res,next)=>{
    res.locals.success=req.flash("success"); //always keep it success
    res.locals.error=req.flash("error"); //always keep it error
    res.locals.currentUser=req.user;//this is the local variable to check if the user is logged in or not to decide which options to dispaly on the nav bar
    next(); //important stage
});

app.listen(port,()=>{
    console.log("post is listening");
});

app.use("/listing",listing);

//signup
app.get("/signup",(req,res)=>{
    res.render("user/signupform.ejs");
});

app.post("/signup",wrapAsync(async (req,res)=>{
   try {
    let { email ,username,password }=req.body;
   let newUser=new User({email,username});
   let registeredUser=await User.register(newUser,password);
   //here after we register the user we want it to be loggedin immediatly without needing to login in again
   req.login(registeredUser,(err)=>{
    if(err){
            return next(err);
        }
       req.flash("success","Welcome to Wanderlust");
       res.redirect("/listing");
   })
   } catch (error) {
    req.flash("error",error.message);
    res.redirect("/signup");
   }
}));

app.get("/login",wrapAsync(async(req,res,next)=>{
    res.render("user/loginform.ejs");
}));

app.post("/login",saveredirectUrl,passport.authenticate("local",{
    failureRedirect:"/login",     //by this we done need to access the data the suthentication is done automatically
    failureFlash:true,
}),async(req,res)=>{
    req.flash("success","Logged in successfully!");
    let redirecturl=res.locals.redirecturl || "/listing";
    res.redirect(redirecturl); 
}); //here we will go to listings only when we login successfully


//add a review : here we dont need the get request beacuse we already have the form connected to the individaul listing
app.post("/listing/:id/review",isLoggedin, validateReview ,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    let newreview=new Review(req.body.list);
    newreview.author=req.user._id; //here we will save the id of the user who is giving the review
    listing.reviews.push(newreview); //add the review to the individual listing
    await newreview.save();
    await listing.save();
    console.log(newreview);
    req.flash("success","New review added");
    res.redirect(`/listing/${id}`);
}));

//delete review
app.delete("/listing/:id/review/:reviewid",isLoggedin,isReviewOwner,async (req,res)=>{
    let { id, reviewid }=req.params;
    await Listing.findByIdAndUpdate(id,{
        $pull:{
            reviews:reviewid //here we use a pull operator where is used to delete a instance
        }
    });
    await Review.findByIdAndDelete(reviewid);
    req.flash("success","Review deleted");
    res.redirect(`/listing/${id}`);
});

//logout route
app.get("/logout",(req,res)=>{
    //here we use a builtin function
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Successfully Logged Out.");
        res.redirect("/listing");
    });
});

//error handling middleware

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.render("error.ejs",{ err , message});
});

