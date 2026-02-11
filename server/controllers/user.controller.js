import {
  registerUserService,
  loginUserService,
  getUserDataService,
  getCarsService,
} from "../services/user.service.js";

// Register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const token = await registerUserService(name, email, password);

    res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const token = await loginUserService(email, password);

    res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get User
export const getUserData = async (req, res) => {
  try {
    const user = await getUserDataService(req.user);
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Cars
export const getCars = async (req, res) => {
  try {
    const cars = await getCarsService();
    res.json({ success: true, cars });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
