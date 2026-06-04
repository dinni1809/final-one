const mongoose = require("mongoose");
const mongoUri = "mongodb+srv://Faattsoo:Faattsool12%23@cluster0.ntff9u4.mongodb.net/faattsoo?retryWrites=true&w=majority";

async function run() {
  try {
    await mongoose.connect(mongoUri);
    const db = mongoose.connection.db;
    const list = await db.collection("restaurants").find().toArray();
    const allKeys = new Set();
    const uniquePrices = new Set();
    list.forEach(doc => {
      Object.keys(doc).forEach(k => allKeys.add(k));
      if (doc.price_range) uniquePrices.add(doc.price_range);
    });
    console.log("All unique keys in collection:", Array.from(allKeys));
    console.log("All unique price_range values:", Array.from(uniquePrices));
    console.log("Sample cuisines:", list.slice(0, 5).map(r => r.cuisine));
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}
run();
