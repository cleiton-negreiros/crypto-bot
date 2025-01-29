// server.js (backend)
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 }); // Servidor WebSocket na porta 8080

wss.on('connection', (ws) => {
  console.log('Novo cliente conectado');

  ws.on('message', (message) => {
    console.log(`Mensagem recebida: ${message}`);
    ws.send(`Echo: ${message}`); // Envia uma resposta de volta ao cliente
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

console.log('Servidor WebSocket rodando na porta 8080');