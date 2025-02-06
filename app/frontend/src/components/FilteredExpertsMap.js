import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from 'leaflet'
import { useDispatch } from "react-redux";
import { setSelectedExpert } from "../redux/slices.js/search-slice";
import { useNavigate } from "react-router-dom";

const customIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // Example icon
    iconSize: [32, 32], // Size of the icon
    iconAnchor: [16, 32], // Anchor point
    popupAnchor: [0, -32], // Popup position
});

export default function FilteredExpertsMap({ resultsExperts, searchLocation }) {
    const [experts, setExperts] = useState(null);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        setExperts(resultsExperts);
    }, [resultsExperts]);

    

    const handleViewDetails = (expert)=>{
        //console.log('view details', expert)
        dispatch(setSelectedExpert(expert))
        navigate(`/experts/${expert.userId._id}`)
    }

    return (
        <div className="flex flex-row w-full h-screen p-4">
            <div className="w-3/5 h-full">
                <MapContainer center={[13.5937, 77.9629]} zoom={7} className="h-full w-full rounded-lg shadow-md">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {experts?.map((expert) => (
                        <Marker key={expert._id} position={[expert.location.coords.lat, expert.location.coords.lng]} icon={customIcon}>
                            <Popup>
                                <div className="text-black font-bold">
                                    <p>Name: {expert.userId.name}</p>
                                    <p>Experience: {expert.experience} years</p>
                                    <p>Services:</p>
                                    {expert?.skills?.map((ele, index) => (
                                        <span  className="bg-yellow-400 text-white px-2 py-1 rounded-md mr-1" key={index}>{ele.name} </span>
                                    ))}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
            <div className="w-2/5 h-full overflow-y-auto p-4 bg-white shadow-md rounded-lg">
                {resultsExperts?.length > 0 ? (
                    resultsExperts.map((expert) => (
                        <div key={expert.userId._id} className="bg-gray-100 p-4 mb-4 rounded-lg shadow-sm">
                            <h1 className="text-xl font-semibold mb-2">{expert.userId.name}</h1>
                            <p className="text-gray-700"><span className="font-semibold">Experience :</span> {expert.experience} years</p>
                            <p className="text-gray-700"><span className="font-semibold">Ratings :</span> 4</p>
                            <p className="text-gray-700"><span className="font-semibold">Address :</span> {expert.location.address}</p>
                            <button className="bg-blue-500 text-white p-2 rounded-md cursor-pointer hover:bg-blue-600 mt-2"
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
