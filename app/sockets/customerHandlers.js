// customerHandlers.js

const customers = {}; // Store customer socket IDs

export const customerHandlers = (io, socket) => {
    console.log("👤 Customer Connected:", socket.id);

    // ✅ Store customer socket ID when they join
    socket.on("joinCustomer", ({ userId }) => {
        customers[userId] = socket.id;
        console.log("✅ Customer Registered:", userId, socket.id); // Log customer registration
    });

    // ✅ Handle disconnection (remove from tracking)
    socket.on("disconnect", () => {
        Object.keys(customers).forEach((key) => {
            if (customers[key] === socket.id) {
                delete customers[key];
                console.log("⚠️ Customer disconnected:", key); // Log disconnection
            }
        });
    });
};

export { customers }; // Export customers so experts can access it
