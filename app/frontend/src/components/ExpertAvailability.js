import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getExpertProfile, updateAvailability } from "../redux/slices.js/expert-slice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { toast } from "react-toastify";

export default function ExpertAvailability() {
  const [selectedDates, setSelectedDates] = useState([]);
  const { user } = useSelector((state) => state.user);
  const { profile } = useSelector((state) => state.expert);
  const dispatch = useDispatch();

  useEffect(() => {
    if(user?._id){
      dispatch(getExpertProfile({ id: user?._id }));
    }
  }, [dispatch, user?._id]);

  useEffect(() => {
    if (profile?.availability?.length) {
      const parsedDates = profile.availability.map(dateStr => new Date(dateStr));
      setSelectedDates(parsedDates);
    }
  }, [profile]);

  const handleDateChange = (date) => {
    setSelectedDates(prevDates => {
      const exists = prevDates.some(d => d.toDateString() === date.toDateString());

      if (exists) {
        return prevDates.filter(d => d.toDateString() !== date.toDateString()); // Remove if already selected
      } else {
        return [...prevDates, date]; // Add new date
      }
    });
  };

  const handleSaveAvailability = () => {
    const formattedDates = selectedDates.map(date => format(date, "yyyy-MM-dd"));
    console.log("Final Selected Dates:", formattedDates);
    dispatch(updateAvailability({ id: user?._id, availability: formattedDates }))
    toast.success("Availability Updated")
  };

  return (
    <div className="flex flex-col items-center w-full h-screen p-4">
      <h2 className="text-3xl font-semibold mb-4">Select Available Dates</h2>

      <DatePicker
        selected={null} // Prevent default single selection
        onChange={handleDateChange}
        highlightDates={selectedDates}
        inline
        minDate={new Date()}
        dateFormat="dd-MM-yyyy"
      />

      <button
        onClick={handleSaveAvailability}
        className="mt-4 bg-blue-500 text-white p-3 rounded-md text-lg"
      >
        Save Availability
      </button>
    </div>
  );
}


