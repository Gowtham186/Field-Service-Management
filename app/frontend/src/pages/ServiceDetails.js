import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; 

export default function ServiceDetails() {
    const { myServices, serviceRequestId } = useSelector((state) => state.expert);
    const [serviceDetails, setServiceDetails] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (myServices?.length > 0 && serviceRequestId) {
            setServiceDetails(myServices.find(ele => ele._id === serviceRequestId));
        }
    }, [myServices, serviceRequestId]); 

    return (
        <>
            <button onClick={() => navigate(-1)}>⬅ Back</button> 
            
            {serviceDetails ? (
                <div>
                    <h1>Service ID: {serviceDetails._id}</h1>
                    <p><strong>Category:</strong> {serviceDetails.serviceType.map(type => type.category.name).join(', ')}</p>
                    <p><strong>Description:</strong> {serviceDetails.description}</p>
                    <p><strong>Scheduled Date:</strong> {new Date(serviceDetails.scheduleDate).toDateString()}</p>
                    <p><strong>Location:</strong> {serviceDetails.location?.address}</p>
                    <p><strong>Status:</strong> {serviceDetails.status}</p>
                    
                    <h3>Services Chosen:</h3>
                    <ul>
                        {serviceDetails.serviceType.flatMap(type => type.servicesChoosen).map(service => (
                            <li key={service._id}>
                                {service.serviceName} - ₹{service.price}
                            </li>
                        ))}
                    </ul>

                    <p>Service Price: ₹{serviceDetails.budget?.servicesPrice}</p>

                    {serviceDetails.serviceImages.length > 0 && (
                        <div>
                            <h3>Service Images:</h3>
                            {serviceDetails.serviceImages.map(img => (
                                <img key={img._id} src={img.pathName} alt={img.originalName} width="200px" />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <p>Loading service details...</p>
            )}
        </>
    );
}
