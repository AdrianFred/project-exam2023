import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaStar, FaCheck, FaTimes } from "react-icons/fa";
import MediaGallery from "./MediaGallery";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";

const VenueDetails = ({ venue, bookings }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const router = useRouter();

  const isDateAvailable = (date) => {
    const isAvailable = !bookings.some((booking) => {
      const bookingDateFrom = new Date(booking.dateFrom);
      const bookingDateTo = new Date(booking.dateTo);
      return date >= bookingDateFrom && date <= bookingDateTo;
    });
    return isAvailable;
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate && date > endDate) {
      setEndDate(null);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleGuestsChange = (event) => {
    const updatedGuests = parseInt(event.target.value);
    if (updatedGuests <= venue.maxGuests) {
      setGuests(updatedGuests);
    }
  };

  async function handleBookClick() {
    // Make API call to book the selected dates
    if (startDate && endDate) {
      const res = await fetch("https://api.noroff.dev/api/v1/holidaze/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          venueId: venue.id,
          dateFrom: startDate,
          dateTo: endDate,
          guests,
        }),
      });
      const data = await res.json();

      if (data.id) {
        toast.success("Booking successful!");
        router.push("/profile");
      }
    } else {
      toast.error(data.status);
    }
  }

  const calculateNumberOfDays = (start, end) => {
    const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const diffDays = Math.round(Math.abs((end - start) / oneDay));
    return diffDays + 1; // Add 1 to include both start and end dates
  };

  const calculateTotalPrice = (start, end) => {
    const numberOfDays = calculateNumberOfDays(start, end);
    return numberOfDays * venue.price;
  };

  return (
    <div className="flex justify-around items-center mt-8 mb-24 w-[400px]">
      <div className="bg-white rounded shadow min-w-[800px]">
        <div className="h-[300px] w-[80%] mx-auto py-12 sm:h-[350px] md:h-[400px] lg:h-[500px] 2xl:w-[90%] 2xl:h-[600px]">
          <MediaGallery media={venue.media} />
        </div>
        <div className="mx-auto w-[80%]">
          <h1 className="text-2xl font-bold mb-4">{venue.name}</h1>
          <p className="text-gray-600 break-words max-w-[95%]">{venue.description}</p>
          <div className="flex items-center mt-2">
            {venue.rating > 0 ? (
              <>
                {Array.from({ length: Math.round(venue.rating) }, (_, index) => (
                  <FaStar key={index} className="text-yellow-500 mr-1" />
                ))}
                <span className="text-gray-600">({venue.rating.toFixed(1)})</span>
              </>
            ) : (
              <span className="text-gray-600">Rating: ({venue.rating.toFixed(1)})</span>
            )}
          </div>

          <div className="mb-4">
            <p className="text-gray-600">Price: ${venue.price}</p>
            <p className="text-gray-600">
              Last Updated:{" "}
              {new Date(venue.updated).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "numeric", day: "numeric" })}
            </p>
          </div>

          <div className="mb-4">
            <p className="text-gray-600">Select Dates:</p>
            <div className="flex">
              <div className="mr-2">
                <p className="text-gray-600">Check-in:</p>
                <DatePicker
                  selected={startDate}
                  onChange={handleStartDateChange}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  minDate={new Date()}
                  filterDate={isDateAvailable}
                  dateFormat="yyyy-MM-dd"
                  isClearable
                  className="border-2 border-grey-500 rounded"
                />
              </div>
              <div>
                <p className="text-gray-600">Check-out:</p>
                <DatePicker
                  selected={endDate}
                  onChange={handleEndDateChange}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  filterDate={isDateAvailable}
                  dateFormat="yyyy-MM-dd"
                  isClearable
                  className="border-2 border-grey-500 rounded"
                />
              </div>
            </div>

            {startDate && endDate && !isDateAvailable(startDate) && !isDateAvailable(endDate) && (
              <p className="text-red-500">The selected dates are not available.</p>
            )}

            <div className="mt-4">
              <label className="text-gray-600">Guests:</label>
              <input type="number" value={guests} min={1} onChange={handleGuestsChange} className="border-2 border-gray-500 rounded px-2 py-1 ml-2" />
            </div>

            {startDate && endDate && isDateAvailable(startDate) && isDateAvailable(endDate) && (
              <div className="mt-4">
                <p className="text-gray-600">
                  Selected Dates: {startDate.toDateString()} - {endDate.toDateString()}
                </p>
                <p className="text-gray-600">Number of Days: {calculateNumberOfDays(startDate, endDate)}</p>
                <p className="text-gray-600">Total Price: ${calculateTotalPrice(startDate, endDate)}</p>
                <p className="text-gray-600">Number of Guests: {guests}</p>
              </div>
            )}

            <button
              onClick={handleBookClick}
              disabled={!startDate || !endDate || !isDateAvailable(startDate) || !isDateAvailable(endDate)}
              className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
            >
              Book Now
            </button>
          </div>
          <div className="flex mt-4">
            <div className="flex items-center my-4">
              {venue.meta.wifi ? <FaCheck className="text-green-500 mr-1" /> : <FaTimes className="text-red-500 line-through mr-1" />}
              <p className="text-gray-600">WiFi</p>
            </div>
            <div className="flex items-center mr-4">
              {venue.meta.parking ? <FaCheck className="text-green-500 mr-1" /> : <FaTimes className="text-red-500 line-through mr-1" />}
              <p className="text-gray-600">Parking</p>
            </div>
            <div className="flex items-center mr-4">
              {venue.meta.breakfast ? <FaCheck className="text-green-500 mr-1" /> : <FaTimes className="text-red-500 line-through mr-1" />}
              <p className="text-gray-600">Breakfast</p>
            </div>
            <div className="flex items-center mr-4">
              {venue.meta.pets ? <FaCheck className="text-green-500 mr-1" /> : <FaTimes className="text-red-500 line-through mr-1" />}
              <p className="text-gray-600">Pets</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;
