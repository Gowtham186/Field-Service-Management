//  import FullCalendar from '@fullcalendar/react'
// import dayGridPlugin from '@fullcalendar/daygrid'
// import interactionPlugin from '@fullcalendar/interaction'
// import { useEffect, useState, useCallback } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { getExpertProfile, updateAvailability } from '../redux/slices.js/expert-slice'

// export default function ExpertAvailability(){
//     const [selectedDates, setSelectedDates] = useState([]) 
//     const { user } = useSelector((state) => state.user)
//     const { profile } = useSelector((state) => state.expert)
//     const dispatch = useDispatch()

//     useEffect(() => {
//         dispatch(getExpertProfile({ id: user._id }))
//     }, [dispatch, user._id])

//     const handleDateSelect = useCallback((info) => {
//         const selectedDate = info.dateStr
//         setSelectedDates(prev => {
//             const isDateSelected = prev.includes(selectedDate)
//             if (isDateSelected) {
//                 return prev.filter(ele => ele !== selectedDate)  
//             }
//             return [...prev, selectedDate]  
//         })
//     }, [])

//     useEffect(() => {
//         if (selectedDates.length > 0) {
//             dispatch(updateAvailability({ availability: selectedDates })).unwrap()
//         }
//     }, [selectedDates, dispatch])  

//     const handleEventClick = (info) => {
//         const clickedDate = info.dateStr
//         setSelectedDates(prev => {
//             const isDateSelected = prev.includes(clickedDate)
//             if (isDateSelected) {
//                 return prev.filter(ele => ele !== clickedDate)
//             }
//             return [...prev, clickedDate]
//         })
//     }

//     const events = Array.isArray(profile?.availability)
//         ? profile.availability.map((date) => ({
//             title: 'Available',
//             date: date,
//             className: 'custom-event'
//         }))
//         : []

//     return (
//         <div>
//             <FullCalendar
//                 plugins={[dayGridPlugin, interactionPlugin]}
//                 initialView={'dayGridMonth'}
//                 initialDate={new Date()}
//                 selectable={true}
//                 dateClick={handleDateSelect}
//                 //select={handleDateSelect}
//                 eventClick={handleEventClick}  
//                 validRange={{ start: new Date() }}
//                 events={events}
//             />
//         </div>
//     )
// }


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
        dispatch(updateAvailability({ availability: formattedDates })).unwrap();
    };

  const handleDateChange = (dates) => {
    setSelectedDates(Array.isArray(dates) ? dates : [dates]); 
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
          let isSelected = selectedDates.some(
            (d) => d instanceof Date && d.getTime() === date.toDate().getTime()
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
