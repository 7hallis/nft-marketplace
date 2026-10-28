import { io } from "socket.io-client";

export const socket = io("http://localhost:3001", {
  autoConnect: true,
  reconnection: true,
});

socket.on("connect", () => {
  console.log("[Socket.IO] Conectado:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("[Socket.IO] Erro de conexão:", error.message);
});

socket.on("order:created", (order) => {
  console.log("[Socket.IO] Evento de pedido recebido:", order);
});