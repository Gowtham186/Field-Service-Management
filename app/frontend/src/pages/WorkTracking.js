import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { deleteOnSiteService, getServiceRequest, onSiteService, updateBookingStatus } from "../redux/slices.js/expert-slice";
import { v4 as uuidv4 } from 'uuid';

export default function WorkTracking() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { loading, workingService } = useSelector((state) => state.expert);

  const [isCompleted, setIsCompleted] = useState(false);
  const [newServices, setNewServices] = useState([]);

  useEffect(() => {
    if (id) {
      dispatch(getServiceRequest(id)); 
    }
  }, [dispatch, id]);
  
  useEffect(() => {
    if (id) {
      dispatch(updateBookingStatus({ id, body: { status: "in-progress" } }));
    }
  }, [dispatch, id]);
  

  if (loading) return <p>...loading</p>;

  const handleCompleted = () => {
    if (!workingService?._id) return;
    dispatch(updateBookingStatus({ id: workingService._id, body: { status: 'completed' } }))
      .unwrap()
      .then(() => setIsCompleted(true))
      .catch((error) => console.error('Failed to update service status:', error));
  };

  const handleAddService = () => {
    const newService = { id: uuidv4(), serviceName: "", price: "" };
    setNewServices((prevServices) => [...prevServices, newService]);
  };

  const handleServiceChange = (e, serviceId) => {
    const { name, value } = e.target;
    setNewServices((prevServices) =>
      prevServices.map((service) =>
        service.id === serviceId ? { ...service, [name]: value } : service
      )
    );
  };

  const handleSave = (service) => {
    dispatch(onSiteService({ serviceRequestId: id, newService: service }))
      .unwrap()
      .then(() => {
        setNewServices([])
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (serviceId)=>{
    dispatch(deleteOnSiteService(serviceId))
      .unwrap()
      .catch((err) => console.log(err))
  }

  return (
    <div className="p-2 px-4">
      <div className="mt-4 space-y-4">
        <h3 className="font-semibold text-lg"><strong>Services:</strong></h3>

        {workingService?.serviceType?.map((type) => (
          <div key={type?._id || uuidv4()} className="border p-4 rounded-lg shadow-lg bg-white">
            <p className="font-bold">{type?.category?.name}: </p>

            <div className="mt-4 space-y-2">
              {type?.servicesChoosen?.map((service) => (
                <div key={service?._id || uuidv4()} className="border p-2 rounded-md shadow-sm bg-gray-50">
                  <p><strong>{service.serviceName}</strong></p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {workingService?.onSiteServices.length > 0 && (
  <div className="mt-4 bg-white shadow-lg rounded-lg p-4">
    <h3 className="font-semibold text-lg mb-3 text-gray-700">On-Site Services</h3>

    <div className="grid grid-cols-3 gap-4 border-b pb-2 text-gray-600 font-medium">
      <p>Service Name</p>
      <p className="text-center">Price</p>
      <p className="text-right">Action</p>
    </div>

    {workingService?.onSiteServices?.map((service) => (
      <div key={service?._id} className="grid grid-cols-3 gap-4 py-2 border-b items-center">
        <p className="text-gray-800">{service?.serviceName}</p>
        <p className="text-center font-semibold text-green-600">₹{service?.price}</p>
        <button
          onClick={() => handleDelete(service?._id)}
          className="text-red-600 hover:text-red-800 text-sm font-medium px-1 py-1 bg-red-100 hover:bg-red-200 rounded"
        >
          Delete
        </button>
      </div>
    ))}
  </div>
)}



        <button
          className="mt-3 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          onClick={handleAddService}
        >
          Add On-Site Service
        </button>
      </div>

      {newServices.length > 0 &&
        newServices.map(service => (
          <div key={service.id} className="mt-2">
            <label className="text-gray-600">Service Name:</label>
            <input 
              type="text"
              name="serviceName"
              value={service.serviceName}
              className="border p-1 rounded w-full"
              onChange={(e) => handleServiceChange(e, service.id)}
            />
            <label className="text-gray-600">Price:</label>
            <input 
              type="number"
              name="price"
              value={service.price}
              className="border p-1 rounded w-full"
              onChange={(e) => handleServiceChange(e, service.id)}
            />
            <button
              className="mt-3 py-2 px-4 bg-green-500 text-white font-semibold shadow-md hover:bg-blue-600"
              onClick={() => handleSave(service)}
            >
              Save
            </button>
          </div>
        ))
      }

      <button
        onClick={handleCompleted}
        className={`mt-6 py-2 px-4 font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isCompleted ? "bg-green-500 hover:bg-green-600 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
        } text-white`}
        disabled={isCompleted}
      >
        Service Completed
      </button>
    </div>
  );
}
