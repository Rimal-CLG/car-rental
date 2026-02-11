import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import { addCar, changeRoleToOwner, deleteCar, getDashboardData, getOwnerCars, toggleCarAvailability, updateUserImage } from "../controllers/owner.controller.js";
import upload from "../middleware/multer.middleware.js";

const ownerRouter = express.Router();

ownerRouter.post("/change-role", auth, changeRoleToOwner)
ownerRouter.post("/add-car", upload.single("image"), auth, addCar)
ownerRouter.get("/cars", auth, getOwnerCars)
ownerRouter.post("/toggle-car", auth, toggleCarAvailability)
ownerRouter.post("/delete-car", auth, deleteCar)

ownerRouter.get('/dashboard', auth, getDashboardData)
ownerRouter.post('/update-image', upload.single("image"), auth, updateUserImage)

export default ownerRouter;