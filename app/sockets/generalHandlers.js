export const generalHandlers = (io, socket) => {
    console.log("🌐 General WebSocket Connection:", socket.id);

    socket.on("disconnect", () => {
        console.log("❌ User Disconnected:", socket.id);
    });
};
