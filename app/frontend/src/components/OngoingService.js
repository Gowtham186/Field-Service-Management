import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function OngoingService() {
    const { myServices } = useSelector((state) => state.expert);
    const [ongoingService, setOngoingService] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (myServices?.length > 0) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const upcoming = myServices
                .filter(service => {
                    if (service.status !== "assigned") return false;
                    
                    const serviceDate = new Date(service.scheduleDate);
                    serviceDate.setHours(0, 0, 0, 0);
                    
                    return serviceDate.getTime() === today.getTime();
                })
                .sort((a, b) => new Date(a.scheduleDate) - new Date(b.scheduleDate));

            console.log(upcoming);
            setOngoingService(upcoming.length > 0 ? upcoming[0] : null);
        }
    }, [myServices]);

    return (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-4">
            <h2 className="text-lg font-semibold mb-3">Today's Service</h2>

            {ongoingService ? (
                <div>
                    <h3 className="text-lg font-semibold">
                        {ongoingService.serviceType[0]?.servicesChoosen[0]?.serviceName}
                    </h3>
                    <p><strong>Customer:</strong> {ongoingService.customerId?.name} ({ongoingService.customerId?.phone_number})</p>
                    <p><strong>Location:</strong> {ongoingService.location?.address}</p>
                    <p><strong>Location:</strong> {ongoingService.customerId?._id}</p>
                    {/* <p><strong>Coordinates:</strong> lat: {ongoingService.location?.coords.lat}, lng: {ongoingService.location?.coords.lng}</p> */}

                    <button
                        className="mt-3 py-2 px-4 mr-4 bg-blue-500 text-white font-semibold shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={() => {
                            navigate(`/live-tracking/${ongoingService?._id}`, {
                                state: {
                                    destinationAddress: ongoingService.location?.address,
                                    destinationCoords: {
                                        latitude: ongoingService.location?.coords.lat,
                                        longitude: ongoingService.location?.coords.lng
                                    },
                                    customerId: ongoingService.customerId?._id
                                }
                            });
                        }}
                    >
                        Take Drive
                    </button>

                    <button
                        className="mt-3 py-2 px-4 bg-blue-500 text-white font-semibold shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Start Work
                    </button>
                </div>
            ) : (
                <p className="text-gray-500">No services today.</p>
            )}
        </div>
    );
}
