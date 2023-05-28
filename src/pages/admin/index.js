import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import toast from "react-hot-toast";

export default function Admin() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("venueManager") === "false") {
      router.push("/login");
      toast.error("You are not authorized to view this page");
    }
    if (!localStorage.getItem("token")) {
      router.push("/login");
    }
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Admin Page</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:flex lg:justify-center">
        <div className="p-4 bg-white rounded shadow max-w-[400px]">
          <h2 className="text-lg font-semibold mb-2">Manage</h2>
          <p className="text-gray-700">View and manage existing venues, update venue information, and perform other administrative tasks.</p>

          <Link href="/admin/myVenues" className="text-blue-500 font-medium hover:underline mt-4">
            Go to Manage
          </Link>
        </div>
        <div className="p-4 bg-white rounded shadow max-w-[400px]">
          <h2 className="text-lg font-semibold mb-2">Add Venues</h2>
          <p className="text-gray-700">Add new venues to the system, including details and availability.</p>

          <Link href="/admin/addVenue" className="text-blue-500 font-medium hover:underline mt-4">
            Go to Add Venues
          </Link>
        </div>
      </div>
    </div>
  );
}
