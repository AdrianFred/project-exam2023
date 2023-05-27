import React from "react";
import { useRouter } from "next/router";
import VenueDetails from "@/components/VenueDetails";

export async function getServerSideProps({ query }) {
  const { slug } = query;
  const res = await fetch(`https://api.noroff.dev/api/v1/holidaze/venues/${slug}?_bookings=true`);
  const data = await res.json();
  return {
    props: {
      data,
    },
  };
}

export default function Venue({ data }) {
  console.log(data);
  return (
    <div className="flex justify-center mt-8">
      <VenueDetails venue={data} bookings={data.bookings} />
    </div>
  );
}
