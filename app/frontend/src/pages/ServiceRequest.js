import { useDispatch, useSelector } from "react-redux";
import { getAddress } from "../redux/slices.js/search-slice";
import { useState, useEffect } from "react";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

export default function ServiceRequest() {
    const { user } = useSelector((state) => state.user) || {}; 
    const { currentAddress } = useSelector((state) => state.search);
    const dispatch = useDispatch();
    const [openCalendar, setOpenCalendar] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        images: []
    });

    

    useEffect(() => {
        if (currentAddress && !formData.address) {
            setFormData((prevForm) => ({
                ...prevForm,
                address: currentAddress
            }));
        }
    }, [currentAddress]); // Removed `formData.address` to prevent unnecessary re-renders

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
            address: e.target.value || currentAddress
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data:", formData);
    };

    const handleDocumentChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData((prevForm) => ({
            ...prevForm,
            images: files
        }));
    };

    const events = Array.isArray()

    return (
        <>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8 w-full h-full max-w-5xl mx-auto p-6 shadow-lg rounded-lg">
                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <div className="flex-1">
                            <label htmlFor="name" className="w-7 text-sm font-medium text-gray-700 mb-1">Name:</label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData((prevForm) => ({
                                        ...prevForm,
                                        name: e.target.value
                                    }))
                                }
                                className="mt-1 block p-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                            />
                        </div>

                        <div className="flex-1">
                            <label htmlFor="phone_number" className="text-sm font-medium text-gray-700 mb-1">Phone Number:</label>
                            <input
                                type="text"
                                id="phone_number"
                                value={user?.phone_number || ""}
                                disabled
                                className="mt-1 block p-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                            />
                        </div>

                        <div className="flex-1">
                            <label htmlFor="location" className="text-sm font-medium text-gray-700 mb-1">Location:</label>
                            <input
                                type="text"
                                id="location"
                                value={formData.address}
                                onChange={handleLocationChange}
                                className="mt-1 block p-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                            />
                        </div>

                        <div>
                            <button
                                type="button"
                                onClick={handleGetAddress}
                                className="relative right-4 mt-6 p-1 bg-slate-500 text-white font-semibold focus:outline-none">
                                Get Current Address
                            </button>
                        </div>
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
                </div>
                <div>
                    <button
                        onClick={()=> setOpenCalendar(!openCalendar)}
                    >Open calendar</button>
                    {openCalendar && (
                        <FullCalendar 
                            plugins={[dayGridPlugin, interactionPlugin]}
                            initialView={'dayGridMonth'}
                            selectable={true}

                        />
                    )}
                </div>

                <div className="col-span-2 flex justify-center mt-4">
                    <button
                        type="submit"
                        className="py-2 px-4 bg-blue-500 text-white font-semibold shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-xs">
                        Register
                    </button>
                </div>
            </form>
        </>
    );
}
