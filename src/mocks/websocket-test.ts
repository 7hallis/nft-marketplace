
export function testMockWebSocket() {
  const socket = new WebSocket(
    "ws://localhost:5173/socket.io-mock/",
  );

  socket.addEventListener("open", () => {
    console.log("[Teste WS] Conexão aberta");
    socket.send("42[\"hello\",\"Thun\"]");
  });

  socket.addEventListener("message", (event) => {
    console.log("[Teste WS] Mensagem recebida:", event.data);
  });

  socket.addEventListener("error", () => {
    console.error("[Teste WS] Erro na conexão");
  });

  socket.addEventListener("close", (event) => {
    console.log("[Teste WS] Conexão encerrada:", event.code);
  });

  return socket;
}
