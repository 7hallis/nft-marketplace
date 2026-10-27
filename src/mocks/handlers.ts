
import { http, HttpResponse, ws } from "msw";
import { toSocketIo } from "@mswjs/socket.io-binding";

const nftSocket = ws.link("ws://localhost:5173/socket.io-mock/");

export const handlers = [
  http.get("https://api.example.com/user", () => {
    return HttpResponse.json({
      id: "abc-123",
      firstName: "John",
      lastName: "Maverick",
    });
  }),

 nftSocket.addEventListener("connection", (connection) => {
  console.log("[MSW] WebSocket conectado");

  const { client } = toSocketIo(connection);

  client.on("hello", (_event, name) => {
    console.log("[MSW] Evento hello recebido:", name);
    client.emit("greeting", `Olá, ${name}!`);
  });
})
];
