// customerHandlers.js

const customers = {}; // Store customer socket IDs

export const customerHandlers = (io, socket) => {
    //console.log("👤 Customer Connected:", socket.id);

    // ✅ Store customer socket ID when they join
    socket.on("joinCustomer", ({ userId }) => {
        if (!customers[userId]) {
            customers[userId] = socket.id;
            console.log("✅ Customer Registered:", userId, socket.id);
        } else {
            console.log("⚠️ Customer already connected:", userId);
        }
    });

    // ✅ Handle disconnection (remove from tracking)
    socket.on("disconnect", () => {
        Object.keys(customers).forEach((key) => {
            if (customers[key] === socket.id) {
                delete customers[key];
                console.log("⚠️ Customer disconnected:", key);
            }
        });
    });;
};

export { customers }; // Export customers so experts can access it
