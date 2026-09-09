const mongoose = require("mongoose");
const Listing = require("./models/listing.js");        // your Listing model
const geocodeLocation = require("./utils/geocoding.js"); // your geocoding function

async function updateCoordinates() {
    await mongoose.connect("mongodb://127.0.0.1:27017/application");
    console.log("Connected to DB");

    // Find listings that don't have coordinates yet
    const listings = await Listing.find({ $or: [{ coordinates: { $exists: false } }, { coordinates: null }] });
    console.log(`Found ${listings.length} listings to update`);

    for (let listing of listings) {
        if (listing.location) {
            const coords = await geocodeLocation(listing.location);
            if (coords) {
                listing.coordinates = coords;
                await listing.save();
                console.log(`Updated "${listing.title}" with coordinates:`, coords);
            } else {
                console.log(`Could not geocode: "${listing.title}"`);
            }
        } else {
            console.log(`No location provided for: "${listing.title}"`);
        }
    }

    console.log("All done!");
    mongoose.connection.close();
}

updateCoordinates().catch(err => console.error(err));
