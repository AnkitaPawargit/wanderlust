const mongoose = require("mongoose");
const Listing = require("./models/listing");

async function updateOldListings() {
    await mongoose.connect("mongodb://127.0.0.1:27017/application");

    const listings = await Listing.find({ category: { $exists: false } });
    for (let listing of listings) {
        listing.category = "trending"; // default category
        await listing.save();
        console.log(`Updated "${listing.title}"`);
    }

    mongoose.connection.close();
    console.log("Done updating old listings");
}

updateOldListings();
