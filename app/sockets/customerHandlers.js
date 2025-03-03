
const customers = {};

export const customerHandlers = (io, socket) => {
    console.log("👤 Customer Connected:", socket.id);

    socket.on("joinCustomer", ({ userId }) => {
        if (!customers[userId]) {
            customers[userId] = socket.id;
            socket.join(`customer-${userId}`)
            console.log("✅ Customer Registered:", userId, socket.id);
            console.log(`🏠 Customer joined room: customer-${userId}`);
        } else {
            console.log("⚠️ Customer already connected:", userId);
        }
    });

    socket.on("disconnect", () => {
        Object.keys(customers).forEach((key) => {
            if (customers[key] === socket.id) {
                delete customers[key];
                console.log("⚠️ Customer disconnected:", key);
            }
        });
    });;
};

export { customers }; 
