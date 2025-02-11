import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getExpertProfile, updateAvailability } from "../redux/slices.js/expert-slice";
import "react-multi-date-picker/styles/colors/green.css";
import DatePicker from "react-multi-date-picker";
import { format } from "date-fns";
import "../App.css";

export default function ExpertAvailability() {
  const [selectedDates, setSelectedDates] = useState([]);
  const { user } = useSelector((state) => state.user);
  const { profile } = useSelector((state) => state.expert);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getExpertProfile({ id: user._id }));
  }, [dispatch, user._id]);

  useEffect(() => {
    if (profile?.availability?.length) {
      const parsedDates = profile.availability.map(dateStr => new Date(dateStr));
      setSelectedDates(parsedDates);
    }
  }, [profile]);

  const handleSaveAvailability = () => {
    console.log("Selected Dates (Raw):", selectedDates);
    const formattedDates = selectedDates.map((date) => format(date, "yyyy-MM-dd"));
    console.log("Formatted Dates:", formattedDates);
    dispatch(updateAvailability({ availability: formattedDates }))
    .unwrap()
    .then(() => console.log("Availability updated successfully"))
    .catch((error) => console.error("Error updating availability:", error));  
  };

  const handleDateChange = (dates) => {
    console.log("Raw Selected Dates:", dates);
    const normalizedDates = (Array.isArray(dates) ? dates : [dates]).map(d => new Date(d));
    
    setSelectedDates(prevDates => {
      console.log("Updated Selected Dates:", normalizedDates);
      return normalizedDates;
    });
  };

  return (
    <div className="flex flex-col items-center w-full h-screen p-4">
      <h2 className="text-3xl font-semibold mb-4">Select Available Dates</h2>

      <DatePicker
        multiple
        value={selectedDates}
        onChange={handleDateChange}
        minDate={new Date()}
        inline
        format="DD-MM-YYYY"
        mapDays={({ date }) => {
          const normalizedDate = new Date(date.toDate().setHours(0, 0, 0, 0));
          let isSelected = selectedDates.some(
            (d) => d instanceof Date && d.setHours(0, 0, 0, 0) === normalizedDate.getTime()
          );
          return {
            style: isSelected ? { backgroundColor: "green", color: "white" } : {},
          };
        }}
      />

      <div className="mt-4 w-full">
        <button
          onClick={handleSaveAvailability}
          className="mt-4 bg-blue-500 text-white p-3 rounded-md text-lg"
        >
          Save Availability
        </button>
      </div>
    </div>
  );
}
