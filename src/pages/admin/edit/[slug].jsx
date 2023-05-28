import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Head from "next/head";
import { VenueUrl } from "@/components/apiUrl/shared";

export async function getServerSideProps({ query }) {
  const { slug } = query;
  const res = await fetch(VenueUrl + `/${slug}?_bookings=true`);
  const data = await res.json();
  return {
    props: {
      results: data,
    },
  };
}

export default function AddVenue({ results }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: results.name,
    description: results.description,
    media: results.media,
    price: results.price,
    maxGuests: results.maxGuests,
    rating: results.rating,
    meta: {
      wifi: results.meta.wifi,
      parking: results.meta.parking,
      breakfast: results.meta.breakfast,
      pets: results.meta.pets,
    },
    location: {
      address: results.location.address,
      city: results.location.city,
      zip: results.location.zip,
      country: results.location.country,
      continent: results.location.continent,
      lat: 0,
      lng: 0,
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === "rating" || name === "maxGuests" || name === "price" ? Number(value) : value;

    if (name.startsWith("location.")) {
      const locationProp = name.split(".")[1];
      setForm((prevForm) => ({
        ...prevForm,
        location: {
          ...prevForm.location,
          [locationProp]: parsedValue,
        },
      }));
    } else if (name === "media") {
      // Split the value by comma and trim each item to create an array
      const mediaArray = value.split(",").map((item) => item.trim());
      setForm((prevForm) => ({
        ...prevForm,
        media: mediaArray,
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: parsedValue,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    async function editVenue() {
      const res = await fetch(VenueUrl + `/${results.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.created) {
        toast.success("Venue edited successfully");
        setTimeout(() => {
          router.push("/admin/myVenues");
        }, 2000);
      } else {
        toast.error("Something went wrong");
      }
    }
    editVenue();
  };

  return (
    <>
      <Head>
        <title>Holidaze | Edit Venue</title>
        <meta name="description" content="Edit your venue" />
      </Head>

      <div className="container mx-auto p-4 my-24">
        <h1 className="text-2xl font-bold mb-4">Edit your Venue</h1>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="mb-4">
            <label className="block mb-1 font-medium">Name</label>
            <input
              required
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 w-full rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              required
              name="description"
              value={form.description}
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 w-full rounded"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Media</label>
            <textarea
              required
              placeholder="Add more with comma"
              name="media"
              value={form.media}
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 w-full rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Price</label>
            <input
              value={form.price}
              required
              type="number"
              name="price"
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 w-full rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Max Guests</label>
            <input
              required
              value={form.maxGuests}
              min={1}
              max={25}
              type="number"
              name="maxGuests"
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 w-full rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Rating</label>
            <input
              value={form.rating}
              required
              min={0}
              max={5}
              type="number"
              name="rating"
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 w-full rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Address</label>
            <input
              value={form.location.address}
              type="text"
              name="location.address"
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 w-full rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">City</label>
            <input
              value={form.location.city}
              type="text"
              name="location.city"
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 w-full rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">ZIP</label>
            <input
              value={form.location.zip}
              type="text"
              name="location.zip"
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 w-full rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Country</label>
            <input
              type="text"
              name="location.country"
              value={form.location.country}
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 w-full rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Continent</label>
            <input
              type="text"
              name="location.continent"
              value={form.location.continent}
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 w-full rounded"
            />
          </div>

          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
