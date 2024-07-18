import React, { useState, useEffect, useRef } from "react";

const WebSocketClient: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const [username, setUsername] = useState<string | null>(null);
  const [room, setRoom] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:8080");

    socketRef.current.onopen = () => {
      console.log("Connected to the WebSocket server");
    };

    socketRef.current.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    socketRef.current.onclose = () => {
      console.log("Disconnected from the WebSocket server");
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() !== "" && socketRef.current) {
      socketRef.current.send(input);
      setInput("");
    }
  };

  const handleSetUsername = () => {
    if (input.trim() !== "" && socketRef.current) {
      socketRef.current.send(`/setname ${input}`);
      setUsername(input);
      setInput("");
    }
  };

  const handleJoinRoom = () => {
    if (input.trim() !== "" && socketRef.current) {
      socketRef.current.send(`/join ${input}`);
      setRoom(input);
      setInput("");
    }
  };

  return (
    <div>
      <h1>WebSocket Client</h1>
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message or command"
        />
        <button
          onClick={
            username ? (room ? sendMessage : handleJoinRoom) : handleSetUsername
          }
        >
          {username ? (room ? "Send Message" : "Join Room") : "Set Username"}
        </button>
      </div>
      <div>
        <h2>Messages</h2>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WebSocketClient;
