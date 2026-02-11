import {
  checkCarAvailabilityService,
  createBookingService,
  getUserBookingsService,
  getOwnerBookingsService,
  changeBookingStatusService,
} from "../services/booking.service.js";

// Check availability
export const checkAvailabilityOfCar = async (req, res) => {
  try {
    const { location, pickupDate, returnDate } = req.body;

    const availableCars = await checkCarAvailabilityService(
      location,
      pickupDate,
      returnDate,
    );

    res.json({ success: true, availableCars });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Create booking
export const createBooking = async (req, res) => {
  try {
    const { car, pickupDate, returnDate } = req.body;

    const url = await createBookingService(
      car,
      pickupDate,
      returnDate,
      req.user._id,
      process.env.FRONTEND_URL,
    );

    res.json({ success: true, url });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get user bookings
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await getUserBookingsService(req.user._id);
    res.json({ success: true, bookings });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get owner bookings
export const getOwnerBookings = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const bookings = await getOwnerBookingsService(req.user._id);

    res.json({ success: true, bookings });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Change status
export const changeBookingStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;

    await changeBookingStatusService(bookingId, req.user._id, status);

    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
