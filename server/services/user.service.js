import User from "../models/User.js";
import Car from "../models/Car.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, // ✅ better payload structure
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Register Service
export const registerUserService = async (name, email, password) => {
  if (!name || !email || !password || password.length < 8) {
    throw new Error("Fill all the fields properly");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = generateToken(user._id.toString());

  return token;
};

// Login Service
export const loginUserService = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user._id.toString());

  return token;
};

// Get User Service
export const getUserDataService = async (user) => {
  return user;
};

// Get Cars Service
export const getCarsService = async () => {
  return await Car.find({ isAvaliable: true });
};
