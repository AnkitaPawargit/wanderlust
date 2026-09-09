const mongoose=require("mongoose");
const User=require("./user.js");

const reviewSchema=new mongoose.Schema({
    comment:{
        type:String
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
});

const Review=mongoose.model("Review",reviewSchema);
module.exports=Review;

//this is the model for reviews that we are going to use in the individual listing