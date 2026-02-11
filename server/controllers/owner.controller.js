import {
  changeRoleToOwnerService,
  addCarService,
  getOwnerCarsService,
  toggleCarAvailabilityService,
  deleteCarService,
  getDashboardDataService,
} from "../services/owner.service.js";

import { uploadImageService } from "../services/image.service.js";

// Change Role
export const changeRoleToOwner = async (req, res) => {
  try {
    await changeRoleToOwnerService(req.user._id);
    res.json({ success: true, message: "Now you can list cars" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Add Car
export const addCar = async (req, res) => {
  try {
    const car = JSON.parse(req.body.carData);
    const imageUrl = await uploadImageService(req.file, "/cars", 1280);

    await addCarService(car, req.user._id, imageUrl);

    res.json({ success: true, message: "Car Added" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Owner Cars
export const getOwnerCars = async (req, res) => {
  try {
    const cars = await getOwnerCarsService(req.user._id);
    res.json({ success: true, cars });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Toggle
export const toggleCarAvailability = async (req, res) => {
  try {
    await toggleCarAvailabilityService(req.body.carId, req.user._id);

    res.json({ success: true, message: "Availability Toggled" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Delete
export const deleteCar = async (req, res) => {
  try {
    await deleteCarService(req.body.carId, req.user._id);

    res.json({ success: true, message: "Car Removed" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Dashboard
export const getDashboardData = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const dashboardData = await getDashboardDataService(req.user._id);

    res.json({ success: true, dashboardData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update User Image
export const updateUserImage = async (req, res) => {
  try {
    const imageUrl = await uploadImageService(req.file, "/users", 400);

    await User.findByIdAndUpdate(req.user._id, {
      image: imageUrl,
    });

    res.json({ success: true, message: "Image Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
