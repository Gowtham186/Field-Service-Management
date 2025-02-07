import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMyServices, setServiceRequestId } from '../redux/slices.js/expert-slice'
import { useNavigate } from 'react-router-dom'

export default function ExpertCalendar(){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { myServices } = useSelector((state) => state.expert)
    const [assignedServices, setAssignedServices] = useState([])

    useEffect(()=>{
        dispatch(getMyServices())
        setAssignedServices(myServices?.filter(ele => ele.status !== 'requested'))
    },[dispatch])

        const events = Array.isArray(myServices)
        ? assignedServices?.map((ele) => ({
            title: ele.serviceType?.map(type => type.category.name).join(', '),
            date: ele.scheduleDate,
            allDay : true,
            className: 'custom-event',
            serviceDetails : ele
        }))
        : []

    const handleViewDetails = (id) => {
        console.log(id)
        dispatch(setServiceRequestId(id))
        navigate('/service-details')
    }

    const renderEventContent = (eventInfo) => {
        return (
            <div>
                <p><strong>{eventInfo.event.title}</strong></p>
                <button 
                    className='rounded-sm px-0.5 bg-slate-400'  
                    onClick={() => handleViewDetails(eventInfo.event.extendedProps.serviceDetails._id)}>View Details</button>
            </div>
        );
    };

    return(
        <>
            <h1>My calendar</h1>
            <div>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView={'dayGridMonth'}
                initialDate={new Date()}
                selectable={true}
                events={events}
                eventContent={renderEventContent}
            />
        </div>
        </>
    )
}