import Location from "../models/location-model.js";

const experts = {};

const trackLocation = (io, socket) => {
    socket.on("shareLocation", async ({ userId, role, latitude, longitude }) => {
        if (role !== "expert") return; 

        experts[userId] = { latitude, longitude };
        socket.data.userId = userId;

        console.log(`📍 Expert ${userId} shared location:`, { latitude, longitude });

        try {
            await Location.findOneAndUpdate(
                { serviceId: userId }, 
                { latitude, longitude, updatedAt: new Date() }, 
                { upsert: true, new: true }
            );
        } catch (error) {
            console.error("Error updating location in MongoDB:", error);
        }

        io.emit("expertsLocationUpdate", { userId, latitude, longitude });
    });

    socket.on("disconnect", () => {
        if (socket.data.userId) {
            console.log(`Expert ${socket.data.userId} disconnected`);
            delete experts[socket.data.userId]; // Remove expert from tracking
            io.emit("expertDisconnected", { userId: socket.data.userId });
        }
    });
};

export default trackLocation;
