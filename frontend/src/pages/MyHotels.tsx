import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiHotel, BiMoney, BiStar } from "react-icons/bi";

const MyHotels = () => {
  const { showToast } = useAppContext();
  const { data: hotelData } = useQuery(
    "fetchMyHotels",
    apiClient.fetchMyHotels,
    {
      onError: () => {
        showToast({ message: "Error Fetching Hotels!", status: "ERROR" });
      },
    }
  );

  if (!hotelData) return <span>No Hotel Found!</span>;

  return (
    <div className="space-y-5">
      <span className="flex justify-between">
        <h1 className="text-3xl font-bold">My Hotels</h1>
        <Link
          to={"/add-hotel"}
          className="flex bg-indigo-500 text-white text-xl font-bold p-2 hover:bg-indigo-400 rounded"
        >
          Add Hotel
        </Link>
      </span>
      <div className="grid grid-cols-1 gap-8">
        {hotelData?.map((hotel) => (
          <div className="flex flex-col justify-between border border-indigo-300 rounded-lg p-8 gap-5">
            <h2 className="text-2xl font-bold ">{hotel.name}</h2>
            <div className="whitespace-pre-line">{hotel.description}</div>
            <div className="grid grid-cols-5 gap-2">
              <div className="border border-indigo-300 rounded-lg p-3 flex items-center">
                <BsMap className="mr-2" />
                {hotel.city},{hotel.country}
              </div>
              <div className="border border-indigo-300 rounded-lg p-3 flex items-center">
                <BsBuilding className="mr-2" />
                {hotel.type}
              </div>
              <div className="border border-indigo-300 rounded-lg p-3 flex items-center">
                <BiMoney className="mr-2" />${hotel.pricePerNight} Per Night
              </div>
              <div className="border border-indigo-300 rounded-lg p-3 flex items-center text-sm">
                <BiHotel className="mr-2" />
                {hotel.adultCount} adults, {hotel.childCount} children
              </div>
              <div className="border border-indigo-300 rounded-lg p-3 flex items-center ">
                <BiStar className="mr-2" />
                {hotel.starRating} Star Rating
              </div>
            </div>
            <span className="flex justify-end">
              <Link
                to={`edit-hotel/${hotel._id}`}
                className="flex bg-indigo-500 text-white text-xl font-bold p-2 hover:bg-indigo-400 rounded"
              >
                View Details
              </Link>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyHotels;
