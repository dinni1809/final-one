const userRepository = require("../repositories/userRepository");
const ApiError = require("../utils/ApiError");
const generateToken = require("../utils/generateToken");

const sanitizeUser = (user) => {
  if (!user) return user;
  const payload = user.toObject ? user.toObject() : { ...user };
  delete payload.password;
  return payload;
};

exports.register = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase();
  const existingUser = await userRepository.findByEmail(normalizedEmail);
  if (existingUser) throw new ApiError(409, "Email already registered");

  const createdUser = await userRepository.create({
    name,
    email: normalizedEmail,
    password,
  });
  const user = sanitizeUser(createdUser);
  return { user, token: generateToken(createdUser) };
};

exports.login = async ({ identifier, email, password }) => {
  const lookup = (identifier || email || "").trim();
  if (!lookup) throw new ApiError(400, "Identifier or email is required");

  const user = await userRepository.findByIdentifierWithPassword(lookup);
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email, username, or password");
  }

  const sanitized = sanitizeUser(user);
  return { user: sanitized, token: generateToken(user) };
};

exports.updateProfile = async (userId, profileData) => {
  if (profileData.email) {
    const normalizedEmail = profileData.email.toLowerCase();
    const existingUser = await userRepository.findByEmail(normalizedEmail);
    if (existingUser && existingUser._id.toString() !== userId.toString()) {
      throw new ApiError(409, "Email already registered");
    }
    profileData.email = normalizedEmail;
  }

  const user = await userRepository.updateProfile(userId, profileData);
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

exports.googleLogin = async ({ name, email, googleId, avatar }) => {
  const normalizedEmail = email.toLowerCase();
  const user = await userRepository.upsertGoogleUser({
    name,
    email: normalizedEmail,
    googleId,
    avatar,
  });
  return { user: sanitizeUser(user), token: generateToken(user) };
};
