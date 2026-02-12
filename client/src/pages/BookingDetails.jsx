import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { axios, currency } = useAppContext();

  const [booking, setBooking] = useState(null);

  const fetchBooking = async () => {
    try {
      const { data } = await axios.get("/api/bookings/user");
      if (data.success) {
        const selected = data.bookings.find((b) => b._id === id);
        setBooking(selected);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, []);

  if (!booking) return <div className="mt-20 text-center">Loading...</div>;

  const rentalDays =
    (new Date(booking.returnDate) - new Date(booking.pickupDate)) /
    (1000 * 60 * 60 * 24);

  const oneDayPrice = booking.price / rentalDays;

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16 max-w-6xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-8 text-primary hover:underline"
      >
        ← Back to My Bookings
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8 border border-borderColor rounded-xl shadow-sm bg-white">
        {/* Left Side - Image */}
        <div className="rounded-lg overflow-hidden">
          <img
            src={booking.car.image}
            alt=""
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Right Side - Details */}
        <div className="flex flex-col justify-between">
          {/* Car Info */}
          <div>
            <h2 className="text-3xl font-semibold text-primary">
              {booking.car.brand} {booking.car.model}
            </h2>

            <p className="text-gray-500 mt-2">
              {booking.car.year} • {booking.car.category} •{" "}
              {booking.car.location}
            </p>

            {/* Status Badge */}
            <div className="mt-4">
              <span
                className={`px-4 py-1 text-sm rounded-full font-medium ${
                  booking.status === "confirmed"
                    ? "bg-green-100 text-green-600"
                    : booking.status === "pending"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                }`}
              >
                {booking.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Booking Details */}
          <div className="mt-8 space-y-4 text-base">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Booking Date</span>
              <span>{booking.createdAt.split("T")[0]}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Rental Period</span>
              <span>
                {booking.pickupDate.split("T")[0]} →{" "}
                {booking.returnDate.split("T")[0]}
              </span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Pickup Location</span>
              <span>{booking.car.location}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">One Day Price</span>
              <span>
                {currency}
                {oneDayPrice}
              </span>
            </div>

            <div className="flex justify-between text-lg font-semibold text-primary pt-4">
              <span>Total Price</span>
              <span>
                {currency}
                {booking.price}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
