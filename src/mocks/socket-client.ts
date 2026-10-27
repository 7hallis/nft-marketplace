import { io } from "socket.io-client";

export const socket = io("http://localhost:5173", {
  path: "/socket.io-mock/",
  transports: ["websocket"],
  autoConnect: false,
});

socket.on("connect", () => {
  console.log("[Kurio] Conectado ao mock:", socket.id);

  socket.emit("hello", "Thun");
});

socket.on("greeting", (message: string) => {
  console.log("[Kurio] Resposta do mock:", message);
});

socket.on("connect_error", (error) => {
  console.error("[Kurio] Erro na conexão:", error.message);
});
