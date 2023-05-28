import React from "react";
import { useRouter } from "next/router";
import VenueDetails from "@/components/VenueDetails";
import Head from "next/head";

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
  return (
    <>
      <Head>
        <title>Holidaze | {data.name}</title>
        <meta name="description" content={data.description} />
      </Head>

      <div className="flex justify-center my-24">
        <VenueDetails venue={data} bookings={data.bookings} />
      </div>
    </>
  );
}
