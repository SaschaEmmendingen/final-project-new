// Importiere das ws-Modul
import http from 'http';
import { WebSocketServer } from "ws";

// Erstelle den HTTP-Server
const server = http.createServer();

const wsServer = new WebSocketServer({ noServer: true });

// Wenn ein Client sich verbindet
wsServer.on('connection', (ws) => {
  console.log('Ein Client hat sich verbunden');
  ws.send('Willkommen! Sie erhalten Benachrichtigungen.');

  ws.on('message', (message) => {
    console.log(`Nachricht vom Client: ${message}`);
  });
});

// Starte den HTTP-Server
server.listen(8080, () => {
  console.log('Server läuft auf Port 8080');
});