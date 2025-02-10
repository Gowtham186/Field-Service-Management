import { useEffect, useState } from "react";
import '../App.css'
import CreatableSelect from 'react-select/creatable'
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from 'uuid'
import { deleteCategoryAndServices, deleteManyServices, deleteService, getCategoriesWithServices, newCategoryWithServices, updateCategoryWithServices } from "../redux/slices.js/category-slice";
import { fetchSkills } from "../redux/slices.js/expert-slice";

export default function ManageCategories() {
  const dispatch = useDispatch();
  const { categoriesWithServices, loading } = useSelector((state) => state.category);
  const [editItem, setEditItem] = useState(null);
  const [deletedServices, setDeletedServices] = useState([]);
  const [newServices, setNewServices] = useState([]);
  const [clientErrors, setClientErrors] = useState({})
  const [options, setOptions] = useState([])

  useEffect(() => {
    dispatch(getCategoriesWithServices());
  }, [dispatch]);
  
  useEffect(() => {
    dispatch(fetchSkills()).unwrap().then((data) => {
        const newData = data?.map(ele => ({ value: ele._id, label: ele.name }));
        setOptions(newData);

        // Set default value for skill if it exists in editItem
        if (editItem?.skill && typeof editItem.skill === 'object' && editItem.skill.name) {
            setEditItem((prev) => ({
                ...prev,
                skill: newData.find((s) => s.label === editItem.skill.name) || null,
            }));
        }
    });
}, [dispatch, editItem?.skill]);

const handleCreate = (inputValue) => {
    const formatInput = inputValue.slice(0, 1).toUpperCase() + inputValue.slice(1);
    const newOption = { value: formatInput, label: formatInput };

    setOptions((prevOptions) => [...prevOptions, newOption]);
    setEditItem((prev) => ({
        ...prev,
        skill: newOption, // Set newly created skill
    }));
};

const handleSelectSkills = (selectedOption) => {
    setClientErrors((prevErrors) => ({ ...prevErrors, skills: null }));

    setEditItem((prevForm) => ({
        ...prevForm,
        skill: selectedOption, // Update selected skill
    }));
};

if(loading){
  return <p>fetching categories</p>
}

  
  const errors = {
    serviceName :[], price:[]
  }

  const validations = (updateItem)=>{
    if(!updateItem.name){
      errors.category = "Category name should not be empty"
    } else if (/\d/.test(updateItem.name)) {  // Checks if the category name contains any numbers
      errors.category = "Category name should not contain numbers";
    }

    if(!updateItem.skill){
      errors.skill = "Category skill should not be empty"
    } else if (/\d/.test(updateItem.skill)) {  // Checks if the category skill contains any numbers
      errors.category = "Category skill should not contain numbers";
    }

      updateItem.services.forEach((ele, i) => {
      if(ele.serviceName === "" ){
        if(!errors.serviceName){
          errors.serviceName = []
        }
        errors.serviceName.push(ele._id || ele.id)
      }

      if(ele.price === "" || isNaN(ele.price) || Number(ele.price <= 0)){
        errors.price.push(ele._id || ele.id)
      }
    })
  }

  const handleEdit = (item) => {
    console.log(item)
    setEditItem({ ...item });
    setDeletedServices([]);
    document.body.style.overflow = "hidden"; 
  };

  const handleEditForm = async (e) => {
    e.preventDefault();

    console.log(newServices)
    console.log(deletedServices)
    console.log(editItem);
    
    validations(editItem)
    console.log(Object.values(errors).every(arr => arr.length === 0))
    if(Object.values(errors).every(arr => arr.length === 0)){
      setClientErrors({})
        try {
          if (deletedServices.length > 0) {
            if (deletedServices.length > 1) {
              await dispatch(deleteManyServices({ serviceIds: deletedServices })).unwrap();
            } else {
            await dispatch(deleteService(deletedServices[0])).unwrap();
          }

          // After deletion, update the category with the remaining services
          const updatedServices = editItem.services.filter(service => !deletedServices.includes(service._id));
          await dispatch(updateCategoryWithServices({ id: editItem?._id, updatedItem: { ...editItem, services: updatedServices } })).unwrap();
        }
        else if(editItem.hasOwnProperty('_id')){
          // In case no service was deleted, directly update the category
          await dispatch(updateCategoryWithServices({ id: editItem?._id, updatedItem: editItem })).unwrap();
        }else{
          console.log('new category')
          await dispatch(newCategoryWithServices(editItem)).unwrap()
        }
        
        setEditItem(null);
        setDeletedServices([]);
        document.body.style.overflow = "auto"; 
        
      } catch (err) {
        console.log(err);
      }
      
    }else{
      setClientErrors(errors)
      console.log(errors)
      
    }
  };

  const handleAddService = () => {
    const newService = { id: uuidv4(), serviceName: "", price: "" };

    setNewServices((prevNewServices) => [...prevNewServices, newService]);

    setEditItem((prevEditItem) => ({
      ...prevEditItem,
      services: [...prevEditItem.services, newService]
    }));
  };

  const handleMarkForDeletion = (serviceId) => {
    const serviceInNewServices = newServices.find(service => service.id === serviceId) //if its newly added service
    const serviceInDeletedServices = deletedServices.includes(serviceId) //already in deletedServices - duplication

    if (serviceInNewServices) {
      setDeletedServices((prevDeletedServices) => prevDeletedServices.filter(id => id !== serviceId))

      setNewServices((prevNewServices) => prevNewServices.filter(newService => newService.id !== serviceId))
      
      setEditItem({
        ...editItem,
        services: editItem.services.filter(service => service.id !== serviceId)
      })
    } else if (!serviceInDeletedServices) {
      setDeletedServices([...deletedServices, serviceId])
    }
  };

  const handleServiceChange = (e, serviceId) => {
    const { name, value } = e.target;

    const updatedServices = editItem.services.map((service) =>
      service.id === serviceId || service._id === serviceId
        ? { ...service, [name]: value }
        : service
    );
    setEditItem({ ...editItem, services: [...updatedServices] });
  };

  const handleCancel = () => {
    setEditItem(null);
    setClientErrors({})
    setDeletedServices([]);
    setNewServices([]);
    document.body.style.overflow = "auto";
  };

  const handleDeleteCategory = (ele)=>{
    console.log(ele._id)
    const getConfirm = window.confirm("Are you sure? you wanna delete a category?")
    if(getConfirm){
      dispatch(deleteCategoryAndServices(ele._id))
    }
  }

  const handleUndoService = (serviceId)=>{
    console.log(serviceId)
    setDeletedServices((prevDeletedServices) => prevDeletedServices.filter(deletedService => deletedService !== serviceId))
  }

  const handleNewCategory = ()=>{
    setEditItem({
      id : uuidv4(),
      skill : "",
      services:[]
    })
  }

  return (
    <div className="relative max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Manage Categories</h1>
      <button className="mb-4 py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
        onClick={handleNewCategory}
        >
        Add New Category
      </button>

      {categoriesWithServices?.length > 0 ? (
        <div className="space-y-6">
          {categoriesWithServices.map((ele) => (
            <div key={ele._id} className="p-6 bg-white border border-gray-200 shadow-lg rounded-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-700">Category:</h2>
                <p className="text-lg font-medium text-gray-900">{ele.name}</p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <h2 className="text-lg font-semibold text-gray-700">Skill:</h2>
                <p className="text-lg font-medium text-gray-900">{ele.skill.name}</p>
              </div>


              <h2 className="text-lg font-semibold text-gray-700 mt-4">Services:</h2>
              <div className="mt-3 space-y-3">
                {ele.services?.map((service, index) => (
                  service ? (
                    <div key={index} className="bg-gray-50 p-3 rounded-md">
                      <div className="flex justify-between">
                        <p className="text-gray-700 font-medium">Service Name: {service?.serviceName}</p>
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
              <button
                onClick={() => handleDeleteCategory(ele)}
                className="mt-4 ml-2 py-1 px-3 border border-red-500 text-red-500 font-semibold rounded-md hover:bg-red-700 hover:text-white"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg">No categories available.</p>
      )}

      {editItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="edit-form-container p-6 bg-white shadow-md rounded-md max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">Edit Category & Services</h2>
            <form onSubmit={handleEditForm}>
              <div className="grid grid-cols-2 items-center gap-4">
                <label className="text-gray-900 font-medium">Category:</label>
                <input
                  type="text"
                  value={editItem.name}
                  onChange={(e) => {
                    setEditItem({ ...editItem, name: e.target.value })
                    setClientErrors({ ...clientErrors, name : null})
                  }}
                  className="border-gray-300 p-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {clientErrors && <p className="relative text-red-500 text-xs left-56 bottom-4">{clientErrors.category}</p>}
              </div>
              
              <div  className="grid grid-cols-2 items-center gap-4">
                  <label htmlFor="skills" className=" text-sm font-medium text-gray-700 mb-1">Skills :</label>
                  <CreatableSelect
                      options={options}
                      onCreateOption={handleCreate}
                      id="skills"
                      onChange={handleSelectSkills}
                      className="w-full "
                      value={editItem.skill ? { label: editItem.skill.label, value: editItem.skill.value } : null}
                  />
                  {clientErrors && ( <p className="text-red-500 text-xs">{clientErrors.skills}</p>)}
              </div>

              <label className="text-gray-900 font-medium block">Services:</label>
              {editItem.services?.map((ele, i) => (
                <div key={ele.id || ele._id} className="grid grid-cols-2 items-center gap-2 mb-4 bg-gray-200 p-2 rounded-md">
                  <label className="text-gray-600">Service Name:</label>
                  <input
                    type="text"
                    name="serviceName"
                    value={ele.serviceName}
                    onChange={(e) => handleServiceChange(e, ele.id || ele._id)}
                    className={`p-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100 
                      ${clientErrors?.serviceName?.some(errorService => errorService === ele.id || errorService === ele._id) ? 'border-red-500 border-2' : 'border-gray-300'}`}
                      placeholder={clientErrors?.serviceName?.some(errorService => errorService === ele.id || errorService === ele._id) ? " Enter a valid name" : ""}
                     />

                  <label className="text-gray-600">Price:</label>
                  <input
                    type="text"
                    name="price"
                    value={ele.price}
                    onChange={(e) => handleServiceChange(e, ele.id || ele._id)}
                    className={`p-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100 
                      ${clientErrors?.price?.some(errorService => errorService === ele.id || errorService === ele._id) ? 'border-red-600 border-2 ' : 'border-gray-300'}`}
                      placeholder={clientErrors?.price?.some(errorService => errorService === ele.id || errorService === ele._id) ? " Enter a valid price" : ""}
                  />

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => handleMarkForDeletion(ele._id || ele.id)}
                      disabled={deletedServices.includes(ele._id)}
                      className={`px-2 border text-right w-16 ${
                        deletedServices.includes(ele._id)
                          ? "border-gray-400 text-gray-400"
                          : "border-red-500 text-red-500 hover:bg-red-700 hover:text-white"
                      } rounded-md`}
                    >
                      Delete
                    </button>

                    {/* {ele.id && (ele.serviceName !== "" && ele.price !== "") && (
                    <button
                      onClick={() => handleSaveService(ele._id || ele.id)}
                      className="px-2 border text-right w-16 border-green-500 text-green-500 hover:bg-green-700 hover:text-white rounded-md"
                    >
                      Save
                    </button>
                  )} */}

                    {deletedServices.length > 0 && 
                      deletedServices.filter(deletedService => deletedService === ele._id || deleteService === ele.id)
                        .map(deletedService => (
                          <button key={ele._id || ele.id}
                            onClick={()=> handleUndoService(ele._id || ele.id)}
                            className="relative right-16 ml-1 px-2 border text-right w-14 border-green-500 text-green-500 hover:bg-green-700 hover:text-white rounded-md"
                          >Undo</button>
                        ))
                    }

                  </div>
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
                    Save All
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
