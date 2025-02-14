import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { expertCategoriesBySkills } from "../redux/slices.js/expert-slice";
import Navbar from "../components/Navbar";
import { selectService, setSelectedExpert } from "../redux/slices.js/search-slice";

export default function CategoryDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, categoriesBySkills } = useSelector((state) => state.expert);
  const { choosenServices, selectedExpert } = useSelector((state) => state.search);
  const { isLoggedIn } = useSelector((state) => state.user);
  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    if (id) dispatch(expertCategoriesBySkills(id));

    dispatch(selectService([])); 
  }, [dispatch, id]); 

  const handleSelectService = (category, service) => {
    setSelectedServices((prev) => {
      let updatedServices = JSON.parse(JSON.stringify(prev));
      const existingCategory = updatedServices.find(
        (item) => item.category._id === category._id
      );

      if (existingCategory) {
        const serviceExists = existingCategory.servicesChoosen.some(
          (existingService) => existingService._id === service._id
        );

        if (serviceExists) {
          existingCategory.servicesChoosen = existingCategory.servicesChoosen.filter(
            (existingService) => existingService._id !== service._id
          );
        } else {
          existingCategory.servicesChoosen.push(service);
        }
      } else {
        updatedServices.push({ category, servicesChoosen: [service] });
      }

      dispatch(selectService(updatedServices));
      return updatedServices;
    });
  };

  const handleBook = () => {
    console.log(selectedServices);
    dispatch(setSelectedExpert(selectedExpert))
    dispatch(selectService(selectedServices));
    navigate("/service-requests")
  };

  return (
    <>
      <Navbar />
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
                            const isSelected = choosenServices.some(
                              (ele) =>
                                ele.category?._id === category._id &&
                                ele.servicesChoosen.some((s) => s._id === service._id)
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
            {choosenServices.length > 0 &&
              choosenServices.map(
                (item) =>
                  item.servicesChoosen.length > 0 && (
                    <div key={item.category?._id} className="mt-3">
                      <h2 className="text-md font-semibold">
                        {item.category.name}
                      </h2>

                      {item.servicesChoosen.map((service, index) => (
                        <div className="flex justify-between mb-4" key={index}>
                          <p>{service.serviceName}</p>
                          <p>{service.price}</p>
                          <hr />
                        </div>
                      ))}
                    </div>
                  )
              )}
          </div>

          <hr />

          {choosenServices.some((item) => item.servicesChoosen.length > 0) && (
            <div className="flex flex-col items-end mt-2">
              <div className="flex justify-between font-bold">
                <p>Total : </p>
                <p>
                  {choosenServices
                    .reduce(
                      (total, item) =>
                        total +
                        item.servicesChoosen.reduce(
                          (subtotal, service) =>
                            subtotal + parseFloat(service.price || 0),
                          0
                        ),
                      0
                    )
                    .toFixed(2)}
                </p>
              </div>
              <button
                className="mt-8 py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-700"
                onClick={() => handleBook(choosenServices)}
              >
                Proceed
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
