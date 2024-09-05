import { useQuery } from "react-query";
import { useSearchContext } from "../contexts/SearchContext";
import * as apiClient from "../api-client";
import React, { useState } from "react";
import SearchResultsCard from "../components/SearchResultsCard";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/StarRatingFilter";
import HotelTypesFilter from "../components/HotelTypesFilter";
import HotelFacilitiesFilter from "../components/HotelFacilitiesFilter";
import PriceFilter from "../components/PriceFilter";

const Search = () => {
  const search = useSearchContext();
  const [selectedStars, setSelectedStars] = useState<string[]>([]);
  const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
  const [selectedHotelFacilities, setSelectedHotelFacilities] = useState<
    string[]
  >([]);
  const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
  const [sortOption, setSortOption] = useState<string>("");

  const [page, setPage] = useState<number>(1);

  const searchParams = {
    destination: search.destination,
    checkIn: search.checkIn.toISOString(),
    checkOut: search.checkOut.toISOString(),
    adultCount: search.adultCount.toString(),
    childCount: search.childCount.toString(),
    page: page.toString(),
    stars: selectedStars,
    types: selectedHotelTypes,
    facilities: selectedHotelFacilities,
    maxPrice: selectedPrice?.toString(),
    sortOption,
  };
  //   console.log(search);
  const { data: hotelData } = useQuery(["searchHotels", searchParams], () =>
    apiClient.searchHotels(searchParams)
  );

  const handleStarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const starRating = event.target.value;

    setSelectedStars((prevStars) =>
      event.target.checked
        ? [...prevStars, starRating]
        : prevStars.filter((star) => star !== starRating)
    );
  };

  const handleHotelTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const hotelType = event.target.value;

    setSelectedHotelTypes((prevTypes) =>
      event.target.checked
        ? [...prevTypes, hotelType]
        : prevTypes.filter((type) => type !== hotelType)
    );
  };

  const handleHotelFacilityChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const hotelFacility = event.target.value;

    setSelectedHotelFacilities((prevFacilities) =>
      event.target.checked
        ? [...prevFacilities, hotelFacility]
        : prevFacilities.filter((facility) => facility !== hotelFacility)
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
        <div className="rounded-lg border border-slate-300 p-5 h-fit lg:sticky top-10">
          <div className="space-y-5">
            <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
              Filter By:
            </h3>
            {/*FILTERS*/}
            <StarRatingFilter
              selectedStars={selectedStars}
              onChange={handleStarChange}
            />
            <HotelTypesFilter
              selectedHotelTypes={selectedHotelTypes}
              onChange={handleHotelTypeChange}
            />
            <HotelFacilitiesFilter
              selectedFacilities={selectedHotelFacilities}
              onChange={handleHotelFacilityChange}
            />
            <PriceFilter
              selectedPrice={selectedPrice}
              onChange={(value?: number) => setSelectedPrice(value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">
              {hotelData?.pagination.total} Hotels Found
              {search.destination ? ` in ${search.destination}` : ""}
            </span>
            {/*SORT OPTIONS*/}
            <select
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="">Sort By</option>
              <option value="starRating">Star Rating</option>
              <option value="pricePerNightAsc">
                Price Per Night (Low to High)
              </option>
              <option value="pricePerNightDesc">
                Price Per Night (High to Low)
              </option>
              <option value="nameAsc">Hotel Names (A to Z)</option>
              <option value="nameDesc">Hotel Names (Z to A)</option>
            </select>
          </div>
          {hotelData?.data.map((hotel, index) => (
            <SearchResultsCard hotel={hotel} key={index} />
          ))}
          <div>
            <Pagination
              page={hotelData?.pagination.page || 1}
              pages={hotelData?.pagination.pages || 1}
              onPageChange={(page) => setPage(page)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
