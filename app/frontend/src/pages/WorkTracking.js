import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getServiceRequest, updateBookingStatus } from "../redux/slices.js/expert-slice";

export default function WorkTracking() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { loading, workingService } = useSelector((state) => state.expert);
  const [ serviceWorking, setServiceWorking ] = useState(null)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    if(id){
        dispatch(updateBookingStatus({ id: id, body: { status: 'in-progress' } }));
    }
    setServiceWorking(workingService)

    // if (!workingService) {
    //   dispatch(getServiceRequest(id));
    // }
  }, [dispatch, id]);

  if (loading) return <p>...loading</p>;

  const handleCompleted = (id) =>{
    console.log(id)
    dispatch(updateBookingStatus({ id: id, body: { status: 'completed' } }))
    .unwrap() // unwrap the promise
    .then((result) => {
      setIsCompleted(true)
    })
    .catch((error) => {
      console.error('Failed to update service status:', error);
      // Handle errors here (e.g., show an alert to the user)
    });  }

  return (
    <div className="p-4">
      <div className="mt-4 space-y-4">
        <h3 className="font-semibold text-lg"><strong>Services:</strong></h3>
        {serviceWorking?.serviceType?.map((type) => (
          <div
            key={type._id}
            className="border p-4 rounded-lg shadow-lg bg-white"
          >
            <div className="flex items-center justify-between">
              <p className="flex-1 font-bold">{type.category?.name}: {type.name}</p>
              <button
                className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                // Add onClick handler for opening a form or modal to add a service
              >
                +
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {type?.servicesChoosen?.map((service) => (
                <div key={service._id} className="border p-2 rounded-md shadow-sm bg-gray-50">
                  <p><strong>{service.serviceName}</strong></p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
  onClick={() => handleCompleted(serviceWorking._id)}
  className={`mt-6 py-2 px-4 font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    isCompleted
      ? "bg-green-500 hover:bg-green-600 cursor-not-allowed"
      : "bg-blue-500 hover:bg-blue-600"
  } text-white`}
  disabled={isCompleted} // Disable the button if completed
>
  Service Completed
</button>


    </div>
  );
}
