import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { querying, getAddress, setSearchSkillState, getCoords } from "../redux/slices.js/search-slice";
import { useNavigate } from "react-router-dom";
import { fetchSkills } from "../redux/slices.js/expert-slice";
import Select from "react-select";
import FilteredExpertsMap from "./FilteredExpertsMap";
import { FaLocationArrow } from "react-icons/fa";
import HeroSection from "./HeroSection";

export default function SearchComponent() {
  const { resultsExperts, serverError, currentAddress } = useSelector((state) => state.search);
  const [searchLocation, setSearchLocation] = useState(currentAddress || "");
  const [searchSkill, setSearchSkill] = useState("");
  const [coords, setCoords] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allSkills } = useSelector((state) => state.expert);

  useEffect(() => {
    dispatch(fetchSkills());
  }, []);

  const skillOptions = allSkills?.map((skill) => ({ value: skill._id, label: skill.name }));

  const handleSkillSelect = (selectedOption) => {
    const selectedSkillValue = selectedOption ? selectedOption.value : "";
    setSearchSkill(selectedSkillValue);
    dispatch(setSearchSkillState(selectedSkillValue));
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if(!searchLocation){
      setCoords(null)
    }
    
    if (searchLocation) {
      getCoordsFromAddress(searchLocation).then((locationCoords) => {
        if (locationCoords) {
          setCoords(locationCoords);
        }
      });
    }
    const queryParams = new URLSearchParams();
    if (searchLocation !== "") {
      queryParams.append("location", searchLocation);
    }
    if (searchSkill !== "") {
      queryParams.append("skill", searchSkill);
    }
    const queryString = queryParams.toString();
    try {
      dispatch(querying(queryString));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentAddress) {
      setSearchLocation(currentAddress);
    }
  }, [currentAddress]);

  const getCoordsFromAddress = async (searchLocation) => {
    try {
      const response = await dispatch(getCoords({ address: searchLocation })).unwrap();
      return response; // Ensure lat/lng is returned
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoords({ lat, lng });
        await dispatch(getAddress({ lat, lng })).unwrap();
      });
    }
  };

  return (
    <div className="p-4 relative top-14 max-w-8xl mx-auto">

      <div className="bg-white p-3 rounded-lg shadow-md">
        <form onSubmit={handleSearch} className="flex flex-col items-center space-y-4">
          {/* Location & Skill Row */}
          <div className="flex space-x-2 w-full max-w-3xl">
            <input
              type="search"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder="Enter location"
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={getCurrentLocation}
              className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              <FaLocationArrow />
            </button>
            <Select
              options={skillOptions}
              className="flex-1"
              onChange={handleSkillSelect}
              isClearable
            />
          </div>

          {/* Search Button */}
          <input
            type="submit"
            value="Search"
            className="bg-blue-500 text-white px-6 py-2 rounded-md cursor-pointer hover:bg-blue-600"
          />
        </form>
      </div>

      {serverError && <p className="text-red-500 text-center mt-4">{serverError}</p>}
      {resultsExperts && resultsExperts.length === 0 && (
        <p className="text-red-500 text-center mt-4">No experts found in this location & skill</p>
      )}

      {/* Show HeroSection only on the first render (before search) */}
      {/* {(!resultsExperts || resultsExperts.length === 0) && !serverError && <HeroSection />} */}

      {/* Map Section (Replaces HeroSection after search) */}
      {resultsExperts?.length > 0 && (
        <div className="mt-8 flex flex-col gap-6 z-0">
          <div className="w-full z-50 h-96 md:h-[500px]">
            <FilteredExpertsMap
              resultsExperts={resultsExperts}
              coords={coords}
              searchLocation={searchLocation}
              className="w-full h-full rounded-lg shadow-md"
            />
          </div>
        </div>
      )}
    </div>
  );
}
