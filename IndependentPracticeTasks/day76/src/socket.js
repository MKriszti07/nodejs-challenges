import { Server } from "socket.io";

let ioInstance = null;

export function initSocket(httpServer) {
    ioInstance = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    ioInstance.on("connection", (socket) => {
        console.log(`🔌 Client connected: ${socket.id}`);

        socket.emit("welcome", {
            message: "Connected to Real-Time Analytics stream"
        });

        socket.on("disconnect", () => {
            console.log(`❌ Client disconnected: ${socket.id}`);
        });
    });

    return ioInstance;
}

export function getIO() {
    if (!ioInstance) {
        throw new Error("Socket.IO not initialized. Call initSocket(server) first.");
    }
    return ioInstance;
}