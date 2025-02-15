import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getMyServices, updateBookingStatus } from "../redux/slices.js/expert-slice";

export default function NewBookings() {
    const dispatch = useDispatch()
    const { myServices } = useSelector((state) => state.expert);
    const requestedServices = myServices?.filter(ele => ele.status === 'requested');

    useEffect(()=>{
            dispatch(getMyServices())
    },[dispatch])

    const handleAction = (id, updateStatus)=>{
        console.log(id, updateStatus)
        const getConfirm = window.confirm("confirm?")
        if(getConfirm){
            dispatch(updateBookingStatus({id : id, body : { status : updateStatus}}))
        }
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">New Bookings</h1>
            {requestedServices?.length > 0 ? (
                <div className="space-y-4">
                    {requestedServices?.map(service => (
                        <div key={service._id} className="border p-4 rounded-lg shadow-md">
                           {service?.serviceType?.map((servicetype, index) => (
                                <div key={index}>
                                    <p><strong>Category :</strong> {servicetype.category.name}</p>
                                    <p><strong>Services :</strong></p>
                                    {servicetype?.servicesChoosen?.map((ele, idx) => (
                                        <p key={idx}>{ele.serviceName}</p>
                                    ))}
                                </div>
                            ))}

                            <p><strong>Price :</strong> ${service.budget.servicesPrice}</p>
                            <p><strong>Location :</strong> {service.location.address}</p>
                            <p><strong>Schedule Date :</strong> {new Date(service.scheduleDate).toLocaleDateString('en-GB')}</p>

                            <div className="mt-2 flex space-x-2">
                                <button 
                                    onClick={() => handleAction(service._id, "accepted")}
                                    className="px-4 py-2 bg-green-500 text-white rounded-md"
                                >
                                    Accept
                                </button>
                                <button 
                                    onClick={() => handleAction(service._id, "cancelled")}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No new bookings available.</p>
            )}
        </div>
    );
}
