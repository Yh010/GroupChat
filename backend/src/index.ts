import { WebSocketServer, WebSocket } from 'ws';

const server = new WebSocketServer({ port: 8080 });

server.on("connection", (socket : WebSocket) => {
    console.log("new client connected");

    socket.send('welcome to group chat server');

    socket.on('message', (message: string) => {
        console.log('Received message:', message);
        
        server.clients.forEach((client) => {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
                client.send(`A client says: ${message}`);
            }
        })
    })
});

server.on("close", (socket: WebSocket) => {
    console.log("client disconnected");
});

console.log('WebSocket server is running on ws://localhost:8080');
