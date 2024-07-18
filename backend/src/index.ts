import { WebSocketServer, WebSocket } from 'ws';

interface User {
  socket: WebSocket;
  username: string;
}

const server = new WebSocketServer({ port: 8080 });
const clients: User[] = [];

server.on('connection', (socket: WebSocket) => {
  console.log('New client connected');

  const newUser: User = { socket, username: `User${clients.length + 1}` };
  clients.push(newUser);

  socket.send('Welcome to the group chat server! Please set your username.');

  socket.on('message', (data) => {
    // Ensure the message is treated as a string
    const message = data.toString();

    if (message.startsWith('/setname ')) {
      const newUsername = message.split(' ')[1];
      newUser.username = newUsername;
      socket.send(`Your username has been set to ${newUsername}`);
      return;
    }

    console.log('Received message:', message);

    clients.forEach((client) => {
      if ( client.socket.readyState === WebSocket.OPEN) {
        client.socket.send(`${newUser.username}: ${message}`);
      }
    });
  });

  socket.on('close', () => {
    console.log(`${newUser.username} disconnected`);
    const index = clients.indexOf(newUser);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
