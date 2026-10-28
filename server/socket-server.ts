import { Server } from "socket.io";

const io = new Server(3001, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("[Socket.IO] Cliente conectado:", socket.id);

  socket.on("order:created", (order) => {
    console.log("[Socket.IO] Pedido recebido:", order.id);

    // Notifica os clientes conectados sobre o novo pedido.
    io.emit("order:created", order);
  });

  socket.on("disconnect", (reason) => {
    console.log("[Socket.IO] Cliente desconectado:", socket.id, reason);
  });
});

console.log("[Socket.IO] Servidor iniciado na porta 3001");