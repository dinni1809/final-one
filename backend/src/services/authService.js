const userRepository = require("../repositories/userRepository");
const ApiError = require("../utils/ApiError");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");
const emailService = require("./emailService");

const sanitizeUser = (user) => {
  if (!user) return user;
  const payload = user.toObject ? user.toObject() : { ...user };
  delete payload.password;
  delete payload.verificationToken;
  delete payload.verificationExpires;
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

  const token = crypto.randomBytes(32).toString("hex");
  const createdUser = await userRepository.create({
    name,
    username: normalizedUsername,
    email: normalizedEmail,
    password,
    isVerified: false,
    verificationToken: token,
    verificationExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  });

  try {
    await emailService.sendVerificationEmail(createdUser, token);
  } catch (emailError) {
    console.error("Failed to send verification email:", emailError);
  }

  const user = sanitizeUser(createdUser);
  return { user };
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

  if (!user.isVerified) {
    throw new ApiError(403, "Please verify your email before logging in.");
  }

  const sanitized = sanitizeUser(user);
  return { user: sanitized, token: generateToken(user) };
};

exports.verifyEmail = async (token) => {
  if (!token) throw new ApiError(400, "Verification token is required");

  const user = await userRepository.findByVerificationToken(token);
  if (!user) {
    throw new ApiError(400, "Verification link is invalid or has expired");
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationExpires = undefined;
  await user.save();

  return sanitizeUser(user);
};

exports.resendVerification = async (identifier) => {
  const lookup = (identifier || "").trim();
  if (!lookup) throw new ApiError(400, "Email or username is required");

  const user = await userRepository.findByIdentifierWithPassword(lookup);
  if (!user) {
    throw new ApiError(404, "Account not found");
  }

  if (user.isVerified) {
    throw new ApiError(400, "Account is already verified");
  }

  const token = crypto.randomBytes(32).toString("hex");
  user.verificationToken = token;
  user.verificationExpires = Date.now() + 24 * 60 * 60 * 1000;
  await user.save();

  await emailService.sendVerificationEmail(user, token);
  return { success: true, message: "Verification email resent successfully" };
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
