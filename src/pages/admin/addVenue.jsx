import Head from "next/head";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AddVenue() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    media: [],
    price: 0,
    maxGuests: 0,
    rating: 0,
    meta: {
      wifi: true,
      parking: true,
      breakfast: true,
      pets: true,
    },
    location: {
      address: "",
      city: "",
      zip: "",
      country: "",
      continent: "",
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

    async function addVenue() {
      const res = await fetch("https://api.noroff.dev/api/v1/holidaze/venues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.created) {
        toast.success("Venue added successfully");
      } else {
        toast.error("Something went wrong");
      }
    }
    addVenue();
  };

  return (
    <>
      <Head>
        <title>Add a new Venue - Holidaze</title>
        <meta name="description" content="Add a new Venue - Holidaze" />
      </Head>
      <div className="container mx-auto p-4 my-24">
        <h1 className="text-2xl font-bold mb-4">Add a new Venue</h1>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="mb-4">
            <label className="block mb-1 font-medium">Name*</label>
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
            <label className="block mb-1 font-medium">Description*</label>
            <textarea
              required
              name="description"
              value={form.description}
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 w-full rounded"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Media*</label>
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
            <label className="block mb-1 font-medium">Price*</label>
            <input required type="number" name="price" onChange={handleChange} className="border border-gray-300 px-4 py-2 w-full rounded" />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Max Guests*</label>
            <input
              required
              min={1}
              max={25}
              type="number"
              name="maxGuests"
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 w-full rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Rating*</label>
            <input
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
              type="text"
              name="location.address"
              value={form.location.address}
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 w-full rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">City</label>
            <input
              type="text"
              name="location.city"
              value={form.location.city}
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 w-full rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">ZIP</label>
            <input
              type="text"
              name="location.zip"
              value={form.location.zip}
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
