import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaStar, FaCheck, FaTimes } from "react-icons/fa";
import MediaGallery from "./MediaGallery";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import { BsFillLightningChargeFill } from "react-icons/bs";

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
      } else {
        toast.error(data.status);
      }
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
    <div className="w-[95%] sm:w-[70%] max-w-[950px] shadow-2xl rounded-3xl">
      <div>
        <div className="">
          <div className="flex justify-center items-center gap-1 pt-6">
            <BsFillLightningChargeFill size={20} className="text-red" />
            <h1 className="text-lg font-semibold">{venue.name}</h1>
          </div>
          <div className="h-[300px] w-[80%] mx-auto sm:h-[350px] md:h-[400px] lg:h-[500px] 2xl:w-[100%] 2xl:h-[600px] pt-6">
            <MediaGallery media={venue.media} />
          </div>
          <div className="w-[80%] max-w-[800px]  pt-12 pb-8 px-4 mx-auto">
            <div className="w-full sm:w-1/2 pt-12">
              <h1 className="text-3xl font-bold">{venue.name}</h1>
              <p className="text-xl">{venue.address}</p>
              <p className="text-xl">{venue.description}</p>
              <div className="flex items-center mt-4">
                <div className="flex items-center mr-4">
                  {venue.meta.wifi ? <span className="text-green-500 mr-1">✓</span> : <span className="text-red-500 mr-1">✕</span>}
                  <p className="text-gray-600">WiFi</p>
                </div>
                <div className="flex items-center mr-4">
                  {venue.meta.parking ? <span className="text-green-500 mr-1">✓</span> : <span className="text-red-500 mr-1">✕</span>}
                  <p className="text-gray-600">Parking</p>
                </div>
                <div className="flex items-center mr-4">
                  {venue.meta.breakfast ? <span className="text-green-500 mr-1">✓</span> : <span className="text-red-500 mr-1">✕</span>}
                  <p className="text-gray-600">Breakfast</p>
                </div>
                <div className="flex items-center mr-4">
                  {venue.meta.pets ? <span className="text-green-500 mr-1">✓</span> : <span className="text-red-500 mr-1">✕</span>}
                  <p className="text-gray-600">Pets</p>
                </div>
              </div>
              <div className="mt-4">
                <label className="text-gray-600">Guests:</label>
                <input
                  type="number"
                  value={guests}
                  min={1}
                  max={venue.maxGuests}
                  onChange={handleGuestsChange}
                  className="border-2 border-gray-500 rounded px-2 py-1 ml-2"
                />
              </div>
            </div>
            <div className="mt-4">
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
                <p className="text-red-500">Selected dates are not available.</p>
              )}
            </div>
            <div className="mt-4">
              <button
                onClick={handleBookClick}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                disabled={!startDate || !endDate || !isDateAvailable(startDate) || !isDateAvailable(endDate)}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;
