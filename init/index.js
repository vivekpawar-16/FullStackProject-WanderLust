// const mongoose = require("mongoose");
// const initData = require("./data.js");
// const Listing = require("../models/listing.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// main()
//   .then(() => {
//     console.log("connected to DB");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// async function main() {
//   await mongoose.connect(MONGO_URL);
// }

// async function initDB() {
//     try {
//         // await Listing.deleteMany({}); // Clear existing data

//         // Insert new data from initData.data array
//         await Listing.insertMany(initData.data);

//         console.log("Data was initialized");
//     } catch (error) {
//         console.error("Error initializing database:", error);
//     }
// }

// initDB();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");

    await initDB();
    console.log("Data was initialized");
  } catch (error) {
    console.error("Error connecting to DB:", error);
    process.exit(1); // Exit the process with an error code
  } finally {
    mongoose.disconnect(); // Disconnect from the database after operations
  }
}

async function initDB() {
  try {
    await Listing.deleteMany({}); // Clear existing data
    const validListings = initData.data.map(item => ({
      title: item.title,
      description: item.description,
      image: item.image.url || "", // Assuming item.image is an object with a 'url' property
      price: item.price,
      location: item.location,
      country: item.country
    }));
    await Listing.insertMany(validListings); // Insert new data
  } catch (error) {
    console.error("Error initializing data:", error);
  }
}

main();
