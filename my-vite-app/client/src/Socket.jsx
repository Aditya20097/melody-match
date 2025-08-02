import { io } from "socket.io-client";

const socket = io("  https://53d12190792f.ngrok-free.app", {
  transports: ["websocket"], // Force WebSocket for reliability
  secure: true,
});

export default socket;
