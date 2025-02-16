import { useEffect, useState, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const expertIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const destinationIcon = new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

// Component to Re-center Map on Expert Location Update
const RecenterMap = ({ location }) => {
    const map = useMap();
    useEffect(() => {
        if (location) {
            map.setView([location.lat, location.lng], map.getZoom());
        }
    }, [location, map]);
    return null;
};

export default function CustomerTracking() {
    const { expertId } = useParams();
    const navigate = useNavigate();
    const [expertLocation, setExpertLocation] = useState(null);
    const socketRef = useRef(null);

    const location = useLocation();
    const serviceAddress = location.state?.serviceAddress || "Unknown Address";
    const serviceCoords = location.state?.serviceCoords;
    
    console.log("Service Address:", serviceAddress);
    console.log("Service Coords:", serviceCoords);

    useEffect(() => {
        if (!expertId) {
            console.warn("No expertId provided!");
            return;
        }

        if (!socketRef.current) {
            socketRef.current = io("http://localhost:4500");
        }

        const socket = socketRef.current;

        socket.on("connect", () => {
            console.log("WebSocket Connected:", socket.id);
        });

        // Listen for expert location updates
        socket.on("expertsLocationUpdate", ({ userId, latitude, longitude }) => {
            console.log("📡 Received Expert Location Update:", { userId, latitude, longitude });

            if (userId === expertId) {
                setExpertLocation({ lat: latitude, lng: longitude });
            }
        });

        // Keep last known location if expert disconnects
        socket.on("expertDisconnected", ({ userId }) => {
            console.log(`Expert ${userId} disconnected`);
        });

        return () => {
            console.log("Component unmounted but keeping socket active.");
        };
    }, [expertId]);

    const handleBack = () => {
        if (socketRef.current) {
            console.log("Disconnecting socket on back navigation...");
            socketRef.current.disconnect();
            socketRef.current = null;
        }
        navigate(-1);
    };

    return (
        <div className="p-4 bg-white shadow-lg rounded-lg">
            <h2 className="text-lg font-bold mb-3">Expert's Live Location</h2>

            {expertLocation ? (
                <MapContainer
                    center={[expertLocation.lat, expertLocation.lng]}
                    zoom={15}
                    style={{ height: "400px", width: "100%", borderRadius: "10px" }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    
                    {/* Automatically Re-center the map when location updates */}
                    <RecenterMap location={expertLocation} />

                    {/* Expert's Live Location */}
                    <Marker
                        key={`${expertLocation.lat}-${expertLocation.lng}`}  
                        position={[expertLocation.lat, expertLocation.lng]}
                        icon={expertIcon}
                    >
                        <Popup>Expert is here</Popup>
                    </Marker>

                    {/* Destination Location */}
                    <Marker position={[serviceCoords.latitude, serviceCoords.longitude]} icon={destinationIcon}>
                        <Popup>
                            <strong>My location:</strong> {serviceAddress}
                        </Popup>
                    </Marker>

                    {/* Route Line between Expert and Destination */}
                    <Polyline 
                        positions={[
                            [expertLocation.lat, expertLocation.lng], 
                            [serviceCoords.latitude, serviceCoords.longitude]
                        ]}
                        color="blue"
                        weight={5}
                        opacity={0.7}
                    />
                </MapContainer>
            ) : (
                <p className="text-gray-600 mt-2">Waiting for expert location...</p>
            )}

            {/* Back Button */}
            <button 
                onClick={handleBack} 
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
            >
                Back
            </button>
        </div>
    );
}
