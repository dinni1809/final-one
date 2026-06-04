const userRepository = require("../repositories/userRepository");
const ApiError = require("../utils/ApiError");
const generateToken = require("../utils/generateToken");

const sanitizeUser = (user) => {
  if (!user) return user;
  const payload = user.toObject ? user.toObject() : { ...user };
  delete payload.password;
  return payload;
};

exports.register = async ({ name, username, email, password }) => {
  const normalizedEmail = email.toLowerCase();
  const normalizedUsername = username.trim().toLowerCase();

  const existingEmail = await userRepository.findByEmail(normalizedEmail);
  if (existingEmail) throw new ApiError(409, "Email already registered");

  const existingUsername =
    await userRepository.findByUsername(normalizedUsername);
  if (existingUsername) throw new ApiError(409, "Username already exists");

  const createdUser = await userRepository.create({
    name,
    username: normalizedUsername,
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
  if (!user) {
    throw new ApiError(404, "Account not found");
  }

  if (!(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid password");
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
