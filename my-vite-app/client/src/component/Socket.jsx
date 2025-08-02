import { io } from "socket.io-client";

const socket = io("https://melody-matches.onrender.com", {
  transports: ["websocket"],   // ✅ Skip polling
  secure: true,
});

export default socket;
