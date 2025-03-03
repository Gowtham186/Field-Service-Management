import trackLocation from "./trackLocation.js";
import { customers } from "./customerHandlers.js";

const experts = {};

export const expertHandlers = (io, socket) => {
    console.log("🛠️ Expert connected:", socket.id);

    trackLocation(io, socket);

    socket.on("joinExpert", ({ userId }) => {
        if (!experts[userId]) {
            experts[userId] = socket.id;
        }
        socket.join(`expert-${userId}`); // Ensure expert joins their unique room
        console.log(`✅ Expert Registered: ${userId}, Socket ID: ${socket.id}`);
        console.log(`🏠 Expert joined room: expert-${userId}`);
    });

    // Notify the correct customer when expert arrives
    socket.on("expertArrived", ({ serviceId, customerId }) => {
        console.log("🚀 Expert arrived for service:", serviceId, "Customer ID:", customerId);

        const customerSocketId = customers[customerId];
        console.log("customerSocketId:", customerSocketId);

        if (customerSocketId) {
            io.to(customerSocketId).emit("notifyCustomer", { message: "Your expert has arrived!" });
        } else {
            console.log("⚠️ Customer not connected.");
        }
    });

    // ✅ Handle expert disconnection
    socket.on("disconnect", () => {
        console.log("❌ Expert disconnected:", socket.id);
        Object.keys(experts).forEach((key) => {
            if (experts[key] === socket.id) {
                delete experts[key];
                console.log(`🧹 Removed expert: ${key}`);
            }
        });
    });
};
