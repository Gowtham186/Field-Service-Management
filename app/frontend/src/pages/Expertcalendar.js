import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMyServices } from '../redux/slices.js/expert-slice'

export default function ExpertCalendar(){
    const dispatch = useDispatch()
    const { myServices } = useSelector((state) => state.expert)

    useEffect(()=>{
        dispatch(getMyServices())
    },[dispatch])

    const events = Array.isArray(myServices)
    ? myServices?.map((date) => ({
        title: 'Available',
        date: date,
        className: 'custom-event'
    }))
    : []

    return(
        <>
            <h1>My calendar</h1>
            <div>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView={'dayGridMonth'}
                initialDate={new Date()}
                selectable={true}
                
            />
        </div>
        </>
    )
}