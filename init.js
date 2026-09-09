const mongoose=require("mongoose");
const Listing=require("./models/listing.js");

main().then(res=>{
    console.log("connection established");
}).
catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/application');
};

const data = [
  {
    title: "Cozy Studio Apartment",
    desc: "A compact and comfortable studio perfect for students or working professionals.",
    image: {
      url: "https://cdn.confident-group.com/wp-content/uploads/2025/01/09175739/villa-features-scaled.jpg",
      filename: "listingimage"
    },
    price: 8500,
    location: "Pune",
    country: "India",
    owner: "69778f6416c4853d0eed7c4e"
  },
  {
    title: "Luxury Sea View Flat",
    desc: "Spacious flat with a beautiful sea view and modern amenities.",
    image: {
      url: "https://media.istockphoto.com/id/506903162/photo/luxurious-villa-with-pool.jpg?s=612x612&w=0&k=20&c=Ek2P0DQ9nHQero4m9mdDyCVMVq3TLnXigxNPcZbgX2E=",
      filename: "listingimage"
    },
    price: 45000,
    location: "Mumbai",
    country: "India",
    owner: "69778f6416c4853d0eed7c4e"
  },
  {
    title: "Budget PG for Girls",
    desc: "Safe and affordable PG accommodation with food included.",
    image: {
      url: "https://www.gurugramproperties.com/public/uploads/newsphotos/advantages-of-living-in-a-villa.jpg",
      filename: "listingimage"
    },
    price: 6500,
    location: "Nagpur",
    country: "India",
    owner: "69778f6416c4853d0eed7c4e"
  },
  {
    title: "Independent Villa",
    desc: "3BHK independent villa with garden and parking.",
    image: {
      url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE4fHx8ZW58MHx8fHx8",
      filename: "listingimage"
    },
    price: 60000,
    location: "Bengaluru",
    country: "India",
    owner: "69778f6416c4853d0eed7c4e"
  },
  {
    title: "Modern City Apartment",
    desc: "Fully furnished apartment in the heart of the city.",
    image: {
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR03fgGtzOHKoDJOBRx9jFTI0QjsrxNpQz8Q&s",
      filename: "listingimage"
    },
    price: 32000,
    location: "Delhi",
    country: "India",
    owner: "69778f6416c4853d0eed7c4e"
  },
  {
    title: "Hill View Cottage",
    desc: "Peaceful cottage surrounded by nature and hills.",
    image: {
      url: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/770675765.jpg?k=1724238fb741760c2ce3dbfd076093ac2530574dc22bedbf632f04b8b655ede9&o=",
      filename: "listingimage"
    },
    price: 18000,
    location: "Mahabaleshwar",
    country: "India",
    owner: "69778f6416c4853d0eed7c4e"
  },
  {
    title: "Student Hostel Room",
    desc: "Affordable hostel room near major colleges.",
    image: {
      url: "https://media.istockphoto.com/id/503044702/photo/illuminated-sky-and-outside-of-waterfront-buiding.jpg?s=612x612&w=0&k=20&c=xkDBkqmCVvhR4idfybXRb-yFS0KqOjqtikg_LtO4pzs=",
      filename: "listingimage"
    },
    price: 5000,
    location: "Kolhapur",
    country: "India",
    owner: "69778f6416c4853d0eed7c4e"
  },
  {
    title: "Beachside Bungalow",
    desc: "Beautiful bungalow located close to the beach.",
    image: {
      url: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
      filename: "listingimage"
    },
    price: 75000,
    location: "Goa",
    country: "India",
    owner: "69778f6416c4853d0eed7c4e"
  },
  {
    title: "Compact 1BHK Flat",
    desc: "Ideal for small families with basic facilities.",
    image: {
      url: "https://media.istockphoto.com/id/2110310187/photo/luxury-tropical-pool-villa-at-dusk.jpg?s=612x612&w=0&k=20&c=r8UTpMnbLWD_DOKHAcu6dw-MJEcGg0CTqt0ICa84D84=",
      filename: "listingimage"
    },
    price: 12000,
    location: "Nashik",
    country: "India",
    owner: "69778f6416c4853d0eed7c4e"
  },
  {
    title: "Premium Office Space",
    desc: "Commercial office space in a prime business area.",
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Villa_Medici_a_Fiesole_1.jpg/1280px-Villa_Medici_a_Fiesole_1.jpg",
      filename: "listingimage"
    },
    price: 90000,
    location: "Hyderabad",
    country: "India",
    owner: "69778f6416c4853d0eed7c4e"
  }
];


Listing.insertMany(data);