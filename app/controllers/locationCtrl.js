import Location from "../models/location-model.js";

export const updateLocation = async (req, res) => {
    try {
        const { serviceId, latitude, longitude } = req.body;
        
        if (!serviceId || !latitude || !longitude) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Store or update the expert's location
        await Location.findOneAndUpdate(
            { serviceId },
            { latitude, longitude, updatedAt: new Date() },
            { upsert: true, new: true }
        );

        res.status(200).json({ message: "Location updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
