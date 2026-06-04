const mongoose = require("mongoose");
const mongoUri = "mongodb+srv://Faattsoo:Faattsool12%23@cluster0.ntff9u4.mongodb.net/faattsoo?retryWrites=true&w=majority";

const Restaurant = mongoose.model("Restaurant", new mongoose.Schema({}, { strict: false }), "restaurants");

async function run() {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected. Fetching all restaurants...");
    const list = await Restaurant.find().lean();
    console.log(`Total restaurants: ${list.length}`);
    console.log("Raw first 2 documents:", JSON.stringify(list.slice(0, 2), null, 2));
    list.forEach(r => {
      console.log(`- ID: ${r._id || r.id} | Slug: ${r.slug} | Name: ${r.name}`);
      console.log(`  Area: "${r.area}" | Cuisine: ${JSON.stringify(r.cuisine)} | Cuisines: ${JSON.stringify(r.cuisines)}`);
      console.log(`  Price: "${r.priceCategory}" | Style: "${r.style}" | Rating: ${r.rating} | Count: ${r.reviewCount}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}
run();
