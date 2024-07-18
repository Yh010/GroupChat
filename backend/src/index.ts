import { WebSocketServer, WebSocket } from 'ws';

interface User {
  socket: WebSocket;
  username: string;
  room: string | null;
}

interface Room {
  name: string;
  users: User[];
}

const server = new WebSocketServer({ port: 8080 });
const clients: User[] = [];
const rooms: Room[] = [];

server.on('connection', (socket: WebSocket) => {
  console.log('New client connected');

  const newUser: User = { socket, username: `User${clients.length + 1}`, room: null };
  clients.push(newUser);

  socket.send('Welcome to the group chat server! Please set your username, then join a room and start chatting with your friends!');

  socket.on('message', (data) => {
    const message = data.toString();
    const [command, ...args] = message.split(' ');

    if (command === '/setname') {
      const newUsername = args.join(' ');
      newUser.username = newUsername;
      socket.send(`Your username has been set to ${newUsername}`);
      return;
    }

    if (command === '/join') {
      const roomName = args.join(' ');
      let room = rooms.find(r => r.name === roomName);
      if (!room) {
        room = { name: roomName, users: [] };
        rooms.push(room);
      }
      if (newUser.room) {
        leaveRoom(newUser, newUser.room);
      }
      newUser.room = roomName;
      room.users.push(newUser);
      socket.send(`You have joined room ${roomName}`);
      return;
    }

    if (newUser.room) {
      const room = rooms.find(r => r.name === newUser.room);
      if (room) {
        room.users.forEach((client) => {
          if (client.socket.readyState === WebSocket.OPEN) {
            client.socket.send(`${newUser.username} says: ${message}`);
          }
        });
      }
    } else {
      socket.send('You need to join a room first!');
    }
  });

  socket.on('close', () => {
    console.log('Client disconnected');
    const index = clients.indexOf(newUser);
    if (index !== -1) {
      clients.splice(index, 1);
    }
    if (newUser.room) {
      leaveRoom(newUser, newUser.room);
    }
  });
});

function leaveRoom(user: User, roomName: string) {
  const room = rooms.find(r => r.name === roomName);
  if (room) {
    room.users = room.users.filter(u => u !== user);
    if (room.users.length === 0) {
      const roomIndex = rooms.indexOf(room);
      if (roomIndex !== -1) {
        rooms.splice(roomIndex, 1);
      }
    }
  }
}

console.log('WebSocket server is running on ws://localhost:8080');
