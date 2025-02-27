import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { ShoppingCart } from "lucide-react";
import Navbar from "../../components/Navbar";

export default function Cart() {
    const [savedBookings, setSavedBookings] = useState(null);

    useEffect(() => {
        let savedData = sessionStorage.getItem("savedBookings");
        console.log(savedData)
        if (!savedData) {
            savedData = Cookies.get("savedBookings");
        }

        if (savedData) {
            setSavedBookings(JSON.parse(savedData));
            console.log('from cookies',savedData)
        }
    }, []);

    return (
        <>
            <Navbar />
            <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
                <div className="flex items-center gap-2 mb-4">
                    <ShoppingCart size={24} className="text-orange-500" />
                    <h2 className="text-2xl font-bold text-gray-800">Total </h2>
                </div>
                {savedBookings ? (
                    <div className="space-y-4">
                        <p className="text-gray-700">
                            <strong className="text-orange-500">Expert ID:</strong> {savedBookings.expertId}
                        </p>
                        <h3 className="text-xl font-semibold text-gray-800">Selected Services:</h3>
                        <ul className="space-y-4">
                            {savedBookings.selectedServices.map((service, index) => (
                                <div key={index} className="border p-4 rounded-md bg-gray-100">
                                    <p className="text-lg font-medium text-orange-600">
                                        Category: {service.category.name}
                                    </p>
                                    <div className="mt-2 space-y-2">
                                        {service?.servicesChoosen?.map((ele, i) => (
                                            <div key={i} className="p-3 bg-white rounded-md shadow-sm">
                                                <p className="text-gray-800">
                                                    <span className="font-medium text-orange-500">Service:</span> {ele.serviceName}
                                                </p>
                                                <p className="text-gray-600">
                                                    <span className="font-medium text-orange-500">Price:</span> ₹{ele.price}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p className="text-gray-500">No saved bookings found.</p>
                )}
            </div>
        </>
    );
}
