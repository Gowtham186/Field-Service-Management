import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { expertCategoriesBySkills } from "../redux/slices.js/expert-slice";
import Navbar from "../components/Navbar";
import { selectService, setSelectedExpert } from "../redux/slices.js/search-slice";
import { toast } from 'react-toastify'
import { saveBookingToDb } from "../redux/slices.js/customer-slice";

export default function CategoryDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, categoriesBySkills } = useSelector((state) => state.expert);
  const { choosenServices, selectedExpert } = useSelector((state) => state.search);
  const { isLoggedIn, user } = useSelector((state) => state.user);
  const [selectedServices, setSelectedServices] = useState([]);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {

    if (id) {
      dispatch(expertCategoriesBySkills(id));
    }
  }, [dispatch, id]);
  
  const handleSelectService = (category, service) => {
    if (!category || !service) {
        console.error("Invalid category or service:", category, service);
        return;
    }

    const categoryId = category._id;
    const categoryName = category.name;
    const serviceDetails = { _id: service._id, serviceName: service.serviceName, price: service.price };

    setSelectedServices((prev) => {
        const existingCategory = prev.find(ele => ele._id === categoryId);

        if (existingCategory) {
            // Check if service already exists
            const serviceExists = existingCategory.services.some(s => s._id === serviceDetails._id);
            
            return prev.map(ele => 
                ele._id === categoryId
                    ? {
                        ...ele,
                        services: serviceExists
                            ? ele.services.filter(s => s._id !== serviceDetails._id) // Remove service if exists
                            : [...ele.services, serviceDetails] // Add service if not exists
                    }
                    : ele
            );
        } else {
            // If category doesn't exist, add a new one
            return [...prev, { _id: categoryId, name: categoryName, services: [serviceDetails] }];
        }
    });
};
console.log(selectedServices)

  const handleBook = () => {
    console.log(selectedServices);
    console.log(user)
    sessionStorage.setItem("selectedServices", JSON.stringify(selectedServices));
    dispatch(setSelectedExpert(selectedExpert));
    dispatch(selectService(selectedServices));
    navigate("/service-requests");
  };

  const handleSaveForLater = () => {
    if (!selectedServices.length) {
      toast.warn("Please select at least one service before saving.");
      return;
    }
    console.log("Saving booking...");
  
    if (isLoggedIn) {
      const userId = user?._id;
      dispatch(saveBookingToDb({ id: userId, expertId: id, selectedServices }))
    } else {
      toast.success("Your booking has been saved for later. Please log in to finalize.");
      setIsSaved(true);
    }
  };  
  
  return (
    <>
      <div className="flex gap-6 p-5">
        <div className="flex-1 w-1/2">
          <div className="relative left-32 space-y-6 p-2 w-3/4">
            {categoriesBySkills?.filter(category => category && category.services?.length > 0).map((category) => (
              <div key={category?._id} className="space-y-2 mt-4">
                <div className="p-2 bg-white border border-gray-200 shadow-lg rounded-lg">
                  <div className="flex justify-between items-center">
                    <p className="text-xl text-gray-900 font-semibold">{category?.name}</p>
                  </div>

                  <h2 className="text-lg font-semibold text-gray-700 mt-4">Services:</h2>
                  <div className="mt-3 space-y-3">
                    {category?.services?.map((service, index) => (
                      service && (
                        <div key={index} className="bg-gray-50 p-3 rounded-md">
                          <div className="flex justify-between">
                            <p className="text-gray-700 font-semibold text-md">{service?.serviceName}</p>
                            <p className="text-gray-700 font-semibold text-md">{service?.price}</p>
                          </div>
                          <div className="flex justify-end mt-4">
  {(() => {
    const isSelected = selectedServices.some(
      (ele) =>
        ele._id === category._id &&
        ele.services.some((s) => s._id === service._id)
    );

    return (
      <button
        onClick={() => handleSelectService(category, service)}
        className={`py-1 px-3 border text-blue-500 font-semibold rounded-md ${
          isSelected
            ? "bg-red-700 text-white"
            : "hover:bg-blue-700 hover:text-white"
        }`}
      >
        {isSelected ? "Unselect" : "Select"}
      </button>
    );
  })()}
</div>

                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-1/3 p-4 mt-4 bg-gray-100 rounded-lg mr-7 flex flex-col justify-between h-full">
  <h1 className="text-lg font-bold">Selected Services</h1>
  <div className="flex-1">
    {selectedServices?.length > 0 &&
      selectedServices.map((item) => (
        <div key={item._id} className="mt-3">
          <h2 className="text-md font-semibold">{item.name}</h2>

          {item.services.map((service) => (
            <div className="flex justify-between mb-4" key={service._id}>
              <p>{service.serviceName}</p>
              <p>${service.price}</p>
              <hr />
            </div>
          ))}
        </div>
      ))}
  </div>
  <hr />
  {selectedServices.some((item) => item.services.length > 0) && (
    <div className="flex flex-col items-end mt-2">
      <div className="flex justify-between font-bold">
        <p>Total:</p>
        <p>
          ${selectedServices
            .reduce(
              (total, item) =>
                total +
                item.services.reduce(
                  (subtotal, service) => subtotal + parseFloat(service.price || 0),
                  0
                ),
              0
            )
            .toFixed(2)}
        </p>
      </div>
      <div className="flex justify-between w-full">
        <button
          onClick={handleSaveForLater}
          className="mt-8 py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-700"
        >
          Save for Later
        </button>
        <button
          onClick={handleBook}
          className="mt-8 py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-700"
        >
          Proceed
        </button>
      </div>
    </div>
  )}
</div>
      </div>
    </>
  );
}
