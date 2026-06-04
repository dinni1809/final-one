const mongoose = require("mongoose");

const mongoUri = "mongodb+srv://Faattsoo:Faattsool12%23@cluster0.ntff9u4.mongodb.net/faattsoo?retryWrites=true&w=majority";

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected successfully.");

    const db = mongoose.connection.db;
    const collectionName = "reviews";
    const reviewsCol = db.collection(collectionName);

    console.log(`\nListing indexes on "${collectionName}" collection:`);
    const indexes = await reviewsCol.indexes();
    console.log(JSON.stringify(indexes, null, 2));

    // Look for unique index on restaurant_id, restaurantId, or anything causing conflicts
    for (const idx of indexes) {
      if (idx.name !== "_id_" && idx.unique) {
        console.log(`\nFound unique index: ${idx.name}`);
        // Check if it is a unique index that shouldn't be unique
        // For reviews, we only want unique compound index on { restaurant: 1, user: 1 } if anything.
        // If it's a unique index on a single field like restaurant_id, it must be dropped.
        console.log(`Dropping unique index: ${idx.name}...`);
        await reviewsCol.dropIndex(idx.name);
        console.log("Index dropped successfully.");
      }
    }

    console.log("\nRe-listing indexes:");
    const finalIndexes = await reviewsCol.indexes();
    console.log(JSON.stringify(finalIndexes, null, 2));

  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB.");
  }
}

run();
