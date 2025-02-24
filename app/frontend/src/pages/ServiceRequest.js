import { useDispatch, useSelector } from "react-redux";
import { getAddress, setSelectedExpert } from "../redux/slices.js/search-slice";
import { useState, useEffect } from "react";
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { bookserviceRequest } from "../redux/slices.js/customer-slice";
import { useNavigate } from "react-router-dom";
import CustomerLogin from "./CustomerLogin";
import { payBookingFee } from "../redux/slices.js/service-request-slice";
import { getExpertProfile } from "../redux/slices.js/expert-slice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const formInitialState = {
    name: '',
    location : { address: '' },
    scheduleDate: '',
    serviceImages: [],
    description: ''
}

export default function ServiceRequest() {
    const { user } = useSelector((state) => state.user) || {}; 
    const { currentAddress, choosenServices, selectedExpert } = useSelector((state) => state.search);
    
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [isBooked, setIsBooked] = useState(false)
    const [ showLogin, setShowLogin] = useState(false)
    const { currentBooking, loading } = useSelector((state) => state.customer)
    const { profile } = useSelector((state) => state.expert)
    const [clientErrors, setClientErrors] = useState({})
    const errors = {}

    const [formData, setFormData] = useState(formInitialState);
    const storedServices = JSON.parse(sessionStorage.getItem("selectedServices")) || [];
    console.log(storedServices);


    useEffect(() => {
        const expertId = sessionStorage.getItem("selectedExpertId");
    
        if (expertId) {
            dispatch(getExpertProfile({ id: expertId }));
        }
    }, [dispatch]);     
    
    console.log(profile)
    
    useEffect(() => {
        if (currentAddress) {
            setFormData((prevForm) => ({
                ...prevForm,
                location : { address : currentAddress }
            }));
        }
    }, [currentAddress]);

    useEffect(()=>{
        
    },[])

    const handleGetAddress = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                console.log(lat, lng);

                try {
                    await dispatch(getAddress({ lat, lng })).unwrap();
                } catch (error) {
                    console.error("Error fetching address:", error);
                }
            }, (error) => {
                console.error("Geolocation error:", error.message);
            });
        } else {
            console.log("Geolocation not supported by this browser.");
        }
    };

    const handleLocationChange = (e) => {
        setFormData((prevForm) => ({
            ...prevForm,
            location : {...prevForm.location, address : e.target.value }
        }));
    };    

    const handleClearAddress =  () => {
        setFormData((prevForm) => ({
            ...prevForm,
            location : { address : ''}
        }));
    };

    const runClientValidations = ()=>{
        if(!user?.name.trim() && !formData.name.trim()){
            errors.name = "Name is required"
        }
        if(!user?.phone_number.length === 0 && formData.phone_number.length === 0){
            errors.phone_number = "Phone Number is required"
        }
        if(!formData.location.address.trim()){
            errors.location = "Location is required"
        }
        if(!formData.scheduleDate){
            errors.scheduleDate = "Please select date"
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        
        if (!user) {
            alert("You need to log in before booking a service.");
            localStorage.setItem("prevPath", window.location.pathname); // Store the current path
            navigate("/customerlogin");
            return;
        }

        runClientValidations()
        if(Object.keys(errors).length !== 0){
            setClientErrors(errors)
            console.log(clientErrors)
        }else{
            setClientErrors({})
            console.log("Form Data:", formData);
            const resetForm = ()=> setFormData(formInitialState)
            
            const newFormData = new FormData()
            newFormData.append('name', formData.name )
            newFormData.append('serviceType', JSON.stringify(storedServices))
            newFormData.append('description', formData.description)
            newFormData.append('location', JSON.stringify(formData.location))
            newFormData.append('scheduleDate', formData.scheduleDate)
            newFormData.append('expertId', selectedExpert?.userId?._id || profile?.userId?._id)

            formData.serviceImages.forEach((file) => {
                newFormData.append('serviceImages', file); 
            });
            
            for (let [key, value] of newFormData.entries()) {
                console.log(`${key}:`, value)
            }

            dispatch(bookserviceRequest({newFormData, resetForm}))
                .unwrap()
                .then(()=>{
                    setIsBooked(true)
                    // toast.success("Successfully Booked")
                    navigate('/my-bookings')    
                })
                .catch((err)=> console.log(err))
        }
    };

    const handleDocumentChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData((prevForm) => ({
            ...prevForm,
            serviceImages: files
        }));
    };

    return (
        <>
        {showLogin && <CustomerLogin closeLogin={() => setShowLogin(false)} />}
        <div className="grid grid-cols-2 gap-8 w-full max-w-5xl mx-auto p-6 shadow-lg rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={user?.name || formData.name}
                        disabled={user?.name}
                        onChange={(e) =>
                            setFormData((prevForm) => ({
                                ...prevForm,
                                name: e.target.value
                            }))
                        }
                        className="mt-1 block p-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    />
                    {clientErrors.name && (
                        <p className="text-red-500 text-xs text-left">{clientErrors.name}</p>
                    )}                               
                </div>
                <div>
                    <label htmlFor="phone_number" className="text-sm font-medium text-gray-700 mb-1">Phone Number:</label>
                    <input
                        type="text"
                        id="phone_number"
                        value={user?.phone_number || ""}
                        disabled
                        className="mt-1 block p-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    />
                    {clientErrors.phone_number && (
                        <p className="text-red-500 text-xs text-left">{clientErrors.phone_number}</p>
                    )} 
                </div>
                <div>
                    <label htmlFor="location" className="text-sm font-medium text-gray-700 mb-1">Location:</label>
                    <input
                        type="search"
                        id="location"
                        value={formData.location.address}
                        onChange={handleLocationChange}
                        className="mt-1 block p-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    />
                    {clientErrors.location && (
                        <p className="text-red-500 text-xs text-left">{clientErrors.location}</p>
                    )} 
                    {formData.location.address && (
                        <button
                            type="button"
                            onClick={handleClearAddress}
                            className="absolute right-3 top-10 transform -translate-y-1/2 text-gray-500"
                        >
                            x
                        </button>
                    )}
                </div>
                <button
                    type="button"
                    onClick={handleGetAddress}
                    className="p-1 bg-slate-500 text-white font-semibold  text-xs focus:outline-none">
                    Get Current Address
                </button>
                <div>
                    <label>Choose Date : </label>
                    <DatePicker
                        selected={formData.scheduleDate}
                        className="mt-1 block p-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        onChange={(date) => {
                            const formattedDate = date.toLocaleDateString("en-CA"); // Fix timezone issue
                            setFormData((prevForm) => ({
                                ...prevForm,
                                scheduleDate: formattedDate
                            }));
                        }}
                        dateFormat="dd-MM-yyyy"
                        filterDate={(date) =>
                            profile?.availability?.some(
                                (availableDate) => new Date(availableDate).toLocaleDateString("en-GB") === date.toLocaleDateString("en-GB")
                            )
                        }
                        placeholderText="Select an available date"
                    />
                    {clientErrors.scheduleDate && (
                        <p className="text-red-500 text-xs text-left">{clientErrors.scheduleDate}</p>
                    )} 
                </div>
                <div>
                    <label htmlFor="serviceImages" className="block text-sm font-medium text-gray-700 mb-1">Service Images:</label>
                    <input
                        type="file"
                        id="serviceImages"
                        multiple
                        onChange={handleDocumentChange}
                        className="mt-1 block p-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    />
                </div>
                <div className="col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description:</label>
                    <textarea 
                        id="description"
                        rows="2"
                        onChange={(e) => setFormData((prevForm) => ({
                            ...prevForm,
                            description: e.target.value
                        }))}
                        className="mt-1 block p-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    />
                </div>
                {!isBooked && (
                    <button
                    type="submit"
                    className="py-2 px-4 bg-blue-500 text-white font-semibold shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full flex items-center justify-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25"cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3-3-3h4z"></path>
                        </svg>
                        Booking...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </button>
                  
                )}
            </form>

            <div className="p-4 bg-gray-100 rounded-lg flex flex-col justify-between h-full">
                <h1 className="text-lg font-bold">Booking Summary</h1>
                
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                        <p className="font-medium text-sm">Name:</p>
                        <p className="text-sm">{formData.name || user?.name || "-"}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="font-medium text-sm">Phone Number:</p>
                        <p className="text-sm">{user?.phone_number || "-"}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="font-medium text-sm">Location: </p>
                        <p className="text-right text-sm">{formData.location.address || "-"}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="font-medium text-sm">Service Date: </p>
                        <p className="text-right text-sm">{new Date(formData.scheduleDate).toLocaleDateString("en-GB") || "-"}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="font-medium text-sm">Description:</p>
                        <p className="text-right text-sm">{formData.description || "-"}</p>
                    </div>
                </div>

                <hr className="my-4" />

                <h1 className="text-lg font-bold">Selected Services</h1>
                <div className="flex-1">
                {storedServices?.length > 0 &&
                    storedServices?.map(
                        (item) => (
                                <div key={item?._id} className="mt-3">
                                    <h2 className="text-sm font-semibold mb-2">{item?.name}</h2>
                                    {item.services.map((service, index) => (
                                        <div className="flex justify-between mb-1" key={index}>
                                            <p className="text-sm">{service.serviceName}</p>
                                            <p className="text-sm">{service.price}</p>
                                        </div>
                                    ))}
                                </div>
                            )
                    )}
                </div>

                {storedServices?.some((item) => item?.services?.length > 0) && (
                <div>
                    <div className="flex justify-between">
                        <p className="text-sm text-gray-700">Booking Fee:</p>
                        <p className="text-sm text-gray-700">50.00</p>
                    </div>
                    <hr className="my-4" />
                    <div className="flex justify-between font-bold text-lg">
                        <p className="text-md">Total:</p>
                        <p className="text-md">
                            {storedServices.reduce(
                                (total, category) =>
                                    total +
                                    category.services.reduce(
                                        (subtotal, service) => subtotal + parseFloat(service.price || 0),
                                        0
                                    ),
                                50 // Initial value (booking fee)
                            ).toFixed(2)}
                        </p>
                    </div>
                </div>
            )}
            </div>
        </div>
        </>
    );
}
