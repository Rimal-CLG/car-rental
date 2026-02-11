import express from "express";
import {
  changeBookingStatus,
  checkAvailabilityOfCar,
  createBooking,
  getOwnerBookings,
  getUserBookings,
} from "../controllers/booking.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const bookingRouter = express.Router();

bookingRouter.post("/check-availability", checkAvailabilityOfCar);
bookingRouter.post("/create", auth, createBooking);
bookingRouter.get("/user", auth, getUserBookings);
bookingRouter.get("/owner", auth, getOwnerBookings);
bookingRouter.post("/change-status", auth, changeBookingStatus);

export default bookingRouter;
