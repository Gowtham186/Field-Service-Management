import { useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const socket = io("http://localhost:4500");

const NotificationComponent = ({ userId, role }) => {
    useEffect(() => {
        console.log('NotificationComponent mounted or re-rendered');

        if (!userId || !role) {
            console.log('Missing userId or role');
            return;
        }

        console.log('userId:', userId, 'role:', role);

        if (role === "customer") {
            console.log('Emitting joinCustomer for userId:', userId);
            socket.emit("joinCustomer", { userId });
        }

        if (role === "expert") {
            console.log('Emitting joinExpert for userId:', userId);
            socket.emit("joinExpert", { userId });
        }

        socket.on("notifyCustomer", ({ message }) => {
            console.log("Received message for customer:", message);
            toast.success(`📢 ${message}`);
        });

        socket.on("notifyExpert", ({ message }) => {
            console.log("Received message for expert:", message);
            toast.info(`🔔 ${message}`);
        });

        // Cleanup on unmount or re-render
        return () => {
            console.log('Cleaning up socket listeners');
            socket.off("notifyCustomer");
            socket.off("notifyExpert");
        };
    }, [userId, role]);

    return null;
};

export default NotificationComponent;
