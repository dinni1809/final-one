const userRepository = require("../repositories/userRepository");
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
