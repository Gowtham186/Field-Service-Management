import { useEffect } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const socket = io("http://localhost:4500");

export default function ExpertLiveTracking() {
    const { user } = useSelector((state) => state.user);
    const userId = user?._id; 

    useEffect(() => {
        if (!userId) {
            console.log("❌ userId is undefined! Waiting for Redux state...");
            return;
        }

        if ("geolocation" in navigator) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    console.log("📡 Sending location update:", {
                        userId,
                        role: "expert",
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });

                    socket.emit("shareLocation", {
                        userId,
                        role: "expert",
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => console.log("❌ Location error:", error),
                { enableHighAccuracy: true }
            );

            return () => navigator.geolocation.clearWatch(watchId); // Clean up on unmount
        }
    }, [userId]); // ✅ Runs when userId is available

    return <p>Tracking Expert Location...</p>;
}
