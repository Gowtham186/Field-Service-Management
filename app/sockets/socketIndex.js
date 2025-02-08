import { expertHandlers } from "./expertHandlers.js";
import { customerHandlers } from "./customerHandlers.js";
import { generalHandlers } from "./generalHandlers.js";

export const socketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log("🟢 New WebSocket Connection:", socket.id);

        expertHandlers(io, socket);
        customerHandlers(io, socket);
        generalHandlers(io, socket);
    });
};
