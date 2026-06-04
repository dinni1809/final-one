const mongoose = require("mongoose");
const path = require("path");

// Set up environment to load models properly
const backendSrc = path.join(__dirname, "../../../../Downloads/RESTAURANT FINDER/final one/backend/src");
const User = require(path.join(backendSrc, "models/User"));
const Restaurant = require(path.join(backendSrc, "models/Restaurant"));
const Review = require(path.join(backendSrc, "models/Review"));
const reviewService = require(path.join(backendSrc, "services/reviewService"));
const reviewRepository = require(path.join(backendSrc, "repositories/reviewRepository"));

const mongoUri = "mongodb+srv://Faattsoo:Faattsool12%23@cluster0.ntff9u4.mongodb.net/faattsoo?retryWrites=true&w=majority";

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected successfully.\n");

    // 1. Fetch a sample restaurant and a sample user
    const restaurant = await Restaurant.findOne();
    if (!restaurant) {
      console.error("No restaurant found in DB!");
      return;
    }
    console.log(`Using Restaurant: ${restaurant.name} (ID: ${restaurant._id})`);

    // Clean up any existing reviews for our test users to make the test idempotent
    const testEmailVerified = "test-verified-reviewer@faattsoo.local";
    const testEmailUnverified = "test-unverified-reviewer@faattsoo.local";

    await User.deleteMany({ email: { $in: [testEmailVerified, testEmailUnverified, "test-verified-reviewer-2@faattsoo.local"] } });
    
    // Create test user: Verified
    const verifiedUser = await User.create({
      name: "Verified Test Reviewer",
      username: "verified_tester",
      email: testEmailVerified,
      password: "password123",
      isVerified: true
    });
    console.log(`Created Verified User: ${verifiedUser.name} (ID: ${verifiedUser._id})`);

    // Create test user: Unverified
    const unverifiedUser = await User.create({
      name: "Unverified Test Reviewer",
      username: "unverified_tester",
      email: testEmailUnverified,
      password: "password123",
      isVerified: false
    });
    console.log(`Created Unverified User: ${unverifiedUser.name} (ID: ${unverifiedUser._id})\n`);

    // Clean up any previous reviews by these users
    await Review.deleteMany({ user: { $in: [verifiedUser._id, unverifiedUser._id] } });

    console.log("=== Running Validation Tests ===");

    // Test 1: Unverified User Review Submission (Should fail)
    try {
      console.log("Test 1: Submitting review from unverified user...");
      await reviewService.createReview(restaurant._id.toString(), unverifiedUser, {
        rating: 5,
        title: "Loved it!",
        body: "This is a great restaurant review written by an unverified tester."
      });
      console.error("  ❌ FAIL: Unverified user review did not throw error.");
    } catch (err) {
      console.log(`  ✓ SUCCESS: Correctly threw error: "${err.message}" (Status: ${err.statusCode})`);
    }

    // Test 2: Invalid Rating (Should fail)
    try {
      console.log("Test 2: Submitting review with invalid rating (6)...");
      await reviewService.createReview(restaurant._id.toString(), verifiedUser, {
        rating: 6,
        title: "Title",
        body: "This is a valid review body that has enough characters."
      });
      console.error("  ❌ FAIL: Invalid rating did not throw error.");
    } catch (err) {
      console.log(`  ✓ SUCCESS: Correctly threw error: "${err.message}"`);
    }

    // Test 3: Review body too short (Should fail)
    try {
      console.log("Test 3: Submitting review with body too short (5 chars)...");
      await reviewService.createReview(restaurant._id.toString(), verifiedUser, {
        rating: 4,
        title: "Short",
        body: "Short"
      });
      console.error("  ❌ FAIL: Short review body did not throw error.");
    } catch (err) {
      console.log(`  ✓ SUCCESS: Correctly threw error: "${err.message}"`);
    }

    // Test 4: Review body too long (Should fail)
    try {
      console.log("Test 4: Submitting review with body too long (505 chars)...");
      await reviewService.createReview(restaurant._id.toString(), verifiedUser, {
        rating: 4,
        title: "Long",
        body: "a".repeat(505)
      });
      console.error("  ❌ FAIL: Long review body did not throw error.");
    } catch (err) {
      console.log(`  ✓ SUCCESS: Correctly threw error: "${err.message}"`);
    }

    // Test 5: Valid Review Submission (Should succeed)
    console.log("Test 5: Submitting valid review from verified user...");
    const initialRestRating = restaurant.rating || 0;
    const initialRestReviewCount = restaurant.reviewCount || 0;
    console.log(`  Initial Restaurant Stats - Rating: ${initialRestRating}, Reviews: ${initialRestReviewCount}`);

    const review = await reviewService.createReview(restaurant._id.toString(), verifiedUser, {
      rating: 4,
      title: "Really Good Food",
      body: "This is a great dining place! The service was fast and the mocktails were premium."
    });
    console.log(`  ✓ SUCCESS: Created review ID: ${review._id}`);

    // Test 6: Verify Restaurant Rating and reviewCount auto-updated in DB
    const updatedRest = await Restaurant.findById(restaurant._id);
    console.log(`  Updated Restaurant Stats - Rating: ${updatedRest.rating}, Reviews: ${updatedRest.reviewCount}`);
    if (updatedRest.reviewCount === initialRestReviewCount + 1) {
      console.log("  ✓ SUCCESS: reviewCount incremented correctly!");
    } else {
      console.error(`  ❌ FAIL: reviewCount expected ${initialRestReviewCount + 1}, got ${updatedRest.reviewCount}`);
    }

    // Test 7: Duplicate Review Submission (Should fail)
    try {
      console.log("Test 7: Submitting duplicate review from verified user...");
      await reviewService.createReview(restaurant._id.toString(), verifiedUser, {
        rating: 3,
        title: "Again",
        body: "Trying to submit another review for the same restaurant."
      });
      console.error("  ❌ FAIL: Duplicate review did not throw error.");
    } catch (err) {
      console.log(`  ✓ SUCCESS: Correctly threw error: "${err.message}"`);
    }

    // Test 8: User Reviews Count endpoint helper
    console.log("Test 8: Checking dynamic count of reviews written by user...");
    const count = await reviewService.getUserReviewsCount(verifiedUser._id);
    console.log(`  User review count: ${count}`);
    if (count === 1) {
      console.log("  ✓ SUCCESS: User reviews count is dynamic and correct!");
    } else {
      console.error(`  ❌ FAIL: Expected 1, got ${count}`);
    }

    // Test 9: Sorting
    console.log("Test 9: Submitting a review from another user to test sorting...");
    const anotherVerifiedUser = await User.create({
      name: "Second Test Reviewer",
      username: "verified_tester_2",
      email: "test-verified-reviewer-2@faattsoo.local",
      password: "password123",
      isVerified: true
    });

    await reviewService.createReview(restaurant._id.toString(), anotherVerifiedUser, {
      rating: 5,
      title: "Superb Experience",
      body: "Highly recommended! Food was absolutely delicious and presentation was top tier."
    });

    const newestReviews = await reviewService.getReviews(restaurant._id.toString(), "newest");
    console.log("  Newest Sort:");
    newestReviews.forEach((r, idx) => console.log(`    [${idx}] ${r.userName} - ${r.rating} stars - Date: ${r.createdAt}`));

    const highestReviews = await reviewService.getReviews(restaurant._id.toString(), "highest");
    console.log("  Highest Rated Sort:");
    highestReviews.forEach((r, idx) => console.log(`    [${idx}] ${r.userName} - ${r.rating} stars - Date: ${r.createdAt}`));

    if (highestReviews[0].rating >= highestReviews[1].rating) {
      console.log("  ✓ SUCCESS: Sorting works perfectly!");
    } else {
      console.error("  ❌ FAIL: Highest rated sorting returned incorrect order.");
    }

    // Clean up
    console.log("\nCleaning up test reviews and users...");
    await Review.deleteMany({ user: { $in: [verifiedUser._id, unverifiedUser._id, anotherVerifiedUser._id] } });
    await User.deleteMany({ email: { $in: [testEmailVerified, testEmailUnverified, "test-verified-reviewer-2@faattsoo.local"] } });
    // Restore restaurant stats
    await Restaurant.findByIdAndUpdate(restaurant._id, {
      rating: initialRestRating,
      reviewCount: initialRestReviewCount
    });
    console.log("Cleanup done.");

  } catch (error) {
    console.error("Test runner crashed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

run();
