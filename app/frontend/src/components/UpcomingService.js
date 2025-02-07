import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

export default function UpcomingService(){
    const { myServices } = useSelector((state) => state.expert)
    const [ upcomingService, setUpComingService] = useState(null)

    useEffect(() => {
        if (myServices?.length > 0) {
            const today = new Date();
            today.setHours(0, 0, 0, 0); 
    
            const upcoming = myServices
                .filter(service => {

                    if(service.status !== 'assigned') return false

                    const serviceDate = new Date(service.scheduleDate);
                    serviceDate.setHours(0, 0, 0, 0); 
                    return serviceDate.getTime() > today.getTime(); 
                })
                .sort((a, b) => new Date(a.scheduleDate) - new Date(b.scheduleDate));
    
            console.log(upcoming);
            setUpComingService(upcoming.length > 0 ? upcoming[0] : null);
        }
    }, [myServices]);
    
    

    return(
        <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-4">
            <h2 className="text-lg font-semibold mb-3">Next Upcoming Service</h2>

            {upcomingService ? (
                <div>
                    <h3 className="text-lg font-semibold">{upcomingService.serviceType[0]?.servicesChoosen[0]?.serviceName}</h3>
                    <p><strong>Customer:</strong> {upcomingService.customerId?.name} ({upcomingService.customerId?.phone_number})</p>
                    <p><strong>Location:</strong> {upcomingService.location?.address}</p>
                    <p><strong>Schedule Date:</strong> {new Date(upcomingService.scheduleDate).toDateString()}</p>
                    <p><strong>Price:</strong> ₹{upcomingService.budget?.servicesPrice || 0}</p>
                </div>
            ) : (
                <p className="text-gray-500">No upcoming service found.</p>
            )}
        </div>
    )
}