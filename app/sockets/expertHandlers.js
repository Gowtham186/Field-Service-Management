import trackLocation from "./trackLocation.js";
import { customers } from "./customerHandlers.js"; 

export const expertHandlers = (io, socket) => {
    console.log("🛠️ Expert connected:", socket.id);

    trackLocation(io, socket);

    // ✅ Notify the correct customer when expert arrives
    socket.on("expertArrived", ({ serviceId, customerId }) => {
        console.log("🚀 Expert arrived for service:", serviceId, "Customer ID:", customerId);

        const customerSocketId = customers[customerId]; 
        console.log('customerSocketId', customerSocketId)

        if (customerSocketId) {
            io.to(customerSocketId).emit("notifyCustomer", { message: "Your expert has arrived!" });
        } else {
            console.log("⚠️ Customer not connected.");
        }
    });
};
