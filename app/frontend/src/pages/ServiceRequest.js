import { useDispatch, useSelector } from "react-redux";
import { getAddress, setSelectedExpert } from "../redux/slices.js/search-slice";
import { useState, useEffect } from "react";
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { bookserviceRequest } from "../redux/slices.js/customer-slice";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CustomerLogin from "./CustomerLogin";
import { payBookingFee } from "../redux/slices.js/service-request-slice";
import { getExpertProfile } from "../redux/slices.js/expert-slice";

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
    // const [greetCard, setGreetCard] = useState(false)
    const navigate = useNavigate()
    const [isBooked, setIsBooked] = useState(false)
    const [ showLogin, setShowLogin] = useState(false)
    const [bookedData, setBookedData] = useState(null)
    const { currentBooking } = useSelector((state) => state.customer)
    console.log(selectedExpert)
    const { profile } = useSelector((state) => state.expert)

    useEffect(()=>{
        if(profile?.userId?._id)
        dispatch(getExpertProfile(profile?.userId?._id))
    },[dispatch])

    const [formData, setFormData] = useState(formInitialState);

    useEffect(() => {
        if (currentAddress) {
            setFormData((prevForm) => ({
                ...prevForm,
                location : { address : currentAddress }
            }));
        }
    }, [currentAddress]);

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

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (!user) {
            localStorage.setItem("prevPath", window.location.pathname); // Store the current path
            navigate("/customerlogin");
            return;
        }

        console.log("Form Data:", formData);
        const resetForm = ()=> setFormData(formInitialState)

        const newFormData = new FormData()
        newFormData.append('name', formData.name)
        newFormData.append('serviceType', JSON.stringify(choosenServices))
        newFormData.append('description', formData.description)
        newFormData.append('location', JSON.stringify(formData.location))
        newFormData.append('scheduleDate', formData.scheduleDate)
        newFormData.append('expertId', selectedExpert?.userId?._id)

        formData.serviceImages.forEach((file, index) => {
            newFormData.append('serviceImages', file); 
        });
        
        for (let [key, value] of newFormData.entries()) {
            console.log(`${key}:`, value)
        }

        await dispatch(bookserviceRequest({newFormData}))
            .unwrap()
            .then(()=>{
                setIsBooked(true)
            })
            .catch((err)=>{
                console.log(err)
            })
        // setGreetCard(true)
    };

    const handleDocumentChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData((prevForm) => ({
            ...prevForm,
            serviceImages: files
        }));
    };

    // const makePayment = async () => {
    //     console.log(currentBooking)
    //     try{
    //         const body = {
    //             serviceRequestId : currentBooking?._id,
    //             amount : currentBooking?.budget.bookingFee
    //         }
    //         const response =  await dispatch(payBookingFee(body)).unwrap()

    //         if(!response){
    //             console.error("Invalid response from API:", response);
    //             return;
    //         }

    //         localStorage.setItem('stripeId', response?.id)

    //         window.location = response?.url
    //     }catch(err){
    //         console.log(err)
    //     }
    // }

    return (
        <>
        
        
            <Navbar />
            {showLogin && <CustomerLogin closeLogin={() => setShowLogin(false)} />}
        <div className="grid grid-cols-2 gap-8 w-full max-w-5xl mx-auto p-6 shadow-lg rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name || user?.name}
                        // disabled={user.name}
                        onChange={(e) =>
                            setFormData((prevForm) => ({
                                ...prevForm,
                                name: e.target.value
                            }))
                        }
                        className="mt-1 block p-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    />
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
                </div>
                <div className="relative">
                    <label htmlFor="location" className="text-sm font-medium text-gray-700 mb-1">Location:</label>
                    <input
                        type="search"
                        id="location"
                        value={formData.location.address}
                        onChange={handleLocationChange}
                        className="mt-1 block p-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-96"
                    />
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
                    <button type="submit"
                    className="py-2 px-4 bg-blue-500 text-white font-semibold shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        >
                        Confirm Booking
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
                    {choosenServices.length > 0 &&
                        choosenServices.map(
                            (item) =>
                                item.servicesChoosen.length > 0 && (
                                    <div key={item.category._id} className="mt-3">
                                        <h2 className="text-sm font-semibold mb-2">{item.category.name}</h2>
                                        {item.servicesChoosen.map((service, index) => (
                                            <div className="flex justify-between mb-1" key={index}>
                                                <p className="text-sm">{service.serviceName}</p>
                                                <p className="text-sm">{service.price}</p>
                                            </div>
                                        ))}
                                    </div>
                                )
                        )}
                </div>

                {choosenServices.some((item) => item.servicesChoosen.length > 0) && (
                    <div>
                        <div className="flex justify-between">
                            <p className="text-sm text-gray-700">Booking Fee:</p>
                            <p className="text-sm text-gray-700">50.00</p>
                        </div>
                        <hr className="my-4" />
                        <div className="flex justify-between font-bold text-lg">
                            <p className="text-md">Total:</p>
                            <p className="text-md">
                                {choosenServices.reduce(
                                    (total, item) =>
                                        total + item.servicesChoosen.reduce(
                                            (subtotal, service) => subtotal + parseFloat(service.price || 0),
                                            0
                                        ),
                                    50
                                ).toFixed(2)}
                            </p>
                        </div>
                    </div>
                )}
                {/* {isBooked && (
                    <button type="submit" 
                    onClick={makePayment}
                    className="py-2 px-4 bg-blue-500 text-white font-semibold shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full">
                        Pay Booking Fee
                    </button>
                )} */}
                
            </div>
            {/* {greetCard && (
                <div
                className="absolute top-1/2 left-1/2 bg-opacity-50 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg rounded-lg p-6 w-96 text-center z-50"
                >
                    <h1>Thank you!! </h1>
                    <button
                        onClick={()=> navigate('/')}
                    >Home</button>
                </div>
            )} */}
        </div>
        </>
    );
}
