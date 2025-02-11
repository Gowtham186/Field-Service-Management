import { MapContainer, TileLayer, Marker, Popup, Circle, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from 'leaflet';
import { useDispatch } from "react-redux";
import { setSelectedExpert } from "../redux/slices.js/search-slice";
import { useNavigate } from "react-router-dom";

const expertIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

export default function FilteredExpertsMap({ resultsExperts, searchLocation, coords }) {
    const [experts, setExperts] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        setExperts(resultsExperts);
    }, [resultsExperts]);

    const handleViewDetails = (expert) => {
        dispatch(setSelectedExpert(expert));
        navigate(`/experts/${expert.userId._id}`);
    };

    const defaultCenter = [13.5937, 77.9629];
    const mapCenter = coords?.lat && coords?.lng ? [coords.lat, coords.lng] : defaultCenter;

    return (
        <div className="flex flex-row w-full h-4/5 p-4">
            <div className="w-3/5 h-full">
                <MapContainer 
                    center={mapCenter} 
                    zoom={10} 
                    className="h-full w-full rounded-lg shadow-md"
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    
                    {/* ✅ Show search area circle if valid */}
                    {coords?.lat && coords?.lng && (
                        <Circle 
                            center={[coords.lat, coords.lng]} 
                            radius={10000} // 10 km radius
                            color="lightblue"
                            fillColor="lightblue"
                            fillOpacity={0.2}
                        />
                    )}

                    {/* ✅ Show user's location with a light blue dot */}
                    {coords?.lat && coords?.lng && (
                        <CircleMarker 
                            center={[coords.lat, coords.lng]} 
                            radius={10} 
                            color="lightblue" 
                            fillColor="lightblue" 
                            fillOpacity={2}
                        >
                            <Popup>
                                <div className="text-black font-bold">
                                    <p>Your Location</p>
                                    <p>Lat: {coords.lat}</p>
                                    <p>Lng: {coords.lng}</p>
                                </div>
                            </Popup>
                        </CircleMarker>
                    )}

                    {/* ✅ Display experts only if they have valid coordinates */}
                    {experts?.map((expert) => {
                        const { lat, lng } = expert.location.coords || {};
                        if (lat === undefined || lng === undefined) return null;

                        return (
                            <Marker key={expert._id} position={[lat, lng]} icon={expertIcon}>
                                <Popup>
                                    <div className="text-black font-bold">
                                        <p>Name: {expert.userId.name}</p>
                                        <p>Experience: {expert.experience} years</p>
                                        <p>Services:</p>
                                        {expert?.skills?.map((ele, index) => (
                                            <span className="bg-yellow-400 text-white px-2 py-1 rounded-md mr-1" key={index}>{ele.name}</span>
                                        ))}
                                        <p className="mt-2 text-gray-700">Lat: {lat}, Lng: {lng}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </div>

            {/* Sidebar for experts */}
            <div className="w-2/5 h-full overflow-y-auto p-4 bg-white shadow-md rounded-lg">
                {resultsExperts?.length > 0 ? (
                    resultsExperts.map((expert) => (
                        <div key={expert.userId._id} className="bg-gray-100 p-4 mb-4 rounded-lg shadow-sm">
                            <h1 className="text-xl font-semibold mb-2">{expert.userId.name}</h1>
                            <p className="text-gray-700"><span className="font-semibold">Experience:</span> {expert.experience} years</p>
                            <p className="text-gray-700"><span className="font-semibold">Ratings:</span> 4</p>
                            <p className="text-gray-700"><span className="font-semibold">Address:</span> {expert.location.address}</p>
                            <button 
                                className="bg-blue-500 text-white p-2 rounded-md cursor-pointer hover:bg-blue-600 mt-2"
                                onClick={() => handleViewDetails(expert)}
                            >
                                View Details
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-red-500 text-center mt-4">No experts found.</p>
                )}
            </div>
        </div>
    );
}
