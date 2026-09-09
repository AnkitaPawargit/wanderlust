const mongoose=require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default; //add .default

//create the user model 
//remember that the passport provides the username and password by default
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    }
});

userSchema.plugin(passportLocalMongoose);

//model 
const User=mongoose.model("User",userSchema);
module.exports=User;
