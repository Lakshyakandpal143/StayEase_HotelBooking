const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

require("dotenv").config();

const MONGO_URL = "mongodb://127.0.0.1:27017/apnaGhar";

// ================= MAPBOX =================
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// ================= CONNECT DB =================
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// ================= INIT DB =================
const initDB = async () => {
  await Listing.deleteMany({});
  console.log("Old listings deleted");

  const listingsWithGeometry = [];

  for (let obj of initData.data) {
    let geometry;

    try {
      const geoResponse = await geocodingClient
        .forwardGeocode({
          query: `${obj.location}, ${obj.country}`,
          limit: 1,
        })
        .send();

      if (geoResponse.body.features.length > 0) {
        geometry = geoResponse.body.features[0].geometry;
      } else {
        geometry = {
          type: "Point",
          coordinates: [0, 0],
        };
        console.log(`⚠️ No location found for ${obj.location}`);
      }
    } catch (err) {
      geometry = {
        type: "Point",
        coordinates: [0, 0],
      };
      console.log(`❌ Geocoding failed for ${obj.location}`);
    }

    listingsWithGeometry.push({
      ...obj,
      geometry,
      owner: "690a02aa57eaf445beff96d5", // ✅ your user id
    });
  }

  await Listing.insertMany(listingsWithGeometry);
  console.log("Data was initialized successfully");

  mongoose.connection.close();
};

initDB();
