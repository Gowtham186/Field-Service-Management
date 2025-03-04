import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const expertIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});

const destinationIcon = new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

export default function LiveTracking() {
    const { serviceId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.user);
    const userId = user?._id;

    const destinationAddress = location.state?.destinationAddress || "Unknown Address";
    const destinationCoords = location.state?.destinationCoords || { latitude: 12.9716, longitude: 77.5946 };
    const customerId = location.state?.customerId;

    const [expertLocation, setExpertLocation] = useState(null);
    const [socket, setSocket] = useState(null);
    const [watchId, setWatchId] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const newSocket = io("http://localhost:4500");
        setSocket(newSocket);

        if ("geolocation" in navigator) {
            const id = navigator.geolocation.watchPosition(
                (position) => {
                    const newLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };

                    setExpertLocation(newLocation);

                    newSocket.emit("shareLocation", { 
                        userId, 
                        role: "expert", 
                        ...newLocation 
                    });

                    console.log("📍 Updated Expert Location:", newLocation);
                },
                (error) => console.error("Error getting location", error),
                { enableHighAccuracy: true }
            );

            setWatchId(id);
        }

        newSocket.on("expertsLocationUpdate", ({ userId: expertId, latitude, longitude }) => {
            if (expertId === userId) {
                setExpertLocation({ latitude, longitude });
            }
        });

        return () => {
            newSocket.disconnect();
        };
    }, [userId]);

    const handleArrived = () => {
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
        }

        if (socket) {
            socket.emit("expertArrived", { serviceId, customerId });

            console.log("📢 Emitting expertArrived:", { serviceId, customerId });

            socket.disconnect();
        }

        console.log("✅ Tracking Stopped. Navigating away...");
        navigate(-1);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-3">Live Tracking</h2>
            <p><strong>Expert ID:</strong> {userId}</p>

            {expertLocation ? (
                <MapContainer
                    center={[expertLocation.latitude, expertLocation.longitude]}
                    zoom={15}
                    style={{ height: "400px", width: "100%", borderRadius: "10px" }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {/* Route Line */}
                    <Polyline 
                        positions={[
                            [expertLocation.latitude, expertLocation.longitude],
                            [destinationCoords.latitude, destinationCoords.longitude]
                        ]}
                        color="blue"
                    />

                    {/* Expert Location */}
                    <Marker position={[expertLocation.latitude, expertLocation.longitude]} icon={expertIcon}>
                        <Popup>You are here</Popup>
                    </Marker>

                    {/* Destination Location */}
                    <Marker position={[destinationCoords.latitude, destinationCoords.longitude]} icon={destinationIcon}>
                        <Popup>
                            <strong>Destination:</strong> {destinationAddress}
                        </Popup>
                    </Marker>
                </MapContainer>
            ) : (
                <p className="text-gray-500">Getting your location...</p>
            )}

            <button
                onClick={handleArrived}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition"
            >
                Arrived
            </button>
        </div>
    );
}
