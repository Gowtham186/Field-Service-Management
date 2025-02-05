import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getExpertProfile, updateAvailability } from '../redux/slices.js/expert-slice'

export default function ExpertAvailability(){
    const [selectedDates, setSelectedDates] = useState([]) 
    const { user } = useSelector((state) => state.user)
    const { profile } = useSelector((state) => state.expert)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getExpertProfile({ id: user._id }))
    }, [dispatch, user._id])

    const handleDateSelect = useCallback((info) => {
        const selectedDate = info.dateStr
        setSelectedDates(prev => {
            const isDateSelected = prev.includes(selectedDate)
            if (isDateSelected) {
                return prev.filter(ele => ele !== selectedDate)  
            }
            return [...prev, selectedDate]  
        })
    }, [])

    useEffect(() => {
        if (selectedDates.length > 0) {
            dispatch(updateAvailability({ availability: selectedDates })).unwrap()
        }
    }, [selectedDates, dispatch])  

    const handleEventClick = (info) => {
        const clickedDate = info.dateStr
        setSelectedDates(prev => {
            const isDateSelected = prev.includes(clickedDate)
            if (isDateSelected) {
                return prev.filter(ele => ele !== clickedDate)
            }
            return [...prev, clickedDate]
        })
    }

    const events = Array.isArray(profile?.availability)
        ? profile.availability.map((date) => ({
            title: 'Available',
            date: date,
            className: 'custom-event'
        }))
        : []

    return (
        <div>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView={'dayGridMonth'}
                initialDate={new Date()}
                selectable={true}
                dateClick={handleDateSelect}
                //select={handleDateSelect}
                eventClick={handleEventClick}  
                validRange={{ start: new Date() }}
                events={events}
            />
        </div>
    )
}
