import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Admin() {
  const router = useRouter();
  const [admin, setAdmin] = useState(false);

  // IF localstorage is not true then redirect to login
  useEffect(() => {
    if (localStorage.getItem("venueManager") === "false") {
      router.push("/login");
      console.log("not logged in");
    }
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Admin Page</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Manage</h2>
          <p className="text-gray-700">View and manage existing venues, update venue information, and perform other administrative tasks.</p>

          <a className="text-blue-500 font-medium hover:underline mt-4">Go to Manage</a>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Add Venues</h2>
          <p className="text-gray-700">Add new venues to the system, including details and availability.</p>

          <a className="text-blue-500 font-medium hover:underline mt-4">Go to Add Venues</a>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-lg font-semibold mb-2">View Bookings</h2>
          <p className="text-gray-700">Browse and view bookings made on different venues.</p>

          <a className="text-blue-500 font-medium hover:underline mt-4">Go to View Bookings</a>
        </div>
      </div>
    </div>
  );
}
