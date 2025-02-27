import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getWorkingService, payServicefee } from "../../redux/slices.js/customer-slice";

export default function ServiceInvoice() {
    const dispatch = useDispatch();
    const { workingService, loading } = useSelector((state) => state.customer);
    const { id } = useParams();
    
    useEffect(() => {
        if (id) {
            dispatch(getWorkingService(id));
        }
    }, [id, dispatch]);

    if (loading) {
        return <p className="text-center text-gray-500">Loading service details...</p>;
    }

    console.log("Working Service:", workingService);

    // ✅ Ensure values are numbers and avoid NaN errors
    const servicesTotal = Number(workingService?.serviceType?.reduce(
        (acc, type) => acc + type.servicesChoosen.reduce(
            (sum, service) => sum + (Number(service.price) || 0), 
        0), 0) || 0
    );

    const onSiteTotal = Number(workingService?.onSiteServices?.reduce(
        (acc, service) => acc + (Number(service.price) || 0),
        0
    ) || 0);

    const grandTotal = servicesTotal + onSiteTotal;

    const handleServicePay = async () => {
        try {
            const body = {
                serviceRequestId: workingService?._id,
                expertId: workingService?.expertId?._id,
                amount: grandTotal
            };
    
            const response = await dispatch(payServicefee(body)).unwrap();
    
            if (!response || !response.url) {
                console.error("Invalid response from API", response);
                return;
            }
    
            // Store the session ID (optional)
            localStorage.setItem("stripe.id", response.id);
    
            // 🔥 Redirect user to Stripe checkout page
            window.location.href = response.url;
    
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
            {/* Service Type & Chosen Services */}
            {workingService?.serviceType?.map((type) => (
                <div key={type?._id} className="border p-4 rounded-lg shadow-lg bg-white mb-4">
                    <p className="font-bold text-lg text-gray-800">{type?.category?.name}:</p>

                    <div className="mt-4 space-y-2">
                        {type?.servicesChoosen?.map((service) => (
                            <div key={service?._id} className="border p-2 rounded-md shadow-sm bg-gray-50 flex justify-between">
                                <p className="text-gray-700 font-medium">{service.serviceName}</p>
                                <p className="font-semibold text-green-600">₹{Number(service.price || 0).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* On-Site Services */}
            {workingService?.onSiteServices?.length > 0 && (
                <div className="mt-6 bg-white shadow-lg rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-3 text-gray-700">On-Site Services</h3>

                    <div className="grid grid-cols-2 gap-4 border-b pb-2 text-gray-600 font-medium">
                        <p>Service Name</p>
                        <p className="text-center">Price</p>
                    </div>

                    {workingService?.onSiteServices?.map((service) => (
                        <div key={service?._id} className="grid grid-cols-2 gap-4 py-2 border-b items-center">
                            <p className="text-gray-800">{service?.serviceName}</p>
                            <p className="text-center font-semibold text-green-600">
                                ₹{Number(service?.price || 0).toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Invoice Summary */}
            <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg text-gray-700 mb-2">Invoice Summary</h3>

                <div className="flex justify-between text-gray-800 text-md">
                    <p>Service Type Total:</p>
                    <p className="font-semibold">₹{Number(servicesTotal || 0).toFixed(2)}</p>
                </div>

                {workingService?.onSiteServices?.length > 0 && (
                    <div className="flex justify-between text-gray-800 text-md">
                        <p>On-Site Services Total:</p>
                        <p className="font-semibold">₹{Number(onSiteTotal || 0).toFixed(2)}</p>
                    </div>
                )}

                <div className="flex justify-between font-bold text-lg text-gray-900 mt-3 border-t pt-2">
                    <p>Total:</p>
                    <p>₹{Number(grandTotal || 0).toFixed(2)}</p>
                </div>
            </div>

            {/* Approve & Pay Button */}
            <button 
                className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                onClick={handleServicePay}
            >
                Approve & Pay
            </button>
        </div>
    );
}
