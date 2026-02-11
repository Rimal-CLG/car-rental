import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import { stripe } from "../configs/stripe.js";

// Check car availability
export const checkCarAvailabilityService = async (
  location,
  pickupDate,
  returnDate,
) => {
  const cars = await Car.find({ location, isAvaliable: true });

  const availableCarsPromises = cars.map(async (car) => {
    const bookings = await Booking.find({
      car: car._id,
      pickupDate: { $lte: returnDate },
      returnDate: { $gte: pickupDate },
    });

    return bookings.length === 0 ? car : null;
  });

  const results = await Promise.all(availableCarsPromises);

  return results.filter((car) => car !== null);
};

// Create booking + stripe session
export const createBookingService = async (
  carId,
  pickupDate,
  returnDate,
  userId,
  frontendUrl,
) => {
  const carData = await Car.findById(carId);
  if (!carData) throw new Error("Car not found");

  const days =
    (new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24);

  if (days <= 0) throw new Error("Invalid dates");

  const totalAmount = days * carData.pricePerDay;

  const booking = await Booking.create({
    car: carId,
    user: userId,
    owner: carData.owner,
    pickupDate,
    returnDate,
    price: totalAmount,
    status: "pending",
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: `${carData.brand} ${carData.model}`,
          },
          unit_amount: totalAmount * 100,
        },
        quantity: 1,
      },
    ],
    success_url: `${frontendUrl}my-bookings`,
    cancel_url: `${frontendUrl}my-bookings/${booking._id}`,
    metadata: {
      bookingId: booking._id.toString(),
    },
  });

  return session.url;
};

// Get user bookings
export const getUserBookingsService = async (userId) => {
  return await Booking.find({ user: userId })
    .populate("car")
    .sort({ createdAt: -1 });
};

// Get owner bookings
export const getOwnerBookingsService = async (ownerId) => {
  return await Booking.find({ owner: ownerId })
    .populate("car user")
    .select("-user.password")
    .sort({ createdAt: -1 });
};

// Change booking status
export const changeBookingStatusService = async (
  bookingId,
  ownerId,
  status,
) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) throw new Error("Booking not found");

  if (booking.owner.toString() !== ownerId.toString()) {
    throw new Error("Unauthorized");
  }

  booking.status = status;
  await booking.save();

  return true;
};
