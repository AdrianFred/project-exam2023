import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Link from "next/link";
import Head from "next/head";

const Profile = () => {
  const [avatar, setAvatar] = useState("");
  const [isVenueManager, setIsVenueManager] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;
  const router = useRouter();

  const handleAvatarChange = (e) => {
    const imageUrl = e.target.value;
    setAvatar(imageUrl);
  };

  const handleVenueManagerChange = (e) => {
    setIsVenueManager(e.target.checked);
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
    } else {
      async function fetchData() {
        const res = await fetch(`https://api.noroff.dev/api/v1/holidaze/profiles/${localStorage.getItem("name")}?_bookings=true`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: undefined,
        });
        const data = await res.json();
        setUserInfo(data);
        setIsVenueManager(data.venueManager);
        const sortedBookings = data.bookings.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
        setBookings(sortedBookings);
      }
      fetchData();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    async function updateProfile() {
      const res = await fetch(`https://api.noroff.dev/api/v1/holidaze/profiles/${localStorage.getItem("name")}/media`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          avatar: avatar,
        }),
      });
      const data = await res.json();
      if (data.avatar === avatar) {
        toast.success("Profile updated successfully");
      } else {
        toast.error("Something went wrong");
      }
    }

    async function updateVenueManager() {
      const res = await fetch(`https://api.noroff.dev/api/v1/holidaze/profiles/${localStorage.getItem("name")}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          venueManager: isVenueManager,
        }),
      });
      const data = await res.json();
      if (data.venueManager === isVenueManager) {
        localStorage.setItem("venueManager", isVenueManager);
      } else {
        toast.error("Something went wrong");
      }
    }
    updateProfile();
    updateVenueManager();
    setTimeout(() => {
      router.reload();
    }, 3000);
  };

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const previousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = indexOfLastBooking >= bookings.length;

  return (
    <>
      <Head>
        <title>Holidaze | Profile</title>
        <meta name="description" content="Holidaze profile page" />
      </Head>
      <div className="my-24">
        <div className="mx-auto mt-8 p-4 bg-white rounded shadow-xl w-[90%] max-w-[600px]">
          <h1 className="text-2xl font-bold mb-4">Profile</h1>
          <div className="grid sm:flex sm:justify-between sm:items-center ">
            <div>
              <div className="mb-2">
                <label className="block font-medium">Name:</label>
                <p className="text-lg font-semibold">{userInfo.name}</p>
              </div>
              <div className="mb-2">
                <label className="block font-medium">Email:</label>
                <p className="text-lg font-semibold">{userInfo.email}</p>
              </div>
            </div>
            <div className="">
              {userInfo.avatar ? (
                <img src={userInfo.avatar} alt="Current Avatar" className="w-24 h-24 object-cover rounded border-2 " />
              ) : (
                <span className="text-gray-500">No avatar selected</span>
              )}
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block font-medium mb-2">Avatar URL:</label>
              <input
                required
                type="text"
                placeholder={userInfo.avatar}
                onChange={handleAvatarChange}
                className="border border-gray-300 px-4 py-2 w-full rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2">Venue Manager:</label>
              <input type="checkbox" checked={isVenueManager} onChange={handleVenueManagerChange} className="mr-2" />
              <span className="text-sm">Are you a venue manager?</span>
            </div>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
              Save
            </button>
          </form>
        </div>
        <div className="max-w-[600px] mx-auto mt-8 p-4 bg-white rounded shadow-xl w-[90%]">
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">Upcoming Bookings</h2>
            <div className="flex justify-center items-center">
              {currentBookings.length > 0 ? (
                <ul className="list-disc list-inside">
                  {currentBookings.map((booking) => (
                    <li key={booking.id} className="mb-4 flex items-center gap-4 border-b h-48">
                      {booking.venue.media.length > 0 && (
                        <img src={booking.venue.media[0]} alt="Venue" className="w-24 h-24 object-cover rounded border-2 mr-4" />
                      )}
                      <div className="w-full">
                        <p className="text-gray-600 max-w-[95%] overflow-hidden overflow-ellipsis whitespace-nowrap">Venue: {booking.venue.name}</p>
                        <p className="text-gray-600">Date From: {new Date(booking.dateFrom).toLocaleDateString()}</p>
                        <p className="text-gray-600">Date To: {new Date(booking.dateTo).toLocaleDateString()}</p>
                        <p className="text-gray-600 mb-4">Guests: {booking.guests}</p>
                        <Link href={`/venue/${booking.venue.id}`} className="bg-blue-500 text-white py-2 px-4 rounded mt-2">
                          View Venue
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No bookings found for the customer.</p>
              )}
            </div>
            {bookings.length > bookingsPerPage && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={previousPage}
                  className={`bg-blue-500 text-white py-2 px-4 rounded w-24 ${isFirstPage ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={isFirstPage}
                >
                  Previous
                </button>
                <p className="text-gray-600 mx-2">
                  Page {currentPage} of {Math.ceil(bookings.length / bookingsPerPage)}
                </p>
                <button
                  onClick={nextPage}
                  className={`bg-blue-500 text-white py-2 px-4 rounded w-24 ${isLastPage ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={isLastPage}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
