const mongoose=require("mongoose");
const Review=require("./review.js");
const User=require("./user.js");

//create the listing schema
const listingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    desc:{
        type:String
    },
    image:{
        url:String,
        filename:String,
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    coordinates: {
    lat: {
        type: Number
    },
    lng: {
        type: Number
    }
    },
    category: { 
        type: String, 
        enum: ["trending", "bedrooms","mountains","castle","forest","artic","amazingpool","musicnight", "dome","boating"], // only these values allowed
        required: true
    },
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}})
    }
});

//how to handle deletion
// 1  here when we want to delete a specific review we can simple find the listing id and the reveiw id and  the we can delete the review and update the lsiting of the specific
// 2  when we want to delete a lsiting the reveiews still remain in the database and for that we use the post function which will get triggered when deletion is performed and we can delete the reviews with id that are in the listing.reviews
//create the model
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;

