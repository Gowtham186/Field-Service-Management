import { useEffect, useState } from "react";
import '../App.css'
import { useDispatch, useSelector } from "react-redux";
import { deleteManyServices, deleteService, getCategoriesWithServices,updateCategoryWithServices } from "../redux/slices.js/category-slice";

export default function ManageCategories() {
  const dispatch = useDispatch();
  const { categoriesWithServices } = useSelector((state) => state.category);
  const [editItem, setEditItem] = useState(null);
  const [deletedServices, setDeletedServices] = useState([]);

  useEffect(() => {
    dispatch(getCategoriesWithServices());
  }, [dispatch]);

  const handleEdit = (item) => {
    setEditItem({ ...item });
    setDeletedServices([]);
    document.body.style.overflow = "hidden"; 
  };

  const handleEditForm = async (e) => {
    e.preventDefault();
    console.log(editItem);
  
    try {
      if (deletedServices.length > 0) {
        if (deletedServices.length > 1) {
          await dispatch(deleteManyServices({ serviceIds: deletedServices })).unwrap();
        } else {
          await dispatch(deleteService(deletedServices[0])).unwrap();
        }
  
        // After deletion, we update the category with the remaining services
        const updatedServices = editItem.services.filter(service => !deletedServices.includes(service._id));
        await dispatch(updateCategoryWithServices({
          id: editItem?._id,
          updatedItem: {
            ...editItem,
            services: updatedServices // Ensure deleted services are excluded
          }
        })).unwrap();
      } else {
        // In case no service was deleted, directly update the category
        await dispatch(updateCategoryWithServices({
          id: editItem?._id,
          updatedItem: editItem
        })).unwrap();
      }
  
      setEditItem(null);
      setDeletedServices([]);
      document.body.style.overflow = "auto"; 
  
    } catch (err) {
      console.log(err);
    }
  };
  

  const handleAddService = () => {
    setEditItem({
      ...editItem,
      services: [...editItem.services, { id: Number(new Date()), serviceName: "", price: "" }],
    });
  };

  const handleMarkForDeletion = (serviceId) => {
    if (!deletedServices.includes(serviceId)) {
      setDeletedServices([...deletedServices, serviceId]);
    }
  };

  const handleCancel = ()=>{
    setEditItem(null)
    setDeletedServices([])
    document.body.style.overflow = "auto";
  }

  return (
    <div className="relative max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Manage Categories</h1>
      <button className="mb-4 py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
        Add New Category
      </button>

      {categoriesWithServices?.length > 0 ? (
        <div className="space-y-6">
          {categoriesWithServices.map((ele) => (
            <div key={ele._id} className="edit-form-container p-6 bg-white border border-gray-200 shadow-lg rounded-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-700">Category:</h2>
                <p className="text-lg font-medium text-gray-900">{ele.name}</p>
              </div>

              <h2 className="text-lg font-semibold text-gray-700 mt-4">Services:</h2>
              <div className="mt-3 space-y-3">
                {ele.services?.map((service, index) => (
                  service ? (
                    <div key={index} className="bg-gray-50 p-3 rounded-md">
                      <div className="flex justify-between">
                        <p className="text-gray-700 font-medium">Service: {service?.serviceName}</p>
                        <p className="text-gray-700 font-medium">Price: {service?.price}</p>
                      </div>
                    </div>
                  ) : null
                ))}
              </div>

              <button
                onClick={() => handleEdit(ele)}
                className="mt-4 py-1 px-3 border border-blue-500 text-blue-500 font-semibold rounded-md hover:bg-blue-700 hover:text-white"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg">No categories available.</p>
      )}

      {editItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="p-6 bg-white shadow-md rounded-md max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">Edit Category & Services</h2>
            <form onSubmit={handleEditForm}>
              <div className="grid grid-cols-2 items-center gap-4">
                <label className="text-gray-900 font-medium">Category:</label>
                <input
                  type="text"
                  value={editItem.name}
                  onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                  className="p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <label className="text-gray-900 font-medium block">Services:</label>
              {editItem.services?.map((ele, i) => (
                <div key={i} className="grid grid-cols-2 items-center gap-2 mb-4 bg-gray-200 p-2 rounded-md">
                  <label className="text-gray-600">Name:</label>
                  <input
                    type="text"
                    value={ele.serviceName}
                    onChange={(e) => {
                      const updatedServices = editItem.services.map((service) =>
                        service._id === ele._id ? { ...service, serviceName: e.target.value } : service
                      );
                      setEditItem({ ...editItem, services: updatedServices });
                    }}
                    className="p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <label className="text-gray-600">Price:</label>
                  <input
                    type="text"
                    value={ele.price}
                    onChange={(e) => {
                      const updatedServices = editItem.services.map((service) =>
                        service._id === ele._id ? { ...service, price: e.target.value } : service
                      );
                      setEditItem({ ...editItem, services: updatedServices });
                    }}
                    className="p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    onClick={() => handleMarkForDeletion(ele._id)}
                    disabled={deletedServices.includes(ele._id)}
                    className={`px-2 border text-right w-16 ${
                      deletedServices.includes(ele._id)
                        ? "border-gray-400 text-gray-400"
                        : "border-red-500 text-red-500 hover:bg-red-700 hover:text-white"
                    } rounded-md`}
                  >
                    Delete 
                  </button>
                </div>
              ))}

            <div className="flex justify-between mt-4">
            <button
                type="button"
                className="py-1 px-3 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                onClick={handleAddService}
            >
                Add Service
            </button>

            <div className="ml-auto flex space-x-3">
                <button
                type="submit"
                className="py-1 px-3 bg-green-600 text-white  rounded-md hover:bg-green-700"
                >
                Save
                </button>
                <button
                type="button"
                className="py-1 px-2 bg-red-500 text-white rounded-md hover:bg-red-700"
                onClick={handleCancel}
                >
                Cancel
                </button>
            </div>
            </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
