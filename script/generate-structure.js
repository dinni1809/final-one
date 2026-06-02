const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const backendRoot = path.join(root, "backend");

const directories = [
  "backend",
  "backend/src",
  "backend/src/config",
  "backend/src/models",
  "backend/src/controllers",
  "backend/src/services",
  "backend/src/repositories",
  "backend/src/routes",
  "backend/src/middleware",
  "backend/src/validators",
  "backend/src/utils",
  "backend/src/constants",
  "backend/docs",
  "backend/uploads",
  "backend/uploads/restaurants",
  "backend/uploads/menu",
];

const files = {
  "backend/src/config/db.js": `const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is required");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");
};

module.exports = connectDB;
`,
  "backend/src/config/passport.js": `const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const user = await User.findOneAndUpdate(
            { email },
            {
              name: profile.displayName,
              email,
              googleId: profile.id,
              avatar: profile.photos?.[0]?.value,
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
          );

          done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );
}

module.exports = passport;
`,
  "backend/src/config/env.js": `require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
};
`,
  "backend/src/models/User.js": `const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { ROLES } = require("../constants/roles");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    googleId: { type: String },
    avatar: { type: String },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.USER },
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
`,
  "backend/src/models/Restaurant.js": `const mongoose = require("mongoose");
const { CUISINES } = require("../constants/cuisines");
const { PRICE_CATEGORIES } = require("../constants/priceCategories");
const { RESTAURANT_STYLES } = require("../constants/restaurantStyles");

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    area: { type: String, required: true, trim: true, index: true },
    cuisine: [{ type: String, enum: CUISINES, index: true }],
    priceCategory: { type: String, enum: PRICE_CATEGORIES, required: true },
    rating: { type: Number, min: 0, max: 10, default: 0, index: true },
    style: { type: String, enum: RESTAURANT_STYLES, required: true },
    description: { type: String, trim: true },
    image: { type: String },
    isFeatured: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

restaurantSchema.index({ name: "text", area: "text", cuisine: "text" });

module.exports = mongoose.model("Restaurant", restaurantSchema);
`,
  "backend/src/models/MenuItem.js": `const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, index: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, trim: true },
    image: { type: String },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

menuItemSchema.index({ name: "text", description: "text", category: "text" });

module.exports = mongoose.model("MenuItem", menuItemSchema);
`,
  "backend/src/controllers/authController.js": `const authService = require("../services/authService");
const response = require("../utils/responseHandler");

exports.register = async (req, res, next) => {
  try {
    response.created(res, await authService.register(req.body));
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    response.ok(res, await authService.login(req.body));
  } catch (error) {
    next(error);
  }
};

exports.googleLogin = async (req, res, next) => {
  try {
    response.ok(res, await authService.googleLogin(req.body));
  } catch (error) {
    next(error);
  }
};

exports.me = (req, res) => response.ok(res, { user: req.user });
exports.logout = (_req, res) => response.ok(res, { message: "Logged out successfully" });
`,
  "backend/src/controllers/restaurantController.js": `const restaurantService = require("../services/restaurantService");
const response = require("../utils/responseHandler");

exports.getAll = async (req, res, next) => {
  try {
    response.ok(res, await restaurantService.getAll(req.query));
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    response.ok(res, await restaurantService.getById(req.params.id));
  } catch (error) {
    next(error);
  }
};

exports.search = async (req, res, next) => {
  try {
    response.ok(res, await restaurantService.search(req.query.q));
  } catch (error) {
    next(error);
  }
};

exports.filter = async (req, res, next) => {
  try {
    response.ok(res, await restaurantService.filter(req.query));
  } catch (error) {
    next(error);
  }
};

exports.areas = async (_req, res, next) => {
  try {
    response.ok(res, await restaurantService.getAreas());
  } catch (error) {
    next(error);
  }
};

exports.cuisines = (_req, res) => response.ok(res, restaurantService.getCuisines());
exports.styles = (_req, res) => response.ok(res, restaurantService.getStyles());
exports.prices = (_req, res) => response.ok(res, restaurantService.getPrices());
exports.topRated = async (_req, res, next) => {
  try {
    response.ok(res, await restaurantService.topRated());
  } catch (error) {
    next(error);
  }
};
exports.featured = async (_req, res, next) => {
  try {
    response.ok(res, await restaurantService.featured());
  } catch (error) {
    next(error);
  }
};
exports.recent = async (_req, res, next) => {
  try {
    response.ok(res, await restaurantService.recent());
  } catch (error) {
    next(error);
  }
};
`,
  "backend/src/controllers/menuController.js": `const menuService = require("../services/menuService");
const response = require("../utils/responseHandler");

exports.getRestaurantMenu = async (req, res, next) => {
  try {
    response.ok(res, await menuService.getRestaurantMenu(req.params.restaurantId));
  } catch (error) {
    next(error);
  }
};

exports.search = async (req, res, next) => {
  try {
    response.ok(res, await menuService.search(req.query.q));
  } catch (error) {
    next(error);
  }
};
`,
  "backend/src/controllers/adminRestaurantController.js": `const adminService = require("../services/adminService");
const response = require("../utils/responseHandler");

exports.create = async (req, res, next) => {
  try {
    response.created(res, await adminService.createRestaurant(req.body));
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    response.ok(res, await adminService.updateRestaurant(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    response.ok(res, await adminService.deleteRestaurant(req.params.id));
  } catch (error) {
    next(error);
  }
};

exports.restaurantCount = async (_req, res, next) => {
  try {
    response.ok(res, await adminService.restaurantCount());
  } catch (error) {
    next(error);
  }
};
`,
  "backend/src/controllers/adminMenuController.js": `const adminService = require("../services/adminService");
const response = require("../utils/responseHandler");

exports.create = async (req, res, next) => {
  try {
    response.created(res, await adminService.createMenuItem(req.body));
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    response.ok(res, await adminService.updateMenuItem(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    response.ok(res, await adminService.deleteMenuItem(req.params.id));
  } catch (error) {
    next(error);
  }
};

exports.menuCount = async (_req, res, next) => {
  try {
    response.ok(res, await adminService.menuCount());
  } catch (error) {
    next(error);
  }
};

exports.userCount = async (_req, res, next) => {
  try {
    response.ok(res, await adminService.userCount());
  } catch (error) {
    next(error);
  }
};
`,
  "backend/src/services/authService.js": `const userRepository = require("../repositories/userRepository");
const ApiError = require("../utils/ApiError");
const generateToken = require("../utils/generateToken");

exports.register = async ({ name, email, password }) => {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) throw new ApiError(409, "Email already registered");

  const user = await userRepository.create({ name, email, password });
  return { user, token: generateToken(user) };
};

exports.login = async ({ email, password }) => {
  const user = await userRepository.findByEmailWithPassword(email);
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  user.password = undefined;
  return { user, token: generateToken(user) };
};

exports.googleLogin = async ({ name, email, googleId, avatar }) => {
  const user = await userRepository.upsertGoogleUser({ name, email, googleId, avatar });
  return { user, token: generateToken(user) };
};
`,
  "backend/src/services/restaurantService.js": `const restaurantRepository = require("../repositories/restaurantRepository");
const menuRepository = require("../repositories/menuRepository");
const ApiError = require("../utils/ApiError");
const { CUISINES } = require("../constants/cuisines");
const { PRICE_CATEGORIES } = require("../constants/priceCategories");
const { RESTAURANT_STYLES } = require("../constants/restaurantStyles");

exports.getAll = (query) => restaurantRepository.findAll(query);

exports.getById = async (id) => {
  const restaurant = await restaurantRepository.findById(id);
  if (!restaurant) throw new ApiError(404, "Restaurant not found");
  const menu = await menuRepository.findByRestaurant(id);
  return { restaurant, menu };
};

exports.search = (q) => restaurantRepository.searchByName(q);
exports.filter = (query) => restaurantRepository.filter(query);
exports.getAreas = () => restaurantRepository.distinctAreas();
exports.getCuisines = () => CUISINES;
exports.getStyles = () => RESTAURANT_STYLES;
exports.getPrices = () => PRICE_CATEGORIES;
exports.topRated = () => restaurantRepository.topRated();
exports.featured = () => restaurantRepository.featured();
exports.recent = () => restaurantRepository.recent();
`,
  "backend/src/services/menuService.js": `const menuRepository = require("../repositories/menuRepository");

exports.getRestaurantMenu = (restaurantId) => menuRepository.findByRestaurant(restaurantId);
exports.search = (q) => menuRepository.search(q);
`,
  "backend/src/services/adminService.js": `const userRepository = require("../repositories/userRepository");
const restaurantRepository = require("../repositories/restaurantRepository");
const menuRepository = require("../repositories/menuRepository");

exports.createRestaurant = (data) => restaurantRepository.create(data);
exports.updateRestaurant = (id, data) => restaurantRepository.update(id, data);
exports.deleteRestaurant = (id) => restaurantRepository.remove(id);
exports.createMenuItem = (data) => menuRepository.create(data);
exports.updateMenuItem = (id, data) => menuRepository.update(id, data);
exports.deleteMenuItem = (id) => menuRepository.remove(id);
exports.restaurantCount = async () => ({ totalRestaurants: await restaurantRepository.count() });
exports.menuCount = async () => ({ totalMenuItems: await menuRepository.count() });
exports.userCount = async () => ({ totalUsers: await userRepository.count() });
`,
  "backend/src/repositories/userRepository.js": `const User = require("../models/User");

exports.create = (data) => User.create(data);
exports.findByEmail = (email) => User.findOne({ email });
exports.findByEmailWithPassword = (email) => User.findOne({ email }).select("+password");
exports.findById = (id) => User.findById(id);
exports.count = () => User.countDocuments();
exports.upsertGoogleUser = ({ name, email, googleId, avatar }) =>
  User.findOneAndUpdate(
    { email },
    { name, email, googleId, avatar },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
`,
  "backend/src/repositories/restaurantRepository.js": `const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");
const { getPagination } = require("../utils/pagination");

exports.create = (data) => Restaurant.create(data);
exports.findById = (id) => Restaurant.findById(id);
exports.update = (id, data) => Restaurant.findByIdAndUpdate(id, data, { new: true, runValidators: true });
exports.remove = (id) => Restaurant.findByIdAndDelete(id);
exports.count = () => Restaurant.countDocuments();
exports.distinctAreas = () => Restaurant.distinct("area");

exports.findAll = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const sort = query.sort || "-rating";
  const [items, total] = await Promise.all([
    Restaurant.find().sort(sort).skip(skip).limit(limit),
    Restaurant.countDocuments(),
  ]);

  return { items, total, page, limit };
};

exports.searchByName = (q = "") =>
  Restaurant.find({ name: { $regex: q, $options: "i" } }).sort("-rating");

exports.filter = async ({ area, cuisine, price, rating, style, menuItem, page, limit }) => {
  const filter = {};
  if (area) filter.area = area;
  if (cuisine) filter.cuisine = cuisine;
  if (price) filter.priceCategory = price;
  if (rating) filter.rating = { $gte: Number(rating) };
  if (style) filter.style = style;

  if (menuItem) {
    const menuMatches = await MenuItem.distinct("restaurant", {
      name: { $regex: menuItem, $options: "i" },
    });
    filter._id = { $in: menuMatches };
  }

  const pagination = getPagination({ page, limit });
  const [items, total] = await Promise.all([
    Restaurant.find(filter).sort("-rating").skip(pagination.skip).limit(pagination.limit),
    Restaurant.countDocuments(filter),
  ]);

  return { items, total, page: pagination.page, limit: pagination.limit };
};

exports.topRated = () => Restaurant.find().sort("-rating").limit(10);
exports.featured = () => Restaurant.find({ isFeatured: true }).sort("-rating").limit(10);
exports.recent = () => Restaurant.find().sort("-createdAt").limit(10);
`,
  "backend/src/repositories/menuRepository.js": `const MenuItem = require("../models/MenuItem");

exports.create = (data) => MenuItem.create(data);
exports.findByRestaurant = (restaurantId) => MenuItem.find({ restaurant: restaurantId, isAvailable: true });
exports.search = (q = "") =>
  MenuItem.find({ name: { $regex: q, $options: "i" } }).populate("restaurant", "name area rating image");
exports.update = (id, data) => MenuItem.findByIdAndUpdate(id, data, { new: true, runValidators: true });
exports.remove = (id) => MenuItem.findByIdAndDelete(id);
exports.count = () => MenuItem.countDocuments();
`,
  "backend/src/routes/authRoutes.js": `const router = require("express").Router();
const authController = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");
const { registerValidator, loginValidator, googleValidator } = require("../validators/authValidator");

router.post("/register", validate(registerValidator), authController.register);
router.post("/login", validate(loginValidator), authController.login);
router.post("/google", validate(googleValidator), authController.googleLogin);
router.get("/me", requireAuth, authController.me);
router.post("/logout", authController.logout);

module.exports = router;
`,
  "backend/src/routes/restaurantRoutes.js": `const router = require("express").Router();
const restaurantController = require("../controllers/restaurantController");

router.get("/", restaurantController.getAll);
router.get("/search", restaurantController.search);
router.get("/filter", restaurantController.filter);
router.get("/areas", restaurantController.areas);
router.get("/cuisines", restaurantController.cuisines);
router.get("/styles", restaurantController.styles);
router.get("/prices", restaurantController.prices);
router.get("/top-rated", restaurantController.topRated);
router.get("/featured", restaurantController.featured);
router.get("/recent", restaurantController.recent);
router.get("/:id", restaurantController.getById);

module.exports = router;
`,
  "backend/src/routes/menuRoutes.js": `const router = require("express").Router();
const menuController = require("../controllers/menuController");

router.get("/search", menuController.search);
router.get("/:restaurantId", menuController.getRestaurantMenu);

module.exports = router;
`,
  "backend/src/routes/adminRoutes.js": `const router = require("express").Router();
const adminRestaurantController = require("../controllers/adminRestaurantController");
const adminMenuController = require("../controllers/adminMenuController");
const { requireAuth } = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");
const validate = require("../middleware/validationMiddleware");
const { restaurantValidator } = require("../validators/restaurantValidator");
const { menuItemValidator } = require("../validators/menuValidator");

router.use(requireAuth, requireAdmin);

router.post("/restaurants", validate(restaurantValidator), adminRestaurantController.create);
router.put("/restaurants/:id", validate(restaurantValidator), adminRestaurantController.update);
router.delete("/restaurants/:id", adminRestaurantController.remove);
router.post("/menu", validate(menuItemValidator), adminMenuController.create);
router.put("/menu/:id", validate(menuItemValidator), adminMenuController.update);
router.delete("/menu/:id", adminMenuController.remove);
router.get("/stats/restaurants", adminRestaurantController.restaurantCount);
router.get("/stats/menu", adminMenuController.menuCount);
router.get("/stats/users", adminMenuController.userCount);

module.exports = router;
`,
  "backend/src/middleware/authMiddleware.js": `const jwt = require("jsonwebtoken");
const env = require("../config/env");
const userRepository = require("../repositories/userRepository");
const ApiError = require("../utils/ApiError");

exports.requireAuth = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) throw new ApiError(401, "Authentication required");

    const payload = jwt.verify(token, env.jwtSecret);
    const user = await userRepository.findById(payload.id);
    if (!user) throw new ApiError(401, "Invalid authentication token");

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
`,
  "backend/src/middleware/adminMiddleware.js": `const ApiError = require("../utils/ApiError");
const { ROLES } = require("../constants/roles");

module.exports = (req, _res, next) => {
  if (req.user?.role !== ROLES.ADMIN) {
    return next(new ApiError(403, "Admin access required"));
  }

  next();
};
`,
  "backend/src/middleware/errorMiddleware.js": `module.exports = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error",
  });
};
`,
  "backend/src/middleware/validationMiddleware.js": `const ApiError = require("../utils/ApiError");

module.exports = (schema) => (req, _res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return next(new ApiError(400, error.details.map((detail) => detail.message).join(", ")));
  }

  req.body = value;
  next();
};
`,
  "backend/src/validators/authValidator.js": `const Joi = require("joi");

exports.registerValidator = Joi.object({
  name: Joi.string().min(2).max(80).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

exports.loginValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.googleValidator = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  googleId: Joi.string().required(),
  avatar: Joi.string().uri().allow("", null),
});
`,
  "backend/src/validators/restaurantValidator.js": `const Joi = require("joi");
const { CUISINES } = require("../constants/cuisines");
const { PRICE_CATEGORIES } = require("../constants/priceCategories");
const { RESTAURANT_STYLES } = require("../constants/restaurantStyles");

exports.restaurantValidator = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  area: Joi.string().min(2).max(80).required(),
  cuisine: Joi.array().items(Joi.string().valid(...CUISINES)).min(1).required(),
  priceCategory: Joi.string().valid(...PRICE_CATEGORIES).required(),
  rating: Joi.number().min(0).max(10).default(0),
  style: Joi.string().valid(...RESTAURANT_STYLES).required(),
  description: Joi.string().allow("", null),
  image: Joi.string().allow("", null),
  isFeatured: Joi.boolean().default(false),
});
`,
  "backend/src/validators/menuValidator.js": `const Joi = require("joi");

exports.menuItemValidator = Joi.object({
  restaurant: Joi.string().hex().length(24).required(),
  name: Joi.string().min(2).max(120).required(),
  description: Joi.string().allow("", null),
  price: Joi.number().min(0).required(),
  category: Joi.string().allow("", null),
  image: Joi.string().allow("", null),
  isAvailable: Joi.boolean().default(true),
});
`,
  "backend/src/utils/generateToken.js": `const jwt = require("jsonwebtoken");
const env = require("../config/env");

module.exports = (user) =>
  jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
`,
  "backend/src/utils/pagination.js": `exports.getPagination = ({ page = 1, limit = 12 } = {}) => {
  const normalizedPage = Math.max(Number(page) || 1, 1);
  const normalizedLimit = Math.min(Math.max(Number(limit) || 12, 1), 100);

  return {
    page: normalizedPage,
    limit: normalizedLimit,
    skip: (normalizedPage - 1) * normalizedLimit,
  };
};
`,
  "backend/src/utils/responseHandler.js": `exports.ok = (res, data) => res.status(200).json({ success: true, data });
exports.created = (res, data) => res.status(201).json({ success: true, data });
`,
  "backend/src/utils/ApiError.js": `class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ApiError;
`,
  "backend/src/constants/roles.js": `exports.ROLES = {
  USER: "user",
  ADMIN: "admin",
};
`,
  "backend/src/constants/cuisines.js": `exports.CUISINES = ["Indian", "Chinese", "Italian", "Fast Food"];
`,
  "backend/src/constants/restaurantStyles.js": `exports.RESTAURANT_STYLES = ["Cafe", "Buffet", "Fine Dining", "Bakery", "Dessert"];
`,
  "backend/src/constants/priceCategories.js": `exports.PRICE_CATEGORIES = ["Budget", "Mid", "Premium"];
`,
  "backend/docs/swagger.yaml": `openapi: 3.0.3
info:
  title: FAATTSOO Restaurant Discovery API
  version: 1.0.0
paths:
  /api/auth/register:
    post:
      summary: Register user
  /api/auth/login:
    post:
      summary: Login user
  /api/restaurants:
    get:
      summary: Get restaurants
  /api/restaurants/filter:
    get:
      summary: Filter restaurants
  /api/menu/{restaurantId}:
    get:
      summary: Get restaurant menu
`,
  "backend/src/app.js": `const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const passport = require("./config/passport");
const authRoutes = require("./routes/authRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const menuRoutes = require("./routes/menuRoutes");
const adminRoutes = require("./routes/adminRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(passport.initialize());
app.use("/uploads", express.static("uploads"));

app.get("/health", (_req, res) => res.json({ success: true, message: "API is healthy" }));
app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/admin", adminRoutes);
app.use(errorMiddleware);

module.exports = app;
`,
  "backend/src/server.js": `const app = require("./app");
const connectDB = require("./config/db");
const env = require("./config/env");

const startServer = async () => {
  await connectDB();
  app.listen(env.port, () => {
    console.log(\`Server running on port \${env.port}\`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
`,
  "backend/.env": `PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/faattsoo
JWT_SECRET=change-this-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
`,
  "backend/.gitignore": `node_modules
.env.local
uploads/*
!uploads/restaurants/
!uploads/menu/
`,
  "backend/package.json": `{
  "name": "faattsoo-restaurant-discovery-api",
  "version": "1.0.0",
  "description": "Restaurant discovery API using Express and MongoDB.",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "helmet": "^8.0.0",
    "joi": "^17.13.3",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.9.5",
    "morgan": "^1.10.0",
    "passport": "^0.7.0",
    "passport-google-oauth20": "^2.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  }
}
`,
  "backend/README.md": `# FAATTSOO Restaurant Discovery API

Express and MongoDB backend for restaurant discovery, filters, menu search, authentication, and admin CRUD.

## Setup

\`\`\`bash
npm install
npm run dev
\`\`\`

Copy or edit \`.env\` before running in a real environment.
`,
};

function ensureDirectory(relativePath) {
  fs.mkdirSync(path.join(root, relativePath), { recursive: true });
}

function writeFileIfMissing(relativePath, content) {
  const target = path.join(root, relativePath);
  if (fs.existsSync(target)) {
    return false;
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, "utf8");
  return true;
}

for (const directory of directories) {
  ensureDirectory(directory);
}

let created = 0;
let skipped = 0;

for (const [file, content] of Object.entries(files)) {
  if (writeFileIfMissing(file, content)) {
    created += 1;
  } else {
    skipped += 1;
  }
}

console.log(`Generated backend scaffold in: ${backendRoot}`);
console.log(`Created ${created} files, skipped ${skipped} existing files.`);
