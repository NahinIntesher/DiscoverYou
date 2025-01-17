const WebSocket = require('ws');

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8420 }, () => {
  console.log('WebSocket server is running on ws://localhost:8420');
});

// Handle new client connections
wss.on('connection', (ws) => {
  console.log('A new client connected');

  // Handle incoming messages from a client
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);

    // Broadcast the message to all other connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(String(message));
      }
    });
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('A client disconnected');
  });
});
