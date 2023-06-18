import Link from "next/link";

const Cards = (props) => {
  return (
    <>
      <div key={props.venue.id} className="flex shadow-2xl rounded-lg bg-white p-4 w-[300px] mt-4 mx-auto ">
        <div className="mx-auto w-[100%]">
          <div className="relative">
            <img className="mt-3 rounded-lg object-cover h-[200px] w-[100%] " src={props.venue.media[0]} alt="Image of the venue" />
            <div className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-tl-3xl text-white">{props.venue.media.length} Images</div>
          </div>
          <div className="font-semibold underline ml-1 mt-3 max-w-[230px] break-words h-12 line-clamp-2 ">{props.venue.name}</div>
          {props.venue.description ? (
            <div className="ml-1 mt-2 h-12 line-clamp-2">{props.venue.description}</div>
          ) : (
            <div className="ml-1 mt-2 h-12">No description</div>
          )}

          <div className="pt-5 flex justify-between">
            <div className="text-lg font-semibold break-words max-w-[125px] overflow-hidden overflow-ellipsis whitespace-nowrap">
              Price: {props.venue.price}
            </div>
            <Link href={`/venue/${props.venue.id}`}>
              <button className="p-2 pl-5 pr-5 transition-colors duration-700 transform bg-blue-500 hover:bg-indigo-700 text-gray-100 text-lg rounded-lg border-indigo-300">
                View Venue
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cards;
