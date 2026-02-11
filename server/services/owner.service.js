import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";

// Change role
export const changeRoleToOwnerService = async (userId) => {
  await User.findByIdAndUpdate(userId, { role: "owner" });
  return true;
};

// Add car
export const addCarService = async (carData, ownerId, imageUrl) => {
  await Car.create({
    ...carData,
    owner: ownerId,
    image: imageUrl,
  });
  return true;
};

// Get owner cars
export const getOwnerCarsService = async (ownerId) => {
  return await Car.find({ owner: ownerId });
};

// Toggle availability
export const toggleCarAvailabilityService = async (carId, ownerId) => {
  const car = await Car.findById(carId);

  if (!car) throw new Error("Car not found");

  if (car.owner.toString() !== ownerId.toString()) {
    throw new Error("Unauthorized");
  }

  car.isAvaliable = !car.isAvaliable;
  await car.save();

  return true;
};

// Delete car
export const deleteCarService = async (carId, ownerId) => {
  const car = await Car.findById(carId);

  if (!car) throw new Error("Car not found");

  if (car.owner.toString() !== ownerId.toString()) {
    throw new Error("Unauthorized");
  }

  car.owner = null;
  car.isAvaliable = false;

  await car.save();

  return true;
};

// Dashboard
export const getDashboardDataService = async (ownerId) => {
  const cars = await Car.find({ owner: ownerId });

  const bookings = await Booking.find({ owner: ownerId })
    .populate("car")
    .sort({ createdAt: -1 });

  const pendingBookings = bookings.filter(
    (b) => b.status === "pending"
  );

  const completedBookings = bookings.filter(
    (b) => b.status === "confirmed"
  );

  const monthlyRevenue = completedBookings.reduce(
    (acc, booking) => acc + booking.price,
    0
  );

  return {
    totalCars: cars.length,
    totalBookings: bookings.length,
    pendingBookings: pendingBookings.length,
    completedBookings: completedBookings.length,
    recentBookings: bookings.slice(0, 3),
    monthlyRevenue,
  };
};
