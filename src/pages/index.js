import Cards from "@/components/Cards";
import { FaHotel } from "react-icons/fa";
import { useState } from "react";
import { filterResults } from "@/components/tools/SearchFilter";

export async function getServerSideProps() {
  const res = await fetch("https://api.noroff.dev/api/v1/holidaze/venues");
  const data = await res.json();
  return {
    props: {
      results: data,
    },
  };
}

export default function Home({ results }) {
  const [search, setSearch] = useState(filterResults("", { results }));
  const [currentPage, setCurrentPage] = useState(1);
  const venuesPerPage = 20;
  const indexOfLastVenue = currentPage * venuesPerPage;
  const indexOfFirstVenue = indexOfLastVenue - venuesPerPage;
  const currentVenues = search.slice(indexOfFirstVenue, indexOfLastVenue);

  const searchInput = (e) => {
    const search = e.target.value;
    const filteredResults = filterResults(search, { results });
    setSearch(filteredResults);
    setCurrentPage(1);
  };

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const previousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = indexOfLastVenue >= search.length;

  return (
    <div className="max-w- mx-auto mt-8 p-4">
      <div className="flex justify-center">
        <div className="flex mb-4 max-w-[800px]">
          <input type="text" onChange={searchInput} placeholder="Search venues" className="border border-gray-300 px-4 py-2 w-full rounded" />
          <button className="ml-4 bg-blue-500 text-white py-2 px-4 rounded">Search</button>
        </div>
      </div>
      <div className="flex justify-center items-center mt-6">
        <FaHotel className="mr-2 text-3xl" />
        <h2 className="text-2xl font-bold">Our Venues</h2>
      </div>
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:max-w-3xl lg:grid-cols-3 lg:max-w-6xl xl:grid-cols-4 xl:max-w-[1450px] mx-auto">
        {currentVenues.length > 0 ? currentVenues.map((venue) => <Cards venue={venue} key={venue.id} />) : <p>No venues available.</p>}
      </div>
      {search.length > venuesPerPage && (
        <div className="flex justify-center mt-4">
          <button
            onClick={previousPage}
            className={`bg-blue-500 text-white py-2 px-4 rounded mr-2 ${isFirstPage ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isFirstPage}
          >
            Previous
          </button>
          <p className="text-gray-600 mx-2">
            Page {currentPage} of {Math.ceil(search.length / venuesPerPage)}
          </p>
          <button
            onClick={nextPage}
            className={`bg-blue-500 text-white py-2 px-4 rounded ${isLastPage ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isLastPage}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
