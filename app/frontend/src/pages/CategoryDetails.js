import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategoriesWithServices } from "../redux/slices.js/category-slice";

export default function CategoryDetails() {
  const dispatch = useDispatch();
  const { categoriesWithServices, loading } = useSelector((state) => state.category);
  const { profile } = useSelector((state) => state.expert);
  
  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    dispatch(getCategoriesWithServices());
  }, []);

  const expertSkills = categoriesWithServices?.filter(category =>
    profile?.skills?.some(skill => skill._id === category.skill._id)
  );

  if (loading) {
    return <p>...loading</p>;
  }

  const handleSelectService = (category, service) => {
    //console.log(category, service);

    let updatedServices = [...selectedServices]

    const existingCategory = updatedServices.find(item => item.category._id === category._id)

    if(existingCategory){
        const serviceExists = existingCategory.servicesChoosen.some((existingService) => existingService._id === service._id)

        if(serviceExists){
            existingCategory.servicesChoosen = existingCategory.servicesChoosen.filter(
                (existingService) => existingService._id !== service._id
            )
        }else{
            existingCategory.servicesChoosen.push(service)
        }

    }else{
        updatedServices.push({ category, servicesChoosen : [service]})
    }

    setSelectedServices(updatedServices)
  };

  const handleBook = ()=>{
    console.log(selectedServices)
  }

  return (
    <>
      {categoriesWithServices?.length > 0 ? (
        <div className="flex gap-6 p-5">
          {/* Left column for Categories and Services */}
          <div className="flex-1 w-1/2">
            <div className="relative left-32 space-y-6 p-2 w-3/4">
              {expertSkills?.map((category) => (
                <div key={category._id} className="space-y-2 mt-4">
                  <div className="p-2 bg-white border border-gray-200 shadow-lg rounded-lg">
                    <div className="flex justify-between items-center">
                      <p className="text-xl text-gray-900 font-semibold">{category.name}</p>
                    </div>

                    <h2 className="text-lg font-semibold text-gray-700 mt-4">Services:</h2>
                    <div className="mt-3 space-y-3">
                      {category.services?.map((service, index) => (
                        service ? (
                          <div key={index} className="bg-gray-50 p-3 rounded-md">
                            <div className="flex justify-between">
                              <p className="text-gray-700 font-semibold text-md">{service?.serviceName}</p>
                              <p className="text-gray-700 font-semibold text-md">{service?.price}</p>
                            </div>
                            <div className="flex justify-end mt-4">
                              <button
                                onClick={() => handleSelectService(category, service)}
                                className={`py-1 px-3 border text-blue-500 font-semibold rounded-md 
                                    ${selectedServices.some(ele => ele.category._id === category._id && 
                                      ele.servicesChoosen.some(s => s._id === service._id)) ? 
                                    'bg-red-700 text-white' : 'hover:bg-blue-700 hover:text-white'}`}                              >
                                {selectedServices.some(ele => ele.category._id === category._id &&
                                    ele.servicesChoosen.some(s => s._id === service._id)) ? 'Unselect' : 'Select'}
                              </button>
                            </div>
                          </div>
                        ) : null
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
    {selectedServices.length > 0 && (
      selectedServices.map((item) => (
        item.servicesChoosen.length > 0 && (
          <div key={item.category._id} className="mt-3">
            <h2 className="text-md font-semibold">{item.category.name}</h2>

            {item.servicesChoosen.map((service, index) => (
              <div className="flex justify-between mb-4" key={index}>
                <p>{service.serviceName}</p>
                <p>{service.price}</p>
                <hr />
              </div>
            ))}
          </div>
        )
      ))
    )}
  </div>

  <hr />
  
  {selectedServices.length > 0 && (
    <div className="flex flex-col items-end mt-2">
      <div className="flex justify-between font-bold">
        <p>Total:</p>
        <p>
          {selectedServices
            .reduce(
              (total, item) =>
                total + item.servicesChoosen.reduce(
                  (subtotal, service) => subtotal + parseFloat(service.price || 0),
                  0
                ),
              0
            )
            .toFixed(2)}
        </p>
      </div>
      <button className="mt-4 py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-700"
        onClick={handleBook}
      >
        Book Now
      </button>
    </div>
  )}
</div>

        </div>
      ) : (
        <p>No categories available</p>
      )}
    </>
  );
}
