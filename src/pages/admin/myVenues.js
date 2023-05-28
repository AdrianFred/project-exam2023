import { useState, useEffect } from "react";
import Link from "next/link";

export default function MyVenues() {
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [showBookingsModal, setShowBookingsModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const name = localStorage.getItem("name");
    const token = localStorage.getItem("token");

    async function fetchVenues() {
      try {
        const response = await fetch(`https://api.noroff.dev/api/v1/holidaze/profiles/${name}/venues?_bookings=true`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: undefined,
        });

        if (!response.ok) {
          throw new Error("Something went wrong");
        }

        const data = await response.json();
        setVenues(data);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching venues:", error);
        setLoading(false);
      }
    }

    fetchVenues();
  }, []);

  const handleDeleteVenue = async (venueId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`https://api.noroff.dev/api/v1/holidaze/venues/${venueId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setVenues((prevVenues) => prevVenues.filter((venue) => venue.id !== venueId));
      }
    } catch (error) {
      console.log("Error deleting venue:", error);
    }
  };

  const handleEditVenue = (venueId) => {
    // Implement your logic for handling the "Edit Venue" functionality
  };

  const handleViewBookings = (venueId) => {
    // Find the selected venue by ID
    const selectedVenue = venues.find((venue) => venue.id === venueId);
    setSelectedVenue(selectedVenue);
    setShowBookingsModal(true);
  };

  const closeModal = () => {
    setShowBookingsModal(false);
  };

  return (
    <div className="container mx-auto p-4 my-24">
      <h1 className="text-2xl font-bold mb-4">My Venues ({venues.length})</h1>
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="border-t-4 border-b-4 border-gray-500 rounded-full w-12 h-12 animate-spin"></div>
          <p className="ml-2">Loading...</p>
        </div>
      ) : venues.length > 0 ? (
        <ul className="space-y-4">
          {venues.map((venue) => (
            <li key={venue.id} className="bg-gray-100 p-4 rounded max-w-xl mx-auto">
              <div className="flex items-center mb-2">
                <img src={venue.media[0]} alt="Venue" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h2 className="text-lg font-semibold break-words line-clamp-2">{venue.name}</h2>
                  <p className="break-words line-clamp-1">{venue.description}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <Link href={`/venue/${venue.id}`} className="bg-blue-500 text-white py-2 px-4 rounded text-center">
                  View
                </Link>
                <Link href={`/admin/edit/${venue.id}`} className="bg-blue-500 text-white py-2 px-4 rounded text-center">
                  Edit
                </Link>
                <button onClick={() => handleDeleteVenue(venue.id)} className="bg-red-500 text-white py-2 px-4 rounded">
                  Delete
                </button>
                <button onClick={() => handleViewBookings(venue.id)} className="bg-green-500 text-white py-2 px-4 rounded">
                  View Upcoming Bookings
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no venues with Holidaze.</p>
      )}

      {showBookingsModal && selectedVenue && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-h-[500px] overflow-y-auto">
            <div className="flex justify-end">
              <button onClick={closeModal} className="text-gray-600 text-lg focus:outline-none">
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <h2 className="text-lg font-semibold mb-4 break-words max-w-[400px] line-clamp-1">Upcoming Bookings for Venue: {selectedVenue.name}</h2>
            {selectedVenue.bookings.length > 0 ? (
              <ul className="space-y-2">
                {selectedVenue.bookings
                  .sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom))
                  .map((booking) => (
                    <li className="border-b pb-4" key={booking.id}>
                      <p>Date From: {new Date(booking.dateFrom).toLocaleDateString()}</p>
                      <p>Date To: {new Date(booking.dateTo).toLocaleDateString()}</p>
                      <p>Guests: {booking.guests}</p>
                    </li>
                  ))}
              </ul>
            ) : (
              <p>No bookings yet.</p>
            )}
            <button onClick={closeModal} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
